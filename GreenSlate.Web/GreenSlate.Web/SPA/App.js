define(
    "app",
    function (require) {
        //var $ = require('../3rdParty/jquery'),
         //   _ = require('underscore') || window._;
        // Define the module.
        var module = {
            start: function() {
                console.log("App starting at " + (new Date()) );
            }
        };
        return module;
    }
);