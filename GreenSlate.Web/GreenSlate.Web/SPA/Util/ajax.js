
define(
    "Util.ajax", // Name of the interface this module implements. 
    [], // List of dependencies.
    function( /* Dependency injections: */) {

        // init the list of requests currently executing
        if (typeof (window._currentAjaxRequests) == "undefined") {
            window._currentAjaxRequests = [];
        }

        if (typeof (window._ajaxRetryRequests) == "undefined") {
            window._ajaxRetryRequests = [];
        }

        function noteRequestStarted(url) {
            // chop off any query string
            url = url.split("?")[0];

            window._currentAjaxRequests.push(url);

            // start the progress bar!
            NProgress.start();
        }

        function removeFromRetry(url) {
            for (var i = 0; i < window._ajaxRetryRequests.length; i++) {
                var reqUrl = window._ajaxRetryRequests[i];
                if (reqUrl.Url == url) {
                    window._ajaxRetryRequests.splice(index, 1);
                }
            }
        }

        function retryAjaxCall(url, ajaxcall, finalFailCallback) {
            var timesTry = 0;
            //try finding the request
            var index = -1;
            for (var i = 0; i < window._ajaxRetryRequests.length; i++) {
                var reqUrl = window._ajaxRetryRequests[i];
                if (reqUrl.Url == url) {
                    reqUrl.TryTimes++;
                    timesTry = reqUrl.TryTimes;
                    index = i;
                    break;
                }
            }

            //if request url doesn't exist add it

            if (index == -1) {

                window._ajaxRetryRequests.push({
                    TryTimes: 1,
                    Url: url
                });
            }

            //try 5 times until success
            //if 5 times with errors move on
            if (timesTry > window.numberOfTriesForCheckPrintFailedAjaxRequest) {
                window._ajaxRetryRequests.splice(index, 1);
                if (typeof finalFailCallback == "function") {
                    finalFailCallback();
                }
            } else {
                //try again
                setTimeout($.ajax(ajaxcall), 1000);

            }
        }

        function noteRequestFinished(url) {
            // chop off any query string
            url = url.split("?")[0];

            for (var i = 0; i < window._currentAjaxRequests.length; i++) {
                var reqUrl = window._currentAjaxRequests[i];
                if (reqUrl == url) {
                    // remove this request and abort loop.
                    window._currentAjaxRequests.splice(i, 1);
                    break;
                }
            }

            if (window._currentAjaxRequests.length == 0) {
                // All done -- stop the progress bar.
                NProgress.done();
            } else {
                // Otherwise, let's progress it a bit
                NProgress.inc();
            }
        }

        return {

            //todo move it somewhere else
            // options: parameters, successMessage, destinationUrl, internalServerErrorCallback, okCallback, submitElement, guid) {
            send: function (apiUrl, type, options) {
                var $elementClicked = $("[data-guid= " + options.guid + "]");

                if ($elementClicked.is(":disabled")) {
                    return;
                }

                // Format all dates to whatever WEB API is expecting (UTC for now)
                convertAllDateTypesToDateStrings(options.parameters);

                if (options === null || typeof (options) === "undefined") {
                    options = {};
                }
                
                if (options.guid) {
                    // This timeout is here because this is triggering an event on a submit button while it is 
                    // completing another event on the same submit button and this leads to future events being
                    // cancelled for some reason. The timeout ensures that this event happens after queued events.
                    setTimeout(function () {
                        $elementClicked.trigger(events.ajaxSent);
                    });
                }
                
                var resolvedUrl = resolveUrl(apiUrl);
                // get params -- supplied or empty array
                var params = (typeof (options.parameters) !== "undefined" ? options.parameters : {});

                // add cache busting param
                params.appVersion = appVersion.get();

                if ((type.toLowerCase() == "delete" || type.toLowerCase() == "put") && params != null) {

                    var first = resolvedUrl.indexOf("?") < 0;
                    $.each(params, function(key, value) {
                        if (first) {
                            resolvedUrl += "?" + key + "=" + value;
                            first = false;
                        } else {
                            resolvedUrl += "&" + key + "=" + value;
                        }

                    });
                    params = null;
                }

                var makeTheCall = true;
                if (options.confirm) {
                    var confirmMessage = options.confirmMessage;
                    if (!confirmMessage) {
                        confirmMessage = "Are you sure you want to " + type.toLowerCase() + " a record?";
                    }
                    makeTheCall = confirm(confirmMessage);
                }

                if (makeTheCall) {

                    // Add this request to the list of those currently executing.
                    noteRequestStarted(resolvedUrl);

                    $.ajax({
                        url: resolvedUrl,
                        type: type,
                        dataType: "json",
                        data: params,
                        cache: false,
                        headers: {
                            //http://indiepaywiki.com/index.php?title=Security#CSRF_Prevention_without_a_Synchronizer_Token
                            'RequestVerificationToken': antiForgeryTokens.get()
                        },
                        statusCode: {
                            // Ok
                            200: function (responseData) {
                                // If there is a guid associated with this ajax call and the ajax call succeeds 
                                // then fire off the ajaxSuccessEvent on the element.
                                if (options.guid) {
                                    $("[data-guid= " + options.guid + "]").trigger(events.ajaxSuccess);
                                }

                                if (responseData.NotifyMessage) {
                                    setTimeout(function () {
                                        notify.success(responseData.NotifyMessage, true, true);
                                    }, 0);
                                }

                                // Convert all properties that are string dates to Date objects
                                convertAllDateStringsToDateTypes(responseData);
                                // If the default behavior was overriden
                                if (typeof (options.okCallback) !== "undefined") {
                                    var ajaxcall = this;
                                    options.okCallback(responseData, ajaxcall, options.guid);
                                }
                              
                                // Default behavior
                                if (typeof (options.successMessage) !== "undefined") {
                                    // show success message
                                    notify.success(options.successMessage);
                                }
                                if (typeof (options.warningMessage) !== "undefined") {
                                    // show warning message
                                    notify.warn(options.warningMessage);
                                }
                                if (typeof (options.destinationUrl) !== "undefined") {

                                    // redirect
                                    indiePay$redirect(options.destinationUrl);

                                }
                            },
                            // Bad request
                            400: function (validationErrors) {
                                if (options.guid) {
                                    $("[data-guid= " + options.guid + "]").trigger(events.ajaxFailed, validationErrors);
                                }

                                $("html, body").animate({ scrollTop: 0 }, "slow");
                                var obj = JSON.parse(validationErrors.responseText);
                                
                                // Convert errors object to array of error messages
                                var errorMessages = [];

                                var errorMessage = Object.values(obj.ModelState)[0];
                                var projectOutOfScopeExceptionInfo = false;

                                if (isJsonString(errorMessage)) {
                                    projectOutOfScopeExceptionInfo = JSON.parse(errorMessage);
                                };
                                
                                if (projectOutOfScopeExceptionInfo && projectOutOfScopeExceptionInfo.ProjectTitle) {
                                    requirejs([
                                        "ViewModels.Shared.ConfirmationWindowVM",
                                        "ViewModels.Project.ProjectSelectorVM"
                                    ],
                                        function (ConfirmationWindowVM, ProjectSelectorVM) {
                                            var confirmationWindow = new
                                                ConfirmationWindowVM(TextContent.GetText("SwitchProject.Title"),
                                                    kendo.format(TextContent.GetText("SwitchProject.Description"), projectOutOfScopeExceptionInfo.ProjectTitle),
                                                    function () {
                                                        var projectSelector = new ProjectSelectorVM();

                                                        projectSelector.selectedProject = parseInt(projectOutOfScopeExceptionInfo.ProjectId);

                                                        projectSelector.selectProject(function () {
                                                            location.reload();
                                                        });
                                                    });

                                            confirmationWindow.ShowWindow();
                                        });

                                } else if (obj.ModelState !== undefined) {
                                    // This is a special case where we do a redirect instead. 
                                    // I would love to use a 302 for this, but that causes the AJAX call to redirect rather than hitting our handler.
                                    var REDIRECT_KEY = "redirectModel";
                                    var redirectRelativeUrlArray = obj.ModelState[REDIRECT_KEY];
                                    if (typeof (redirectRelativeUrlArray) == "object") {
                                        // Do the redirect.
                                        var redirectModel = $.parseJSON(redirectRelativeUrlArray[0]);
                                        redirectRelativeUrl = redirectModel.RedirectRelativeUrl;
                                        // if there is a message notify 
                                        indiePay$redirect(redirectRelativeUrl);

                                        var message = redirectModel.Message;
                                        var keepOpen = redirectModel.KeepOpen;
                                        if (message) {
                                            notify.info(message, true, keepOpen);
                                        }

                                        // Abort any further processing.
                                        return;
                                    }
                                    for (var field in obj.ModelState) {
                                        errorMessages.push(obj.ModelState[field]);
                                    }
                                } else {
                                    // If ModelState doesn't exist, then this is an exception
                                    // so just push ex.Message
                                    errorMessages.push(obj.Message);
                                }
                                
                                // Notify errors
                                notifyErrors(errorMessages, options.submitElement);

                                var errorMessagesString = errorMessages.join(", ");
                                console.log("Analytics: Exception " + errorMessagesString);
                                ga("send", {
                                    hitType: "event",
                                    eventCategory: resolvedUrl,
                                    eventAction: "validation errors",
                                    eventLabel: errorMessagesString
                                });

                                if (typeof (options.onvalidationErrors) !== "undefined") {
                                    options.onvalidationErrors();
                                }
                            },
                            // Unauthorized
                            401: function () {
                                if (options.guid) {
                                    $("[data-guid= " + options.guid + "]").trigger(events.ajaxFailed);
                                }

                                // TODO: Check if the user isnt authenticated or if they just lack the proper permissions.

                                var unauthenticatedAjaxRequest = this;
                                    // redirect to the login page
                                    requirejs([
                                            "Util.dialog", "Util.baseVM", "ViewModels.Authentication.LoginVM", "pubSub", "router"
                                        ],
                                        function (dialog, baseVM, LoginVM, pubSub, router) {
                                            reloadAntiForgeryToken(function () {

                                                pubSub.publish(pubSub.MESSAGES.REFRESH_UI);
                                                var currentRoute = window.location.hash.substr(1);
                                                var routeRequiresAuthe = router.routeRequiresAuth(currentRoute);
                                                //only popup if route requires Auth
                                                if (routeRequiresAuthe) {
                                                
                                                dialog
                                                    .spaWindow(new LoginVM(undefined, true, false),
                                                        "authentication/login",
                                                        "<p id='security-lock-header'>Security Lock</p>",
                                                        undefined,
                                                        undefined,
                                                        400,
                                                        false,
                                                        true,
                                                        LogUserOut,
                                                        false);
                                                }

                                            });

                                            // when you try to send an ajax request and it fails because your not authenticated
                                            // then retry that ajax call after login
                                            pubSub.subscribe(pubSub.MESSAGES.LOG_IN,
                                                function () {
                                                    if (typeof unauthenticatedAjaxRequest != "undefined") {
                                                        $.ajax(unauthenticatedAjaxRequest);
                                                        unauthenticatedAjaxRequest = undefined;
                                                    }
                                                });
                                        });
                            },
                            // Forbidden
                            403: function () {
                                if (options.guid) {
                                    $("[data-guid= " + options.guid + "]").trigger(events.ajaxFailed);
                                }

                                // TODO: Check if the user isnt authenticated or if they just lack the proper permissions.
                                    indiePay$redirect("#/errorhandler/accessdenied");
                               
                            },
                            // Not found.
                            404: function () {
                                if (options.guid) {
                                    $("[data-guid= " + options.guid + "]").trigger(events.ajaxFailed);
                                }

                                // If the default behavior was overriden
                                if (typeof (options.notFoundCallback) !== "undefined") {
                                    options.notFoundCallback();
                                }
                                // Default behavior
                                else {
//                                    notify.error("Resource could not be found.");
                                    console.log("Resource could not be found.");
                                    indiePay$redirect("#/errorhandler/routemissing");
                                }
                            },
                            // Internal error
                            500: function(error) {
                                if (options.guid) {
                                    $("[data-guid= " + options.guid + "]").trigger(events.ajaxFailed);
                                }
                                // If the default behavior was overriden
                                if (typeof (options.internalServerErrorCallback) !== "undefined") {
                                    options.internalServerErrorCallback(error);
                                }
                                // If the default behavior was overriden
                                if (typeof (options.internalServerErrorReturnAjaxCallCallback) !== "undefined") {
                                    var ajaxcall = this;
                                    options.internalServerErrorReturnAjaxCallCallback(error,ajaxcall);
                                }
                                // Default behavior
                                else {
                                    console.log(error.statusText);
                                }
                            },
                            // this is a bogus code just for Anti Forgery
                            // it is not a code we made it up just to distinguish Antiforgery tokens
                            900: function () {
                                var ajaxcall = this;

                                //reload Antiforgery 
                                reloadAntiForgeryToken(function () {
                                    ga("send", {
                                        hitType: "event",
                                        eventCategory: "antiforgery",
                                        eventAction: "antiforgery error"
                                    });
                                    ajaxcall.headers.RequestVerificationToken = antiForgeryTokens.get();
                                    retryAjaxCall(ajaxcall.url, ajaxcall);
                                });
                            }
                        },
                        complete: function () {

                            // Remove this request from the list of those currently executing.
                            noteRequestFinished(resolvedUrl);

                        }
                    });
                }
            },
            retry: function(url, ajaxcall,finalFailCallback) {
                retryAjaxCall(url, ajaxcall, finalFailCallback);
            },
            removeFromRetry: function(url) {
                removeFromRetry(url);
            },
            sendSync: function(url) {
                var responseText = $.ajax({
                    type: "GET",
                    url: resolveUrl(url),
                    async: false
                }).responseText;

                return responseText;
            }
        };
    }
);
$(document).ready(function () {
    $(document.body).on(events.ajaxSent, ".btn-event, .prevent-multi-submit", function () {
        $(this).attr("disabled", true);
        $(this).addClass("loading");
    });

    $(document.body).on(kendo.format("{0}, {1}", events.ajaxSuccess, events.ajaxFailed), ".btn-event, .prevent-multi-submit", function () {
        $(this).removeClass("loading");
        $(this).attr("disabled", false);
    });
});