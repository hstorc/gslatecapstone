
define(
    // == INTERFACE NAME ==
    "Controllers.ErrorHandler",

     // == DEPENDENCIES ==
    [
        "Util.getViewResources",
        //"Util.ViewHelper",
        "Util.layout"
    ],

    function (
        // == DEPENDENCY INJECTIONS ==
        getViewResources,
        //viewHelper,
        layout
    )
    {
        // == CONSTRUCTOR ==
        function ErrorHandlerController() {
            console.log("ErrorHandlerController constructor executing.");
        }

        // == PROPERTIES & METHODS ==
        // #/ErrorHandler/AccessDenied
        ErrorHandlerController.prototype.accessdenied = function () {
            getViewResources("ErrorHandler/AccessDenied", null, function (viewSource) {
                // create the view
                var view = bindView(viewSource);

                // render the view
                layout.renderBodyView(view);
            });
        }
        
        // #/ErrorHandler/routemissing
        ErrorHandlerController.prototype.routemissing = function () {
            //console.log('executed', getViewResources);   
            getViewResources("ErrorHandler/routemissing", null, function (viewSource) {

                // create the view
                
                var view = bindView(viewSource);
                console.log('view:', view);
                // render the view
                layout.renderBodyView(view);
            });
        };

        // #/ErrorHandler/internalerror
        ErrorHandlerController.prototype.internalerror = function () {

            getViewResources("ErrorHandler/internalerror", null, function (viewSource) {

                // create the view
                var view = bindView(viewSource);

                // render the view
                layout.renderBodyView(view);
            });
        };


        // #/ErrorHandler/forbidden
        ErrorHandlerController.prototype.forbidden = function () {

            getViewResources("ErrorHandler/forbidden", null, function (viewSource) {

                // create the view
                var view = bindView(viewSource);

                // render the view
                layout.renderBodyView(view);
            });
        };
        // Return the module.
        return ErrorHandlerController;
    }
);