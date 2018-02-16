var numberOfTriesForCheckPrintFailedAjaxRequest = 5;
var numberOfChecksPerBatch = 20;
var modalWindowClass = "open-window";
var printer;
var passwordStrengthText = ["Empty", "Weak", "Good", "Good", "Good", "Strong"];
var passwordStrengthColor = ["", "#EE9F05", "#EE9F05", "#EE9F05", "#428bca", "#8EBC00"];
var maxCookieLifespan = 2147483647;

var AccountType =
{
    Checking: 1,
    Savings: 2
}
var gridCommandObject = {
    button_Text: "Kill It",
    call_Function: "onKillCommand",
    visibility_Propertie: "IsKillable",
    visibility_value: true
}
var gridDataSourceObject = {
    hubName: "",
    entityId: "Id",
    fields: "",
    rowActions: "",
    sortByPropertyName: "Id",
    sortingDir: "desc",
    filters: "",
    additionalActionParams: "",
    modelId: ""
}
// NOTE: This is merely a client-side convenience so we don't have to keep AJAX-calling the server to check. Incorrectly setting this won't expose any API vulnerabilities.

var isAuthenticated = {
    get: function () {
       
        return true;
    },
    set: function (isAuthenticated, doPublish, redirectTo) {
    
    }
};

var desktopAppVersion = {
    get: function () {
        return window._desktopAppVersion;
    },
    set: function (desktopAppVersion) {
        window._desktopAppVersion = desktopAppVersion;

    }
};
var isDesktopApp = {
    get: function () {
        if (typeof (window._isDesktopApp) == "undefined") {
            window._isDesktopApp = false;
        }
        return window._isDesktopApp;
    },
    set: function (isDesktopApp) {
        window._isDesktopApp = isDesktopApp;
    }
};
var appOperatingAgent = {
    get: function () {
        if (typeof (window._AppOperatingAgent) == "undefined") {
            window._AppOperatingAgent = AppOperatingAgentType.Web;
        }
        return window._AppOperatingAgent;
    },
    set: function (appOperatingAgent) {
        window._AppOperatingAgent = appOperatingAgent;
    }
};

var appVersion = {
    get: function () {
        return window._appVersion;
    },
    set: function (appVersion) {
        window._appVersion = appVersion;
    }
};

var antiForgeryTokens = {
    get: function () {
        return window._antiForgeryTokens;
    },
    set: function (antiForgeryTokens) {
        window._antiForgeryTokens = antiForgeryTokens;
    }
};

var formChanged = {
    get: function () {
        return window._formChanged;
    },
    set: function (changed) {
        window._formChanged = changed;
    }
};

var hasSignalRLogPermission = {
    get: function () {
        return window._hasSignalRLogPermission;
    },
    set: function (hasPermission) {
        window._hasSignalRLogPermission = hasPermission;
    }
};

window._isLiveChatLoaded = false;

var isLiveChatLoaded = {
    get: function () {
        return window._isLiveChatLoaded;
    },
    set: function (liveChatLoaded) {
        requirejs(["pubSub"],
            function (pubSub) {
                pubSub.publish(pubSub.MESSAGES.LIVE_CHAT_CHANGED);
            });

        window._isLiveChatLoaded = liveChatLoaded;
    }
}

var SelectListItemDefaultValue = -1;
var SelectListItemDefaultText = "--Select--";

var DesktopNotificationPermissions = {
    Default: "default",
    Granted: "granted",
    Denied: "denied"
}

var mobileMaxWidth = 767;

var entityTypes = {
    
};
var entityEditUrl = {
};

var events = {
    ajaxSent: "ajaxSentEvent",
    ajaxSuccess: "ajaxSuccessEvent",
    ajaxFailed: "ajaxFailedEvent",
    bodyViewRendered: "bodyViewRenderedEvent",
    leftNavRendered: "leftNavRenderedEvent"
};

var pageSizeString = "pageSize";