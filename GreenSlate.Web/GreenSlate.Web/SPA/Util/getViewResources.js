
define(
    "Util.getViewResources", // Name of the interface this module implements. 

    [
        // List of dependencies.
        "Util.ajax",
    ],

    function (
        /* Dependency injections: */
        ajax
    ) {

        // Define the cache once on init.
        var cachedViewSources = {};

        // Define the module.
        var module =
            function (viewUrl, viewModelUrl, callback) {
             //   console.log('getViewResources:viewUrl=', viewUrl);
            //    console.log('getViewResources:viewModelUrl=', viewModelUrl);
             //   console.log('getViewResources:callback=', callback);
                var viewSource = null;
                var viewModel = null;

                function checkIfDone() {
                    if (viewSource != null && viewModel != null) {
                       // console.log('viewmodel:',viewModel);

                        // Return everything to the caller.
                        callback(viewSource, viewModel);
                    }
                }
                console.log('typeof (viewModelUrl) == "string":', typeof (viewModelUrl));
                if (typeof (viewModelUrl) == "string") {
                    var queryString = QueryString();
                    if (queryString && queryString.view && queryString.grid) {
                        if (viewModelUrl.indexOf("?") > 0) {
                            viewModelUrl += "&";
                        } else {
                            viewModelUrl += "?";
                        }
                        viewModelUrl += "view=" + queryString.view + "&grid=" + queryString.grid + "&date=" + Date();
                    }
                    // Fetch the view model.
                    console.log("Fetching VM...");
                    ajax.send(
                        viewModelUrl,
                        "GET",
                        {
                            okCallback: function (responseData) {
                                // Store the view model.
                                console.log("responseData:", responseData);
                                viewModel = responseData;

                                console.log("VM fetched. " + viewModelUrl);

                                // Check if we now have both the VM and the view.
                                checkIfDone();
                            }
                        }
                    );
                }
                else {

                    // Store the view model.
                    viewModel = {};

                    console.log("No VM needed.");

                    // Check if we now have both the VM and the view.
                    checkIfDone();
                }

                // Get the view source.
                console.log("Fetching view...");

                // Derive view URL
                var relativeViewUrl =
                    "~/view/getview?appVersion="
                    + appVersion.get() // cache busting
                    + "&viewName=" + viewUrl; // view name

                var cachedViewSource = cachedViewSources[relativeViewUrl];
                if (typeof (cachedViewSource) == "string") {
                    // testing only
                    console.log("Fetched view from cache: " + relativeViewUrl);

                    // pass the cached view to the caller
                    viewSource = cachedViewSource;

                    // Check if we now have both the VM and the view.
                    checkIfDone();
                }
                else {
                    // get it from the server
                    $.get(resolveUrl(relativeViewUrl), function (responseViewSource) {
                        // testing only
                        console.log("Fetched view from server: " + relativeViewUrl);
                        //don't cache login authentication view 
                        //this is so recaptcha doeesn't get cached
                        if (relativeViewUrl.indexOf("authentication/login") < 0) {
                            // cache it
                            cachedViewSources[relativeViewUrl] = responseViewSource;
                        }
                        // pass it to the caller
                        viewSource = responseViewSource;

                        // Check if we now have both the VM and the view.
                        checkIfDone();
                    });
                }
            };

        // Return the module.
        return module;
    }
);

