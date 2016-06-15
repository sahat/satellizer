"use strict";
var url_1 = require('url');
var OAuth = (function () {
    function OAuth($http, SatellizerConfig, SatellizerShared, SatellizerOAuth1, SatellizerOAuth2) {
        this.$http = $http;
        this.config = SatellizerConfig;
        this.shared = SatellizerShared;
        this.oauth1 = SatellizerOAuth1;
        this.oauth2 = SatellizerOAuth2;
    }
    OAuth.prototype.authenticate = function (name, data) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var provider = _this.config.providers[name];
            var oauth = provider.oauthType === '1.0' ? _this.oauth1() : _this.oauth2();
            return oauth.init(provider, data)
                .then(function (response) {
                if (provider.url) {
                    _this.shared.setToken(response, false);
                }
                resolve(response);
            })
                .catch(function (error) {
                reject(error);
            });
        });
    };
    OAuth.prototype.unlink = function (provider, httpOptions) {
        httpOptions.url = httpOptions.url ? httpOptions.url : url_1["default"].resolve(this.config.baseUrl, this.config.unlinkUrl);
        httpOptions.data = { provider: provider } || httpOptions.data;
        httpOptions.method = httpOptions.method || 'POST';
        httpOptions.withCredentials = httpOptions.withCredentials || this.config.withCredentials;
        return this.$http(httpOptions);
    };
    return OAuth;
}());
exports.__esModule = true;
exports["default"] = OAuth;
