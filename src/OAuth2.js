"use strict";
var url_1 = require('url');
var OAuth2 = (function () {
    function OAuth2($http, $window, $timeout, SatellizerConfig, SatellizerPopup, SatellizerStorage) {
        this.$http = $http;
        this.$window = $window;
        this.$timeout = $timeout;
        this.config = SatellizerConfig;
        this.popup = SatellizerPopup;
        this.storage = SatellizerStorage;
        this.defaults = {
            defaultUrlParams: ['response_type', 'client_id', 'redirect_uri'],
            responseType: 'code',
            responseParams: {
                code: 'code',
                clientId: 'clientId',
                redirectUri: 'redirectUri'
            }
        };
    }
    OAuth2.prototype.init = function (options, data) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            Object.assign(_this.defaults, options);
            _this.$timeout(function () {
                var url = [_this.defaults.authorizationEndpoint, _this.buildQueryString()].join('?');
                var stateName = _this.defaults.name + '_state'; // todo; what if name is undefined
                var _a = _this.defaults, name = _a.name, popupOptions = _a.popupOptions, redirectUri = _a.redirectUri;
                if (typeof _this.defaults.state === 'function') {
                    _this.storage.set(stateName, _this.defaults.state());
                }
                else if (typeof _this.defaults.state === 'string') {
                    _this.storage.set(stateName, _this.defaults.state);
                }
                return _this.popup.open(url, name, popupOptions, redirectUri)
                    .then(function (oauth) {
                    if (_this.defaults.responseType === 'token' || !_this.defaults.url) {
                        return resolve(oauth);
                    }
                    if (oauth.state && oauth.state !== _this.storage.get(stateName)) {
                        return reject(new Error('The value returned in the state parameter does not match the state value from your original ' +
                            'authorization code request.'));
                    }
                    return _this.exchangeForToken(oauth, data);
                })
                    .catch(function (error) { return reject(error); });
            });
        });
    };
    OAuth2.prototype.exchangeForToken = function (oauth, data) {
        var _this = this;
        var payload = Object.assign({}, data);
        // TODO: use this instead
        // for (const key in this.defaults.responseParams) {
        //   if (this.defaults.responseParams.hasOwnProperty(key)) {
        //     const value = this.defaults.responseParams[key];
        //
        //     switch (key) {
        //       case 'code':
        //         payload[value] = oauth.code;
        //         break;
        //       case 'clientId':
        //         payload[value] = this.defaults.clientId;
        //         break;
        //       case 'redirectUri':
        //         payload[value] = this.defaults.redirectUri;
        //         break;
        //       default:
        //         payload[value] = oauth[key];
        //     }
        //   }
        // }
        angular.forEach(this.defaults.responseParams, function (value, key) {
            switch (key) {
                case 'code':
                    payload[value] = oauth.code;
                    break;
                case 'clientId':
                    payload[value] = _this.defaults.clientId;
                    break;
                case 'redirectUri':
                    payload[value] = _this.defaults.redirectUri;
                    break;
                default:
                    payload[value] = oauth[key];
            }
        });
        if (oauth.state) {
            payload.state = oauth.state;
        }
        var exchangeForTokenUrl = this.config.baseUrl ? url_1["default"].resolve(this.config.baseUrl, this.defaults.url) : this.defaults.url;
        return this.$http.post(exchangeForTokenUrl, payload, { withCredentials: this.config.withCredentials });
    };
    OAuth2.prototype.buildQueryString = function () {
        var _this = this;
        var keyValuePairs = [];
        var urlParamsCategories = ['defaultUrlParams', 'requiredUrlParams', 'optionalUrlParams'];
        angular.forEach(urlParamsCategories, function (paramsCategory) {
            angular.forEach(_this.defaults[paramsCategory], function (paramName) {
                var camelizedName = utils.camelCase(paramName);
                var paramValue = angular.isFunction(_this.defaults[paramName]) ? _this.defaults[paramName]() : _this.defaults[camelizedName];
                if (paramName === 'redirect_uri' && !paramValue) {
                    return;
                }
                if (paramName === 'state') {
                    var stateName = _this.defaults.name + '_state'; // todo what if name undefined
                    paramValue = encodeURIComponent(_this.storage.get(stateName));
                }
                if (paramName === 'scope' && Array.isArray(paramValue)) {
                    paramValue = paramValue.join(_this.defaults.scopeDelimiter);
                    if (_this.defaults.scopePrefix) {
                        paramValue = [_this.defaults.scopePrefix, paramValue].join(_this.defaults.scopeDelimiter);
                    }
                }
                keyValuePairs.push([paramName, paramValue]);
            });
        });
        return keyValuePairs.map(function (pair) { return pair.join('='); }).join('&');
    };
    OAuth2.prototype.camelCase = function (name) {
        return name.replace(/([\:\-\_]+(.))/g, function (_, separator, letter, offset) {
            return offset ? letter.toUpperCase() : letter;
        });
    };
    return OAuth2;
}());
exports.__esModule = true;
exports["default"] = OAuth2;
