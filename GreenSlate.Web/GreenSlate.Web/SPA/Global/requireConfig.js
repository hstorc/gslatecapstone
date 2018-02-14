console.log('requireConfig.js here');
var ROOT_URL = window.location.origin;
var resolveUrl = function (relativeUrl) {

    if (typeof (ROOT_URL) == "undefined") {
        throw "ROOT_URL must be defined for 'resolveUrl' to be used.";
    }

    // Determine if the URL is relative.
    var beginsWithRelativePath = relativeUrl.indexOf('~/') == 0 || relativeUrl == '~';

    if (beginsWithRelativePath) {
        // Resolve the ~ and return.
        //console.log(relativeUrl = relativeUrl.replace('~', ROOT_URL));
        relativeUrl = relativeUrl.replace('~', ROOT_URL);
    }
   
    // It's not relative, so just return it as-is.
    console.log(relativeUrl);
    return relativeUrl;
};


requirejs.config({
    baseUrl: resolveUrl("~/SPA/"),
    paths: {
        "app": "App",
        "router": "Router",
        "pubSub": "../3rdParty/pubsub/pubsub",
        "Util.layout": "Util/Layout",
        "Controllers.ToDoTasks": "Controllers/ToDoTask",
        "Controllers.Home": "Controllers/Home"
    }
}
);