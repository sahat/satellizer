"use strict";
function joinUrl(baseUrl, url) {
    if (/^(?:[a-z]+:)?\/\//i.test(url)) {
        return url;
    }
    var joined = [baseUrl, url].join('/');
    var normalize = function (str) {
        return str
            .replace(/[\/]+/g, '/')
            .replace(/\/\?/g, '?')
            .replace(/\/\#/g, '#')
            .replace(/\:\//g, '://');
    };
    return normalize(joined);
}
exports.joinUrl = joinUrl;
function getFullUrlPath(location) {
    var isHttps = location.protocol === 'https:';
    return location.protocol + '//' + location.hostname +
        ':' + (location.port || (isHttps ? '443' : '80')) +
        (/^\//.test(location.pathname) ? location.pathname : '/' + location.pathname);
}
exports.getFullUrlPath = getFullUrlPath;
function parseQueryString(str) {
    var obj = {};
    var key;
    var value;
    angular.forEach((str || '').split('&'), function (keyValue) {
        if (keyValue) {
            value = keyValue.split('=');
            key = decodeURIComponent(value[0]);
            obj[key] = angular.isDefined(value[1]) ? decodeURIComponent(value[1]) : true;
        }
    });
    return obj;
}
exports.parseQueryString = parseQueryString;
//# sourceMappingURL=utils.js.map