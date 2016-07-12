"use strict";
var utils_1 = require('./utils');
var OAuth1 = (function () {
    function OAuth1($http, $window, SatellizerConfig, SatellizerPopup) {
        this.$http = $http;
        this.$window = $window;
        this.SatellizerConfig = SatellizerConfig;
        this.SatellizerPopup = SatellizerPopup;
        this.defaults = {
            name: null,
            url: null,
            authorizationEndpoint: null,
            scope: null,
            scopePrefix: null,
            scopeDelimiter: null,
            redirectUri: null,
            requiredUrlParams: null,
            defaultUrlParams: null,
            oauthType: '1.0',
            popupOptions: { width: null, height: null }
        };
    }
    ;
    OAuth1.prototype.init = function (options, userData) {
        var _this = this;
        var name = options.name, popupOptions = options.popupOptions, redirectUri = options.redirectUri;
        var popupWindow;
        if (!this.$window['cordova']) {
            popupWindow = this.SatellizerPopup.open('about:blank', name, popupOptions, redirectUri);
        }
        return this.getRequestToken().then(function (response) {
            var url = [options.authorizationEndpoint, _this.buildQueryString(response.data)].join('?');
            if (_this.$window['cordova']) {
                popupWindow = _this.SatellizerPopup.open(url, name, popupOptions, redirectUri);
            }
            else {
                popupWindow.popupWindow.location = url;
            }
            var popupListener;
            if (_this.$window['cordova']) {
                popupListener = popupWindow.eventListener(_this.defaults.redirectUri);
            }
            else {
                popupListener = popupWindow.pollPopup(_this.defaults.redirectUri);
            }
            return popupListener.then(function (popupResponse) {
                return _this.exchangeForToken(popupResponse, userData);
            });
        });
    };
    OAuth1.prototype.getRequestToken = function () {
        var url = this.SatellizerConfig.baseUrl ? utils_1.joinUrl(this.SatellizerConfig.baseUrl, this.defaults.url) : this.defaults.url;
        return this.$http.post(url, this.defaults);
    };
    OAuth1.prototype.exchangeForToken = function (oauth, userData) {
        var payload = Object.assign({}, userData, oauth);
        var exchangeForTokenUrl = this.SatellizerConfig.baseUrl ? utils_1.joinUrl(this.SatellizerConfig.baseUrl, this.defaults.url) : this.defaults.url;
        return this.$http.post(exchangeForTokenUrl, payload, { withCredentials: this.SatellizerConfig.withCredentials });
    };
    OAuth1.prototype.buildQueryString = function (obj) {
        var str = [];
        angular.forEach(obj, function (value, key) {
            str.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
        });
        return str.join('&');
    };
    OAuth1.$inject = ['$http', '$window', 'SatellizerConfig', 'SatellizerPopup'];
    return OAuth1;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = OAuth1;
//# sourceMappingURL=oauth1.js.map