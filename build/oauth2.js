"use strict";
var utils_1 = require('./utils');
var OAuth2 = (function () {
    function OAuth2($http, $window, $timeout, SatellizerConfig, SatellizerPopup, SatellizerStorage) {
        this.$http = $http;
        this.$window = $window;
        this.$timeout = $timeout;
        this.SatellizerConfig = SatellizerConfig;
        this.SatellizerPopup = SatellizerPopup;
        this.SatellizerStorage = SatellizerStorage;
        this.defaults = {
            name: null,
            url: null,
            clientId: null,
            authorizationEndpoint: null,
            redirectUri: null,
            scope: null,
            scopePrefix: null,
            scopeDelimiter: null,
            state: null,
            requiredUrlParams: null,
            defaultUrlParams: ['response_type', 'client_id', 'redirect_uri'],
            responseType: 'code',
            responseParams: {
                code: 'code',
                clientId: 'clientId',
                redirectUri: 'redirectUri'
            },
            oauthType: '2.0',
            popupOptions: { width: null, height: null }
        };
    }
    OAuth2.camelCase = function (name) {
        return name.replace(/([\:\-\_]+(.))/g, function (_, separator, letter, offset) {
            return offset ? letter.toUpperCase() : letter;
        });
    };
    OAuth2.prototype.init = function (options, userData) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            Object.assign(_this.defaults, options);
            _this.$timeout(function () {
                var url = [_this.defaults.authorizationEndpoint, _this.buildQueryString()].join('?');
                var stateName = _this.defaults.name + '_state';
                var _a = _this.defaults, name = _a.name, state = _a.state, popupOptions = _a.popupOptions, redirectUri = _a.redirectUri, responseType = _a.responseType;
                if (typeof state === 'function') {
                    _this.SatellizerStorage.set(stateName, state());
                }
                else if (typeof state === 'string') {
                    _this.SatellizerStorage.set(stateName, state);
                }
                _this.SatellizerPopup.open(url, name, popupOptions, redirectUri)
                    .then(function (oauth) {
                    if (responseType === 'token' || !url) {
                        return resolve(oauth);
                    }
                    if (oauth.state && oauth.state !== _this.SatellizerStorage.get(stateName)) {
                        return reject(new Error('The value returned in the state parameter does not match the state value from your original ' +
                            'authorization code request.'));
                    }
                    resolve(_this.exchangeForToken(oauth, userData));
                })
                    .catch(function (error) { return reject(error); });
            });
        });
    };
    OAuth2.prototype.exchangeForToken = function (oauthData, userData) {
        var _this = this;
        var payload = Object.assign({}, userData);
        angular.forEach(this.defaults.responseParams, function (value, key) {
            switch (key) {
                case 'code':
                    payload[value] = oauthData.code;
                    break;
                case 'clientId':
                    payload[value] = _this.defaults.clientId;
                    break;
                case 'redirectUri':
                    payload[value] = _this.defaults.redirectUri;
                    break;
                default:
                    payload[value] = oauthData[key];
            }
        });
        if (oauthData.state) {
            payload.state = oauthData.state;
        }
        var exchangeForTokenUrl = this.SatellizerConfig.baseUrl ?
            utils_1.joinUrl(this.SatellizerConfig.baseUrl, this.defaults.url) :
            this.defaults.url;
        return this.$http.post(exchangeForTokenUrl, payload, { withCredentials: this.SatellizerConfig.withCredentials });
    };
    OAuth2.prototype.buildQueryString = function () {
        var _this = this;
        var keyValuePairs = [];
        var urlParamsCategories = ['defaultUrlParams', 'requiredUrlParams', 'optionalUrlParams'];
        angular.forEach(urlParamsCategories, function (paramsCategory) {
            angular.forEach(_this.defaults[paramsCategory], function (paramName) {
                var camelizedName = OAuth2.camelCase(paramName);
                var paramValue = angular.isFunction(_this.defaults[paramName]) ? _this.defaults[paramName]() : _this.defaults[camelizedName];
                if (paramName === 'redirect_uri' && !paramValue) {
                    return;
                }
                if (paramName === 'state') {
                    var stateName = _this.defaults.name + '_state';
                    paramValue = encodeURIComponent(_this.SatellizerStorage.get(stateName));
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
    OAuth2.$inject = ['$http', '$window', '$timeout', 'SatellizerConfig', 'SatellizerPopup', 'SatellizerStorage'];
    return OAuth2;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = OAuth2;
//# sourceMappingURL=oauth2.js.map