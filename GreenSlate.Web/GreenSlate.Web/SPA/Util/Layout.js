
define(
    "Util.layout", // Name of the interface this module implements. 

    // == DEPENDENCIES ==
    [
        "pubSub"
    ],
    function (
        // == DEPENDENCY INJECTIONS ==
        pubSub
    ) {

        // TODO: grab this view from a remote html file
        //var layout = new kendo.Layout('<div id="window"></div><div id="nav"></div><div id="body"></div><div id="footer"></div>');

        // render the layout
        //layout.render("#app");

        var BODY_SELECTOR = ".app-content-body";
        var LEFT_NAV_SELECTOR = "#leftNav";
        var HEADER_SELECTOR = "#header";
        var TOP_BANNER_SELECTOR = "#maintenance-alert";

        // We declare the spinner once and just re-use it.
        //var spinnerView = bindView("<div class='page-load-spinner text-center'><div class='spinner'><div class='double-bounce1'></div><div class='double-bounce2'></div></div></div>");

        function RemoveDiv(divId) {
            
            $(divId + " > div:nth-child(1)").fadeOut('fast', function () {
                // If the animation finishes first, then the spinner will remove itself.
                // Otherwise, the native "showIn" method will remove the spinner when
                // the new view finishes loading.
                $(this).remove();
            });
        }

        var useCount = {};
        var MAX_DOM_OBJECTS = 3;
        
        // Define the module.
        var module =
        {
            // http://blogs.telerik.com/kendoui/posts/13-05-02/a-day-at-the-spa-with-kendo.layout
            renderNavView: function(view) {
                // Render the new view.
                // NOTE: The layout automatically calls the disposal methods on the old view.
                
                $(LEFT_NAV_SELECTOR).empty();

                view.render(LEFT_NAV_SELECTOR);
                $(document.body).trigger(events.leftNavRendered);
            },
            renderHeaderView: function (view) {
                // Render the new view.
                // NOTE: The layout automatically calls the disposal methods on the old view.
                $(HEADER_SELECTOR).empty();

                view.render(HEADER_SELECTOR);

            },
            renderBodyView: function (view, domCachingKey) {
                var $body = $(BODY_SELECTOR);
                var isCacheable = typeof (domCachingKey) === "string";
                if (isCacheable) {
                    // TODO: This seems to sometimes allow more than three views to be cached.

                    // Check the number of objects in the useCount hash
                    if (Object.keys(useCount).length >= MAX_DOM_OBJECTS) {
                        //Sort the views by their use count
                        var tuples = [];
                        for (var key in useCount)
                            if (useCount.hasOwnProperty(key))
                                tuples.push([key, useCount[key]]);

                        tuples.sort(function (a, b) { return a[1] < b[1] ? 1 : a[1] > b[1] ? -1 : 0 });

                        useCount = {};
                        for (var nDex = 0; nDex < tuples.length; nDex++) {
                            var tuple = tuples[nDex];
                            if (nDex < MAX_DOM_OBJECTS) {
                                // Keep the top MAX_DOM_OBJECTS views. Place a cap on the use count, or else the view might never get removed.
                                useCount[tuple[0]] = (tuple[1] < MAX_DOM_OBJECTS ? tuple[1] : MAX_DOM_OBJECTS);
                            } else {
                                // OTW, remove the least-used view(s)
                                var item = tuple[0];
                                var itemToRemove = $body.find("div[cachekey='" + item + "']");
                                itemToRemove.remove();
                            }
                        }
                    }
                    // Add the new item to the use count hash
                    if (isNaN(useCount[domCachingKey])) {
                        useCount[domCachingKey] = 0;
                    } 
                    // Increment the use count for this dom key
                    useCount[domCachingKey] += 1;
                }

                // clear the active pages
                // NOTE: although it's not usually neccasary, we do this again here in addition to "begin route change." 
                //       this is to catch the odd case where we don't change the route but refresh the page. 
                clearActivePages();

                // hide spinner
                $(".page-load-spinner").hide();

                // if it's cacheable, search for existing and show or render anew.
                // else, render in normal div.
                if (isCacheable) {
                    // does it exist?
                    var $existingCachedDiv = $body.find("div[cachekey='" + domCachingKey + "']");

                    if ($existingCachedDiv.length > 0) {
                        // we found it! just show it.
                        $existingCachedDiv.show();
                    } else {
                        // let's render it fresh.
                        // create a DIV in the body
                        var $newCacheDiv = $("<div>", { "cachekey": domCachingKey });
                        $body.append($newCacheDiv);

                        // render the view in this DIV
                        view.render($newCacheDiv);
                    }
                } else {
                    // this view is never cached, so we just render it anew each time
                    // create a DIV in the body
                    var $newNonCachedDiv = $("<div class='non-cached'>");
                    $body.append($newNonCachedDiv);

                    // render the view in this DIV
                    view.render($newNonCachedDiv);
                }

                // Set browser page title.
                if (view.model) {
                    if (view.model.Title) {
                        if (typeof view.model.Title === "function") {
                            document.title = view.model.Title();
                        } else {
                            document.title = view.model.Title;
                        }
                    } else if (!view.model.Title) {
                        var html = $.parseHTML(view.content);
                        var titleBar = _.find(html, function (a) {
                            return $(a).hasClass("page-title-bar");
                        });
                        var pageTitleText = $(titleBar).find("h1").text();

                        document.title = pageTitleText;
                        console.log("View Model needs a Title.");
                    }
                }

                // fire off an event for anyone who cares
                $(document.body).trigger(events.bodyViewRendered);
            },

            renderViewInDiv: function (view, divSelector) {
                var div = $(divSelector);
                //// Add view to div
                div.empty();

                // This wouldn't work as we check the ".app-content-body" DIV to get the currentVM. 
                // Removing it so we don't have false results.
                //div.currentVm = view.model;

                //// Now we re-populate the div.
                view.render(divSelector);
            },
            renderFooterView: function(view) {
                // Render the new view.
                // NOTE: The layout automatically calls the disposal methods on the old view.
                view.render(FOOTER_SELECTOR);
            },
            renderTopBanner: function (viewModel) {
                kendo.bind($(TOP_BANNER_SELECTOR), viewModel);
            },
            onBeginBodyViewTransition: function () {

                // Clear all visible pages
                clearActivePages();

                // show spinner
                $(".page-load-spinner").show();
            }
        };

        function clearActivePages() {
            var $body = $(BODY_SELECTOR);

            // remove or hide any DIVs within body which aren't cached.
            $body.find("div[cachekey]:visible").hide();

            // remove all non-cached DIVs
            $body.find("div.non-cached:visible").remove();
        }

        function removeAllPages() {
            
            var $body = $(BODY_SELECTOR);

            // remove all cached pages
            $body.find("div[cachekey]").remove();

            // NOTE: All non-cached pages will be cleared automatically. No need to do it here.
        }

        // Whenever the user logs out, changes their project, or has their permissions changed, we destroy all pages and start over.
        pubSub.subscribe(pubSub.MESSAGES.PROJECT_SELECTED, removeAllPages);
        pubSub.subscribe(pubSub.MESSAGES.PERMISSION_CHANGED, removeAllPages);
        pubSub.subscribe(pubSub.MESSAGES.LOG_OUT, removeAllPages);
        pubSub.subscribe(pubSub.MESSAGES.REFRESH_UI, removeAllPages);

        // Return the module.
        return module;
    }
);