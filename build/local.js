"use strict";
var utils_1 = require('./utils');
var Local = (function () {
    function Local($http, SatellizerConfig, SatellizerShared) {
        this.$http = $http;
        this.SatellizerConfig = SatellizerConfig;
        this.SatellizerShared = SatellizerShared;
    }
    Local.prototype.login = function (user, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        options.url = options.url ? options.url : utils_1.joinUrl(this.SatellizerConfig.baseUrl, this.SatellizerConfig.loginUrl);
        options.data = user || options.data;
        options.method = options.method || 'POST';
        options.withCredentials = options.withCredentials || this.SatellizerConfig.withCredentials;
        return this.$http(options).then(function (response) {
            _this.SatellizerShared.setToken(response);
            return response;
        });
    };
    Local.prototype.signup = function (user, options) {
        if (options === void 0) { options = {}; }
        options.url = options.url ? options.url : utils_1.joinUrl(this.SatellizerConfig.baseUrl, this.SatellizerConfig.signupUrl);
        options.data = user || options.data;
        options.method = options.method || 'POST';
        options.withCredentials = options.withCredentials || this.SatellizerConfig.withCredentials;
        return this.$http(options);
    };
    Local.$inject = ['$http', 'SatellizerConfig', 'SatellizerShared'];
    return Local;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Local;
//# sourceMappingURL=local.js.map