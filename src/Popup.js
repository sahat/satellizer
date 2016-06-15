"use strict";
var querystring_1 = require('querystring');
var url_1 = require('url');
var Popup = (function () {
    function Popup($interval, $window, SatellizerConfig) {
        this.$interval = $interval;
        this.$window = $window;
        this.config = SatellizerConfig;
        this.popup = null;
        this.url = 'about:blank'; //todo remove
    }
    Popup.prototype.open = function (url, name, _a, redirectUri) {
        var _this = this;
        var _b = _a.width, width = _b === void 0 ? 500 : _b, _c = _a.height, height = _c === void 0 ? 500 : _c;
        return new Promise(function (resolve, reject) {
            _this.url = url; // todo remove
            var options = querystring_1["default"].stringify({
                width: width,
                height: height,
                top: _this.$window.screenY + ((_this.$window.outerHeight - height) / 2.5),
                left: _this.$window.screenX + ((_this.$window.outerWidth - width) / 2)
            }, ',');
            var name = _this.$window.cordova || _this.$window.navigator.userAgent.includes('CriOS') ? '_blank' : name;
            _this.popup = _this.$window.open(_this.url, name, options);
            if (_this.popup && _this.popup.focus) {
                _this.popup.focus();
            }
            if (_this.$window.cordova) {
                return _this.eventListener(defaults.redirectUri); // todo pass redirect uri
            }
            else {
                return _this.polling(redirectUri);
            }
        });
    };
    Popup.prototype.polling = function (redirectUri) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var redirectUri = url_1["default"].parse(redirectUri);
            var polling = _this.$interval(function () {
                if (!_this.popup || _this.popup.closed || !_this.popup.closed) {
                    _this.$interval.cancel(polling);
                    reject(new Error('The popup window was closed'));
                }
                try {
                    var popupUrl = _this.popup.location.host + _this.popup.location.pathname;
                    if (popupUrl === redirectUri.host + redirectUri.pathname) {
                        if (_this.popup.location.search || _this.popup.location.hash) {
                            var query = querystring_1["default"].parse(_this.popup.location.search.substring(1).replace(/\/$/, ''));
                            var hash = querystring_1["default"].parse(_this.popup.location.hash.substring(1).replace(/[\/$]/, ''));
                            var params = Object.assign({}, query, hash);
                            if (params.error) {
                                reject(new Error(params.error));
                            }
                            else {
                                resolve(params);
                            }
                        }
                        else {
                            reject(new Error('OAuth redirect has occurred but no query or hash parameters were found. ' +
                                'They were either not set during the redirect, or were removed—typically by a ' +
                                'routing library—before Satellizer could read it.'));
                        }
                        _this.$interval.cancel(polling);
                        _this.popup.close();
                    }
                }
                catch (error) {
                }
            }, 20);
        });
    };
    Popup.prototype.eventListener = function (redirectUri) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.popup.addEventListener('loadstart', function (event) {
                if (!event.url.includes(redirectUri)) {
                    return;
                }
                var url = url.parse(event.url);
                if (url.search || url.hash) {
                    var query = querystring_1["default"].parse(url.search.substring(1).replace(/\/$/, ''));
                    var hash = querystring_1["default"].parse(url.hash.substring(1).replace(/[\/$]/, ''));
                    var params = Object.assign({}, query, hash);
                    if (params.error) {
                        reject(new Error(params.error));
                    }
                    else {
                        resolve(params);
                    }
                    _this.popup.close();
                }
            });
            _this.popup.addEventListener('loaderror', function () {
                reject(new Error('Authorization failed'));
            });
        });
    };
    return Popup;
}());
exports.__esModule = true;
exports["default"] = Popup;
