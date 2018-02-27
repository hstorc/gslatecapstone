define(
    "app",
    ["require",
        "router",
        "Util.layout",
        "Global.SignalR"
        ],
    function (require, router, layout, SignalR) {
        
        // Define the module.
        function initValidation() {
            // initialize validators
            console.log('customValidationRules=',customValidationRules);
            window.validation = $(document.body).kendoValidator(customValidationRules).data("kendoValidator");

        }

        var module = {
            start: function () {
                console.log("App starting at " + (new Date()))
                router.start();
                //window.location.href = window.location.host + "/#/task";
            }
        };
        return module;
    }
);