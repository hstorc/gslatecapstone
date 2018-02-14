define(
    // == CLASS NAME ==
    "router",

    // == DEPENDENCIES ==
    [
        "Util.layout",
        "pubSub"
    ],
    function (
        // == DEPENDENCY INJECTIONS ==
        layout,
        pubSub
    ) {
        console.log('layout', layout);
        console.log('pubSub', pubSub);
        // This method is used to lazy-load the resources required by a controller the first time it is needed,
        // rather than having to load all controllers when the router inits.
        function GetControllerMethod(controllerClassName, controllerMethodName, renderMethod) {
            return function () {
                // Store the route parameters.
                var routeArguments = arguments;
                // Get the controller from the dependency injector.
                console.log(controllerClassName);
                requirejs([controllerClassName], function (ControllerClass) {
                    // Instantiate the controller.
                    console.log(controllerClassName);
                    var controller = new ControllerClass(renderMethod);

                    // Call the action method on the controller.
                    controller[controllerMethodName].apply(
                        controller, // Call it like this so "this" will be the controller instance itself.
                        routeArguments); // Pass the original route parameters.
                });
            }
        }

        var routeInfos = {};

        function renderRoute(route, renderCallback) {
            // get the route
            var routeInfo = routeInfos[route];

            if (!routeInfo) {
                throw "Route not found: " + route;
            }

            // record the route in our private collection
            var routeHandler = GetControllerMethod("Controllers." + routeInfo.controllerClassName, routeInfo.controllerMethodName, renderCallback);

            // call it! return the result
            return routeHandler();
        }

        // Just a simple wrapper to make adding routes more concise.        
        function AddRoute(route, controllerClassName, controllerMethodName) {

            var simpleRoute = route;
            // remove everything after the colon
            var colonIndex = simpleRoute.indexOf(':');
            simpleRoute = simpleRoute.substring(0, colonIndex != -1 ? colonIndex : simpleRoute.length);
            // remove everything after the optional slash (/)
            var optSlashIndex = simpleRoute.indexOf('(/)');
            simpleRoute = simpleRoute.substring(0, optSlashIndex != -1 ? optSlashIndex : simpleRoute.length);
            // record the route in our private collection
            routeInfos[simpleRoute] = { controllerClassName: controllerClassName, controllerMethodName: controllerMethodName };

            router.route(
                route + "(/)", // We add an optional slash to the end of the route.
                GetControllerMethod("Controllers." + controllerClassName, controllerMethodName, layout.renderBodyView));
        }

        // Init the router.
        var router = new kendo.Router({
            routeMissing: function (e) {
                // Set the 404 route
                router.navigate("#/errorhandler/routemissing");
            }
        });


        // Default
        AddRoute("/", "Home", "index");

        function onRouteChanging(e) {
            // close modal window
            var windowObject = $('#window').data('kendoWindow');
            if (typeof (windowObject) != "undefined" && windowObject!==null ) {
                windowObject.close();
            }

            // check for form changes
            if (formChanged.get()) {
                //if any exist confirm the redirect
                var r = confirm("Your changes to this form will be lost!");
                if (r == true) {

                    formChanged.set(false);

                } else {
                    //prevent any changes to url or routing 
                    e.preventDefault();
                }

            }
            if (!formChanged.get()) {

                // Clear the layout body and add a spinner.
                // TODO: do this a different way.
                layout.onBeginBodyViewTransition();

                // ============== START: Ensure Route is Allowed ==============

                // Triggered when the fragment part of the URL changes.

                var newRoute = e.url.split("?")[0];
                var params = e.params;
                var redirectTo = "";

                // Add this route to the body tag.
                var prettyRoute = newRoute
                    .replace(/\//g, '-') // replace slashes with dashes
                    .toLowerCase(); // ensure it's all lowercase
                // remove any encoded URL from the end
                var tildaIndex = prettyRoute.indexOf('~');
                if (tildaIndex > -1) {
                    prettyRoute = prettyRoute.substring(0, tildaIndex);
                }
                var percentIndex = prettyRoute.indexOf('%');
                if (percentIndex > -1) {
                    prettyRoute = prettyRoute.substring(0, percentIndex);
                }

                // remove leading and trailing dashes
                prettyRoute = prettyRoute.replace(/(^[-\s]+)|([-\s]+$)/g, '');
                // add to the body attribute
                $(document.body).attr("data-route", prettyRoute);

                if (isAuthenticated.get() === false) {

                    // These are the URLs which are allowed if not authenticated.

                    var newRouteRequiresAuth = RouteRequiresAuth(newRoute);
                    console.log(newRouteRequiresAuth);
                    console.log(newRoute);
                    if (newRouteRequiresAuth === true) {
                        // Route requires authentication, redirect to the log in page and supply the return URL.
                        console.log("User was not authenticated , but route '" + newRoute + "' requires authentication. Aborting and redirecting to the login page.");
                        redirectTo = "/Account/Login/" + encodeURIComponent("#" + newRoute);
                    }
                }
                
                if (redirectTo !== "") {
                    // Cancel this route.
                    e.preventDefault();
                    console.log('redirecting to ', redirectTo);
                    router.navigate("#" + redirectTo);
                }

                pubSub.publish(pubSub.MESSAGES.ROUTE_CHANGING);
            }

            // ============== END: Ensure Route is Allowed ==============

        }

        router.bind("change", onRouteChanging);
        
        // == CONSTRUCTOR ==
        function RouterInterface() {
            console.log("Router constructor executing.");
        }
        
        function RouteRequiresAuth(route) {
            console.log('route=', route);
           //return false;
            var UNAUTH_ROUTES = [
                "/Account/Login",
                "/Home/Index",
                "/Account/Register"
            ];
            var requiresAuthentication = true;
            // Check if this route needs auth.
            $.each(UNAUTH_ROUTES, function (index, value) {
                if (route.toLowerCase().indexOf(value.toLowerCase()) == 0) {
                    requiresAuthentication = false;
                }
            });
            return requiresAuthentication;
        }
        // == PROPERTIES & METHODS ==
        
        RouterInterface.prototype.start = function () {
            // Start the routing.
            router.start();

        }
        
        RouterInterface.prototype.renderRoute = function (route, renderCallback) {
            renderRoute(route, renderCallback);
        }
        RouterInterface.prototype.routeRequiresAuth = function (route) {
            return RouteRequiresAuth(route);
        }
        RouterInterface.prototype.navigate = function (route, silent) {
            router.navigate(route, silent);
        }
        RouterInterface.prototype.replace = function (route, silent) {
            router.replace(route, silent);
        }

        
        // Return the module. NOTE: This is a singleton, due to using "new"
        return new RouterInterface();
    }
);