//Notification "interface", whatever actual implementation for creating notifications in the browser should be called
//from inside "_createNotify" which is called by the convenience functions in the global "notify" object
//Note: there isn't a particularly good reason this "interface" exists the way it does other than the fact that
//Other code uses a global object named "notify" with these functions
var notify = {
    _createNotify: function (text, type, autohide, keepOpen) {

        if (typeof autohide === "undefined") {
            autohide = true;
        }
        $.notify({
            // options
            message: text
        }, {
            placement: {
                from: "top",
                align: "center"
            },
            type: type,
            allow_dismiss: keepOpen || !autohide,
            delay: keepOpen ? 0 : undefined
        });
    },
    success: function (text, autohide, keepOpen, submitElement) {
        if (submitElement) {
            var $validationSummaryRegions = $(submitElement).closest(".form").prevAll(validationSummarySelector);
            $validationSummaryRegions.empty();
        }
        if (typeof autohide === "undefined") {
            autohide = true;
        }
        notify._createNotify(text, "success", autohide, keepOpen);
    },
    warn: function (text, autohide, keepOpen) {
        if (typeof autohide === "undefined") {
            autohide = true;
        }
        notify._createNotify(text, "warning", autohide, keepOpen);
    },
    info: function (text, autohide, keepOpen) {
        if (typeof autohide === "undefined") {
            autohide = true;
        }
        notify._createNotify(text, "info", autohide, keepOpen);
    },
    error: function (text, autohide, keepOpen) {
        if (typeof autohide === "undefined") {
            autohide = true;
        }
        notify._createNotify(text, "danger", autohide, keepOpen);
    },
    // close all notifications that are dimissable
    close: function() {
        $(".alert button[data-notify='dismiss']:visible").click();
    } 
}   
