console.log('requireConfig.js here');
requirejs.config({
    baseUrl: resolveUrl("~/App/"),
    paths: {
        "app": "App",
        "router": "Router"
    }
}
);