"use strict";
var Shared = (function () {
    function Shared($q, $window, $log, SatellizerConfig, SatellizerStorage) {
        this.$q = $q;
        this.$window = $window;
        this.$log = $log;
        this.SatellizerConfig = SatellizerConfig;
        this.SatellizerStorage = SatellizerStorage;
        var _a = this.SatellizerConfig, tokenName = _a.tokenName, tokenPrefix = _a.tokenPrefix;
        this.prefixedTokenName = tokenPrefix ? [tokenPrefix, tokenName].join('_') : tokenName;
    }
    Shared.prototype.getToken = function () {
        return this.SatellizerStorage.get(this.prefixedTokenName);
    };
    Shared.prototype.getPayload = function () {
        var token = this.SatellizerStorage.get(this.prefixedTokenName);
        if (token && token.split('.').length === 3) {
            try {
                var base64Url = token.split('.')[1];
                var base64 = base64Url.replace('-', '+').replace('_', '/');
                return JSON.parse(decodeURIComponent(window.atob(base64)));
            }
            catch (e) {
            }
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
            var tokenRootData = this.SatellizerConfig.tokenRoot && this.SatellizerConfig.tokenRoot.split('.').reduce(function (o, x) { return o[x]; }, response.data);
            token = tokenRootData ? tokenRootData[this.SatellizerConfig.tokenName] : response.data && response.data[this.SatellizerConfig.tokenName];
        }
        if (!token) {
            var tokenPath = this.SatellizerConfig.tokenRoot ? this.SatellizerConfig.tokenRoot + '.' + this.SatellizerConfig.tokenName : this.SatellizerConfig.tokenName;
            return this.$log.warn('Expecting a token named "' + tokenPath);
        }
        this.SatellizerStorage.set(this.prefixedTokenName, token);
    };
    Shared.prototype.removeToken = function () {
        this.SatellizerStorage.remove(this.prefixedTokenName);
    };
    Shared.prototype.isAuthenticated = function () {
        var token = this.SatellizerStorage.get(this.prefixedTokenName);
        if (token) {
            if (token.split('.').length === 3) {
                try {
                    var base64Url = token.split('.')[1];
                    var base64 = base64Url.replace('-', '+').replace('_', '/');
                    var exp = JSON.parse(this.$window.atob(base64)).exp;
                    if (exp) {
                        return (Math.round(new Date().getTime() / 1000) >= exp) ? false : true;
                    }
                }
                catch (e) {
                    return true; // Pass: Non-JWT token that looks like JWT
                }
            }
            return true; // Pass: All other tokens
        }
        return false; // Fail: No token at all
    };
    Shared.prototype.logout = function () {
        this.SatellizerStorage.remove(this.prefixedTokenName);
        return this.$q.when();
    };
    Shared.prototype.setStorageType = function (type) {
        this.SatellizerConfig.storageType = type;
    };
    Shared.$inject = ['$q', '$window', '$log', 'SatellizerConfig', 'SatellizerStorage'];
    return Shared;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Shared;
//# sourceMappingURL=shared.js.map