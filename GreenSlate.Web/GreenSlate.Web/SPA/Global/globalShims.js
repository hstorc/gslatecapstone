if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (searchString, position) {
        position = position || 0;
        return this.indexOf(searchString, position) === position;
    };
}

String.format = function () {
    var s = arguments[0];
    for (var i = 0; i < arguments.length - 1; i++) {
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        s = s.replace(reg, arguments[i + 1]);
    }

    return s;
}

String.prototype.capitalizeFirstLetter = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};


jQuery.extend({
    handleError: function (s, xhr, status, e) {
        // If a local callback was specified, fire it
        if (s.error)
            s.error(xhr, status, e);
            // If we have some XML response text (e.g. from an AJAX call) then log it in the console
        else if (xhr.responseText)
            console.log(xhr.responseText);
    }
});


var QueryString = function () {
    // This function is anonymous, is executed immediately and 
    // the return value is assigned to QueryString!
    var query_string = {};
    var querySplit = window.location.hash.split('?');
    if (querySplit && querySplit.length > 1) {
        query = querySplit[1];
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            // If first entry with this name
            if (typeof query_string[pair[0]] === "undefined") {
                query_string[pair[0]] = decodeURIComponent(pair[1]);
                // If second entry with this name
            } else if (typeof query_string[pair[0]] === "string") {
                var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
                query_string[pair[0]] = arr;
                // If third or later entry with this name
            } else {
                query_string[pair[0]].push(decodeURIComponent(pair[1]));
            }
        }
    }
    return query_string;
};
//Object.byString = function (o, s) {
//    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
//    s = s.replace(/^\./, '');           // strip a leading dot
//    var a = s.split('.');
//    for (var i = 0, n = a.length; i < n; ++i) {
//        var k = a[i];
//        if (k in o) {
//            o = o[k];
//        } else {
//            return;
//        }
//    }
//    return o;
//}