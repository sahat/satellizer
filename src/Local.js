"use strict";
var url_1 = require('url');
var Local = (function () {
    function Local($http, SatellizerConfig, SatellizerShared) {
        this.$http = $http;
        this.config = SatellizerConfig;
        this.shared = SatellizerShared;
    }
    Local.prototype.login = function (user, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        options.url = options.url ? options.url : url_1["default"].resolve(this.config.baseUrl, this.config.loginUrl);
        options.data = user || options.data;
        options.method = options.method || 'POST';
        options.withCredentials = options.withCredentials || this.config.withCredentials;
        return this.$http(options).then(function (response) {
            _this.shared.setToken(response);
            return response;
        });
    };
    Local.prototype.signup = function (user, options) {
        if (options === void 0) { options = {}; }
        options = options || {};
        options.url = options.url ? options.url : url_1["default"].resolve(this.config.baseUrl, this.config.signupUrl);
        options.data = user || options.data;
        options.method = options.method || 'POST';
        options.withCredentials = options.withCredentials || this.config.withCredentials;
        return this.$http(options);
    };
    return Local;
}());
exports.__esModule = true;
exports["default"] = Local;
