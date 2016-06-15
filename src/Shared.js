"use strict";
var Shared = (function () {
    function Shared($window, $log, SatellizerConfig, SatellizerStorage) {
        this.$window = $window;
        this.$log = $log;
        this.config = SatellizerConfig;
        this.storage = SatellizerStorage;
        var _a = this.config, tokenName = _a.tokenName, tokenPrefix = _a.tokenPrefix;
        this.prefixedTokenName = tokenPrefix ? [tokenPrefix, tokenName].join('_') : tokenName;
    }
    Shared.prototype.getToken = function () {
        return this.storage.get(this.prefixedTokenName);
    };
    Shared.prototype.getPayload = function () {
        var token = this.storage.get(this.prefixedTokenName);
        if (token && token.split('.').length === 3) {
            try {
                var base64Url = token.split('.')[1];
                var base64 = base64Url.replace('-', '+').replace('_', '/');
                return JSON.parse(decodeURIComponent(window.atob(base64)));
            }
            catch (e) { }
        }
    };
    Shared.prototype.setToken = function (response) {
        if (!response) {
            return this.$log.warn('Can\'t set token without passing a value');
        }
        var token;
        var accessToken = response && response.access_token;
        if (accessToken) {
            if (angular.isObject(accessToken) && angular.isObject(accessToken.data)) {
                response = accessToken;
            }
            else if (angular.isString(accessToken)) {
                token = accessToken;
            }
        }
        if (!token && response) {
            var tokenRootData = this.config.tokenRoot && this.config.tokenRoot.split('.').reduce(function (o, x) { return o[x]; }, response.data);
            token = tokenRootData ? tokenRootData[this.config.tokenName] : response.data && response.data[this.config.tokenName];
        }
        if (!token) {
            var tokenPath = this.config.tokenRoot ? this.config.tokenRoot + '.' + this.config.tokenName : this.config.tokenName;
            return this.$log.warn('Expecting a token named "' + tokenPath);
        }
        this.storage.set(this.prefixedTokenName, token);
    };
    Shared.prototype.removeToken = function () {
        this.storage.remove(this.prefixedTokenName);
    };
    Shared.prototype.isAuthenticated = function () {
        var token = this.storage.get(this.prefixedTokenName);
        if (token) {
            if (token.split('.').length === 3) {
                try {
                    var base64Url = token.split('.')[1];
                    var base64 = base64Url.replace('-', '+').replace('_', '/');
                    var exp = JSON.parse(this.$window.atob(base64)).exp;
                    if (exp) {
                        var isExpired = Math.round(new Date().getTime() / 1000) >= exp;
                        if (isExpired) {
                            return false; // FAIL: Expired token
                        }
                        else {
                            return true; // PASS: Non-expired token
                        }
                    }
                }
                catch (e) {
                    return true; // PASS: Non-JWT token that looks like JWT
                }
            }
            return true; // PASS: All other tokens
        }
        return false; // FAIL: No token at all
    };
    Shared.prototype.logout = function () {
        this.storage.remove(this.prefixedTokenName);
    };
    Shared.prototype.setStorageType = function (type) {
        this.storageType = type;
    };
    return Shared;
}());
exports.__esModule = true;
exports["default"] = Shared;
