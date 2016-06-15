"use strict";
var HttpProviderConfig = (function () {
    function HttpProviderConfig($httpProvider) {
        $httpProvider.interceptors.push('SatellizerInterceptor');
    }
    return HttpProviderConfig;
}());
exports.__esModule = true;
exports["default"] = HttpProviderConfig;
