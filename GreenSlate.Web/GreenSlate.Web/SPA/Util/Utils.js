
define(
    "Utils", // Name of the interface this module implements. 

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

        function getView(viewurl, dataapi, callback) {
            var relativeViewUrl =
                "~/view/getview?appVersion="
                + appVersion.get() // cache busting
                + "&viewName=" + viewurl; // view name
            $.get(resolveUrl(relativeViewUrl), function (responseViewSource) {
               // console.log(responseViewSource);
                viewSource = responseViewSource;
                if (dataapi === null) {
                    // Check if we now have both the VM and the view.
                    callback(viewSource);
                }
                else {
                    $.get(dataapi, function (data) {
                        console.log('dataapi:', dataapi, data);
                        callback(viewSource, data);
                    });

                }
            }
            );
        }

        function redirectToList() {
            $(".app-content-body").empty();
            window.location.href = "/#/task";
            console.log(window.location.host + "/#/task");

        }
        // Return the module.
        return {
            getView: getView,
            redirectToList: redirectToList
        };
    }
);

