"use strict";
var Interceptor = (function () {
    function Interceptor($q, SatellizerConfig, SatellizerShared, SatellizerStorage) {
        this.$q = $q;
        this.config = SatellizerConfig;
        this.shared = SatellizerShared;
        this.storage = SatellizerStorage;
    }
    Interceptor.prototype.request = function (request) {
        if (request.skipAuthorization) {
            return request;
        }
        if (this.shared.isAuthenticated() && this.config.httpInterceptor(request)) {
            var tokenName = this.config.tokenPrefix ?
                [this.config.tokenPrefix, this.config.tokenName].join('_') : this.config.tokenName;
            var token = this.storage.get(tokenName);
            if (this.config.authHeader && this.config.authToken) {
                token = this.config.authToken + ' ' + token;
            }
            request.headers[this.config.authHeader] = token;
        }
        return request;
    };
    Interceptor.prototype.responseError = function (response) {
        return this.$q.reject(response);
    };
    return Interceptor;
}());
exports.__esModule = true;
exports["default"] = Interceptor;
