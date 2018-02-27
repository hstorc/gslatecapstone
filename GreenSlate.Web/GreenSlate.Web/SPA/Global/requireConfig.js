var ROOT_URL = window.location.origin;
var resolveUrl = function (relativeUrl) {

    if (typeof (ROOT_URL) == "undefined") {
        throw "ROOT_URL must be defined for 'resolveUrl' to be used.";
    }

    // Determine if the URL is relative.
    var beginsWithRelativePath = relativeUrl.indexOf('~/') === 0 || relativeUrl === '~';

    if (beginsWithRelativePath) {
        // Resolve the ~ and return.
        //console.log(relativeUrl = relativeUrl.replace('~', ROOT_URL));
        relativeUrl = relativeUrl.replace('~', ROOT_URL);
    }
   
    // It's not relative, so just return it as-is.
    return relativeUrl;
};


requirejs.config({
    baseUrl: resolveUrl("~/SPA/"),
    paths: {
        "app": "App",
        "router": "Router",
        "Global.SignalR": "../3rdParty/signalr/jquery.signalR-2.2.1",
        "Util.layout": "Util/Layout",
        "Controllers.Task": "Controllers/Task",
        "Controllers.Home": "Controllers/Home",
        "Controllers.ErrorHandler": "Controllers/ErrorHandler",
        "Util.getViewResources": "Util/getViewResources",
        "Util.ajax":"Util/ajax",
        "View.Task":                "Views/Task/Index",
        "View.Task.Create":         "Views/Task/Create",
        "View.Task.Edit":           "Views/Task/Edit",
        "ViewModels.Task.TaskIndex": "ViewModels/Task/index",
        "ViewModels.Task.Create": "ViewModels/Task/create",        
        "ViewModels.Home.Index":    "ViewModels/Home/index",
        "pubSub":"../3rdParty/pubsub/pubsub",
        "Utils": "Util/Utils",
        "Notifications": "Global/Notifications"
    }
}
);