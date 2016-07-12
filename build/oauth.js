"use strict";
var utils_1 = require('./utils');
var OAuth = (function () {
    function OAuth($http, SatellizerConfig, SatellizerShared, SatellizerOAuth1, SatellizerOAuth2) {
        this.$http = $http;
        this.SatellizerConfig = SatellizerConfig;
        this.SatellizerShared = SatellizerShared;
        this.SatellizerOAuth1 = SatellizerOAuth1;
        this.SatellizerOAuth2 = SatellizerOAuth2;
    }
    OAuth.prototype.authenticate = function (name, userData) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var provider = _this.SatellizerConfig.providers[name];
            var initialize = provider.oauthType === '1.0' ? _this.SatellizerOAuth1.init(provider, userData) : _this.SatellizerOAuth2.init(provider, userData);
            return initialize.then(function (response) {
                if (provider.url) {
                    _this.SatellizerShared.setToken(response);
                }
                resolve(response);
            }).catch(function (error) {
                reject(error);
            });
        });
    };
    OAuth.prototype.unlink = function (provider, httpOptions) {
        if (httpOptions === void 0) { httpOptions = {}; }
        httpOptions.url = httpOptions.url ? httpOptions.url : utils_1.joinUrl(this.SatellizerConfig.baseUrl, this.SatellizerConfig.unlinkUrl);
        httpOptions.data = { provider: provider } || httpOptions.data;
        httpOptions.method = httpOptions.method || 'POST';
        httpOptions.withCredentials = httpOptions.withCredentials || this.SatellizerConfig.withCredentials;
        return this.$http(httpOptions);
    };
    OAuth.$inject = ['$http', 'SatellizerConfig', 'SatellizerShared', 'SatellizerOAuth1', 'SatellizerOAuth2'];
    return OAuth;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = OAuth;
//# sourceMappingURL=oauth.js.map