"use strict";
var url_1 = require('url');
var OAuth1 = (function () {
    function OAuth1($http, $window, SatellizerConfig, SatellizerPopup) {
        this.$http = $http;
        this.$window = $window;
        this.config = SatellizerConfig;
        this.popup = SatellizerPopup;
    }
    OAuth1.prototype.init = function (options, data) {
        var _this = this;
        var name = options.name, popupOptions = options.popupOptions, redirectUri = options.redirectUri;
        var popupWindow;
        if (!this.$window.cordova) {
            popupWindow = this.popup.open('about:blank', name, popupOptions, redirectUri);
        }
        return this.getRequestToken().then(function (response) {
            var url = [options.authorizationEndpoint, _this.buildQueryString(response.data)].join('?');
            if (_this.$window.cordova) {
                popupWindow = _this.popup.open(url, name, popupOptions, redirectUri);
            }
            else {
                popupWindow.popupWindow.location = url;
            }
            var popupListener;
            if (_this.$window.cordova) {
                popupListener = popupWindow.eventListener(_this.defaults.redirectUri);
            }
            else {
                popupListener = popupWindow.pollPopup(_this.defaults.redirectUri);
            }
            return popupListener.then(function (response) {
                return Oauth1.exchangeForToken(response, data);
            });
        });
    };
    OAuth1.prototype.getRequestToken = function () {
        var url = this.config.baseUrl ? url.resolve(this.config.baseUrl, this.defaults.url) : this.defaults.url;
        return this.$http.post(url, this.defaults);
    };
    OAuth1.prototype.exchangeForToken = function (oauth, data) {
        var payload = Object.assign({}, data, oauth);
        var exchangeForTokenUrl = this.config.baseUrl ? url_1["default"].resolve(this.config.baseUrl, this.defaults.url) : this.defaults.url;
        return $http.post(exchangeForTokenUrl, payload, { withCredentials: this.config.withCredentials });
    };
    OAuth1.prototype.buildQueryString = function (obj) {
        var str = [];
        angular.forEach(obj, function (value, key) {
            str.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
        });
        return str.join('&');
    };
    return OAuth1;
}());
exports.__esModule = true;
exports["default"] = OAuth1;
