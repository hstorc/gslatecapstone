define(
    "app",
    ["require",
        "router",
        "Util.layout",
        "Global.SignalR"
        ],
    function (require, router, layout, SignalR) {
        //var $ = require('../3rdParty/jquery'),
         //   _ = require('underscore') || window._;
        // Define the module.
        function initValidation() {
            // initialize validators
            window.validation = $(document.body).kendoValidator(customValidationRules).data("kendoValidator");

        }

        var module = {
            start: function() {
                router.start();
            }
        };
        return module;
    }
);