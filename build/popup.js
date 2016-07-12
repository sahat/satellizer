"use strict";
var utils_1 = require('./utils');
var Popup = (function () {
    function Popup($interval, $window) {
        this.$interval = $interval;
        this.$window = $window;
        this.popup = null;
        this.url = 'about:blank'; // TODO remove
        this.defaults = {
            redirectUri: null
        };
    }
    Popup.prototype.stringifyOptions = function (options) {
        var parts = [];
        angular.forEach(options, function (value, key) {
            parts.push(key + '=' + value);
        });
        return parts.join(',');
    };
    Popup.prototype.open = function (url, name, popupOptions, redirectUri) {
        this.url = url; // TODO remove
        var width = popupOptions.width || 500;
        var height = popupOptions.height || 500;
        var options = this.stringifyOptions({
            width: width,
            height: height,
            top: this.$window.screenY + ((this.$window.outerHeight - height) / 2.5),
            left: this.$window.screenX + ((this.$window.outerWidth - width) / 2)
        });
        var popupName = this.$window['cordova'] || this.$window.navigator.userAgent.includes('CriOS') ? '_blank' : name;
        this.popup = this.$window.open(this.url, popupName, options);
        if (this.popup && this.popup.focus) {
            this.popup.focus();
        }
        if (this.$window['cordova']) {
            return this.eventListener(this.defaults.redirectUri); // TODO pass redirect uri
        }
        else {
            return this.polling(redirectUri);
        }
    };
    Popup.prototype.polling = function (redirectUri) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var redirectUriParser = document.createElement('a');
            redirectUriParser.href = redirectUri;
            var redirectUriPath = utils_1.getFullUrlPath(redirectUriParser);
            var polling = _this.$interval(function () {
                if (!_this.popup || _this.popup.closed || _this.popup.closed === undefined) {
                    _this.$interval.cancel(polling);
                    reject(new Error('The popup window was closed'));
                }
                try {
                    var popupWindowPath = utils_1.getFullUrlPath(_this.popup.location);
                    if (popupWindowPath === redirectUriPath) {
                        if (_this.popup.location.search || _this.popup.location.hash) {
                            var query = utils_1.parseQueryString(_this.popup.location.search.substring(1).replace(/\/$/, ''));
                            var hash = utils_1.parseQueryString(_this.popup.location.hash.substring(1).replace(/[\/$]/, ''));
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
            }, 500);
        });
    };
    Popup.prototype.eventListener = function (redirectUri) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.popup.addEventListener('loadstart', function (event) {
                if (!event.url.includes(redirectUri)) {
                    return;
                }
                var parser = document.createElement('a');
                parser.href = event.url;
                if (parser.search || parser.hash) {
                    var query = utils_1.parseQueryString(parser.search.substring(1).replace(/\/$/, ''));
                    var hash = utils_1.parseQueryString(parser.hash.substring(1).replace(/[\/$]/, ''));
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
    Popup.$inject = ['$interval', '$window'];
    return Popup;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Popup;
//# sourceMappingURL=popup.js.map