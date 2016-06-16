/*!
 * Token-based AngularJS Authentication
 * @version v0.14.0
 * @link https://github.com/sahat/satellizer
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("satellizer", [], factory);
	else if(typeof exports === 'object')
		exports["satellizer"] = factory();
	else
		root["satellizer"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _Config = __webpack_require__(1);

	var _Config2 = _interopRequireDefault(_Config);

	var _AuthProvider = __webpack_require__(2);

	var _AuthProvider2 = _interopRequireDefault(_AuthProvider);

	var _Shared = __webpack_require__(3);

	var _Shared2 = _interopRequireDefault(_Shared);

	var _Local = __webpack_require__(4);

	var _Local2 = _interopRequireDefault(_Local);

	var _Popup = __webpack_require__(12);

	var _Popup2 = _interopRequireDefault(_Popup);

	var _OAuth = __webpack_require__(13);

	var _OAuth2 = _interopRequireDefault(_OAuth);

	var _OAuth3 = __webpack_require__(14);

	var _OAuth4 = _interopRequireDefault(_OAuth3);

	var _OAuth5 = __webpack_require__(15);

	var _OAuth6 = _interopRequireDefault(_OAuth5);

	var _Storage = __webpack_require__(16);

	var _Storage2 = _interopRequireDefault(_Storage);

	var _Interceptor = __webpack_require__(17);

	var _Interceptor2 = _interopRequireDefault(_Interceptor);

	var _HttpProviderConfig = __webpack_require__(18);

	var _HttpProviderConfig2 = _interopRequireDefault(_HttpProviderConfig);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	angular.module('satellizer', []).provider('$auth', ['satellizerConfig', function (satellizerConfig) {
	    return new _AuthProvider2.default(satellizerConfig);
	}]).constant('satellizerConfig', _Config2.default.getConstant).service('satellizerShared', ['$q', '$window', '$log', 'satellizerConfig', 'satellizerStorage', _Shared2.default]).service('satellizerLocal', ['$http', 'satellizerConfig', 'satellizerShared', _Local2.default]).service('satellizerPopup', ['$interval', '$window', _Popup2.default]).service('satellizerOAuth', ['$http', 'satellizerConfig', 'satellizerShared', 'satellizerOAuth1', 'satellizerOAuth2', _OAuth2.default]).service('satellizerOAuth2', ['$http', '$window', '$timeout', 'satellizerConfig', 'satellizerPopup', 'satellizerStorage', _OAuth4.default]).service('satellizerOAuth1', ['$http', '$window', 'satellizerConfig', 'satellizerPopup', _OAuth6.default]).service('satellizerStorage', ['$window', 'satellizerConfig', _Storage2.default]).service('satellizerInterceptor', _Interceptor2.default).config(['$httpProvider', function ($httpProvider) {
	    return new _HttpProviderConfig2.default($httpProvider);
	}]);
	exports.default = 'satellizer';

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Config = function () {
	    function Config() {
	        _classCallCheck(this, Config);

	        this.baseUrl = '/';
	        this.loginUrl = '/auth/login';
	        this.signupUrl = '/auth/signup';
	        this.unlinkUrl = '/auth/unlink/';
	        this.tokenName = 'token';
	        this.tokenPrefix = 'satellizer';
	        this.authHeader = 'Authorization';
	        this.authToken = 'Bearer';
	        this.storageType = 'localStorage';
	        this.tokenRoot = null;
	        this.withCredentials = false;
	        this.providers = {
	            facebook: {
	                name: 'facebook',
	                url: '/auth/facebook',
	                authorizationEndpoint: 'https://www.facebook.com/v2.5/dialog/oauth',
	                redirectUri: window.location.origin + '/',
	                requiredUrlParams: ['display', 'scope'],
	                scope: ['email'],
	                scopeDelimiter: ',',
	                display: 'popup',
	                oauthType: '2.0',
	                popupOptions: { width: 580, height: 400 }
	            },
	            google: {
	                name: 'google',
	                url: '/auth/google',
	                authorizationEndpoint: 'https://accounts.google.com/o/oauth2/auth',
	                redirectUri: window.location.origin,
	                requiredUrlParams: ['scope'],
	                optionalUrlParams: ['display', 'state'],
	                scope: ['profile', 'email'],
	                scopePrefix: 'openid',
	                scopeDelimiter: ' ',
	                display: 'popup',
	                oauthType: '2.0',
	                popupOptions: { width: 452, height: 633 },
	                state: function state() {
	                    var rand = Math.random().toString(36).substr(2);
	                    return encodeURIComponent(rand);
	                }
	            },
	            github: {
	                name: 'github',
	                url: '/auth/github',
	                authorizationEndpoint: 'https://github.com/login/oauth/authorize',
	                redirectUri: window.location.origin,
	                optionalUrlParams: ['scope'],
	                scope: ['user:email'],
	                scopeDelimiter: ' ',
	                oauthType: '2.0',
	                popupOptions: { width: 1020, height: 618 }
	            },
	            instagram: {
	                name: 'instagram',
	                url: '/auth/instagram',
	                authorizationEndpoint: 'https://api.instagram.com/oauth/authorize',
	                redirectUri: window.location.origin,
	                requiredUrlParams: ['scope'],
	                scope: ['basic'],
	                scopeDelimiter: '+',
	                oauthType: '2.0'
	            },
	            linkedin: {
	                name: 'linkedin',
	                url: '/auth/linkedin',
	                authorizationEndpoint: 'https://www.linkedin.com/uas/oauth2/authorization',
	                redirectUri: window.location.origin,
	                requiredUrlParams: ['state'],
	                scope: ['r_emailaddress'],
	                scopeDelimiter: ' ',
	                state: 'STATE',
	                oauthType: '2.0',
	                popupOptions: { width: 527, height: 582 }
	            },
	            twitter: {
	                name: 'twitter',
	                url: '/auth/twitter',
	                authorizationEndpoint: 'https://api.twitter.com/oauth/authenticate',
	                redirectUri: window.location.origin,
	                oauthType: '1.0',
	                popupOptions: { width: 495, height: 645 }
	            },
	            twitch: {
	                name: 'twitch',
	                url: '/auth/twitch',
	                authorizationEndpoint: 'https://api.twitch.tv/kraken/oauth2/authorize',
	                redirectUri: window.location.origin,
	                requiredUrlParams: ['scope'],
	                scope: ['user_read'],
	                scopeDelimiter: ' ',
	                display: 'popup',
	                oauthType: '2.0',
	                popupOptions: { width: 500, height: 560 }
	            },
	            live: {
	                name: 'live',
	                url: '/auth/live',
	                authorizationEndpoint: 'https://login.live.com/oauth20_authorize.srf',
	                redirectUri: window.location.origin,
	                requiredUrlParams: ['display', 'scope'],
	                scope: ['wl.emails'],
	                scopeDelimiter: ' ',
	                display: 'popup',
	                oauthType: '2.0',
	                popupOptions: { width: 500, height: 560 }
	            },
	            yahoo: {
	                name: 'yahoo',
	                url: '/auth/yahoo',
	                authorizationEndpoint: 'https://api.login.yahoo.com/oauth2/request_auth',
	                redirectUri: window.location.origin,
	                scope: [],
	                scopeDelimiter: ',',
	                oauthType: '2.0',
	                popupOptions: { width: 559, height: 519 }
	            },
	            bitbucket: {
	                name: 'bitbucket',
	                url: '/auth/bitbucket',
	                authorizationEndpoint: 'https://bitbucket.org/site/oauth2/authorize',
	                redirectUri: window.location.origin + '/',
	                requiredUrlParams: ['scope'],
	                scope: ['email'],
	                scopeDelimiter: ' ',
	                oauthType: '2.0',
	                popupOptions: { width: 1028, height: 529 }
	            }
	        };
	        this.httpInterceptor = function () {
	            return true;
	        };
	    }

	    _createClass(Config, null, [{
	        key: 'getConstant',
	        get: function get() {
	            return new Config();
	        }
	    }]);

	    return Config;
	}();

	exports.default = Config;

	;

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var AuthProvider = function () {
	    function AuthProvider(satellizerConfig) {
	        _classCallCheck(this, AuthProvider);

	        this.satellizerConfig = satellizerConfig;
	    }

	    _createClass(AuthProvider, [{
	        key: 'facebook',
	        value: function facebook(options) {
	            Object.assign(this.satellizerConfig.providers.facebook, options);
	        }
	    }, {
	        key: 'google',
	        value: function google(options) {
	            Object.assign(this.satellizerConfig.providers.google, options);
	        }
	    }, {
	        key: 'github',
	        value: function github(options) {
	            Object.assign(this.satellizerConfig.providers.github, options);
	        }
	    }, {
	        key: 'instagram',
	        value: function instagram(options) {
	            Object.assign(this.satellizerConfig.providers.instagram, options);
	        }
	    }, {
	        key: 'linkedin',
	        value: function linkedin(options) {
	            Object.assign(this.satellizerConfig.providers.linkedin, options);
	        }
	    }, {
	        key: 'twitter',
	        value: function twitter(options) {
	            Object.assign(this.satellizerConfig.providers.twitter, options);
	        }
	    }, {
	        key: 'twitch',
	        value: function twitch(options) {
	            Object.assign(this.satellizerConfig.providers.twitch, options);
	        }
	    }, {
	        key: 'live',
	        value: function live(options) {
	            Object.assign(this.satellizerConfig.providers.live, options);
	        }
	    }, {
	        key: 'yahoo',
	        value: function yahoo(options) {
	            Object.assign(this.satellizerConfig.providers.yahoo, options);
	        }
	    }, {
	        key: 'bitbucket',
	        value: function bitbucket(options) {
	            Object.assign(this.satellizerConfig.providers.bitbucket, options);
	        }
	    }, {
	        key: 'oauth1',
	        value: function oauth1(options) {
	            this.satellizerConfig.providers[options.name] = Object.assign({}, options, {
	                oauthType: '1.0'
	            });
	        }
	    }, {
	        key: 'oauth2',
	        value: function oauth2(options) {
	            this.satellizerConfig.providers[options.name] = Object.assign({}, options, {
	                oauthType: '2.0'
	            });
	        }
	    }, {
	        key: '$get',
	        value: function $get(satellizerShared, satellizerLocal, satellizerOAuth) {
	            return {
	                login: function login(user, options) {
	                    return satellizerLocal.login(user, options);
	                },
	                signup: function signup(user, options) {
	                    return satellizerLocal.signup(user, options);
	                },
	                logout: function logout() {
	                    return satellizerShared.logout();
	                },
	                authenticate: function authenticate(name, data) {
	                    return satellizerOAuth.authenticate(name, data);
	                },
	                link: function link(name, data) {
	                    return satellizerOAuth.authenticate(name, data);
	                },
	                unlink: function unlink(name, options) {
	                    return satellizerOAuth.unlink(name, options);
	                },
	                isAuthenticated: function isAuthenticated() {
	                    return satellizerShared.isAuthenticated();
	                },
	                getPayload: function getPayload() {
	                    return satellizerShared.getPayload();
	                },
	                getToken: function getToken() {
	                    return satellizerShared.getToken();
	                },
	                setToken: function setToken(token) {
	                    return satellizerShared.setToken({ access_token: token });
	                },
	                removeToken: function removeToken() {
	                    return satellizerShared.removeToken();
	                },
	                setStorageType: function setStorageType(type) {
	                    return satellizerShared.setStorageType(type);
	                }
	            };
	        }
	    }, {
	        key: 'baseUrl',
	        get: function get() {
	            return this.satellizerConfig.baseUrl;
	        },
	        set: function set(value) {
	            this.satellizerConfig.baseUrl = value;
	        }
	    }, {
	        key: 'loginUrl',
	        get: function get() {
	            return this.satellizerConfig.loginUrl;
	        },
	        set: function set(value) {
	            this.satellizerConfig.loginUrl = value;
	        }
	    }, {
	        key: 'signupUrl',
	        get: function get() {
	            return this.satellizerConfig.signupUrl;
	        },
	        set: function set(value) {
	            this.satellizerConfig.signupUrl = value;
	        }
	    }, {
	        key: 'tokenRoot',
	        get: function get() {
	            return this.satellizerConfig.tokenRoot;
	        },
	        set: function set(value) {
	            this.satellizerConfig.tokenRoot = value;
	        }
	    }, {
	        key: 'tokenName',
	        get: function get() {
	            return this.satellizerConfig.tokenName;
	        },
	        set: function set(value) {
	            this.satellizerConfig.tokenName = value;
	        }
	    }, {
	        key: 'tokenPrefix',
	        get: function get() {
	            return this.satellizerConfig.tokenPrefix;
	        },
	        set: function set(value) {
	            this.satellizerConfig.tokenPrefix = value;
	        }
	    }, {
	        key: 'unlinkUrl',
	        get: function get() {
	            return this.satellizerConfig.unlinkUrl;
	        },
	        set: function set(value) {
	            this.satellizerConfig.unlinkUrl = value;
	        }
	    }, {
	        key: 'authHeader',
	        get: function get() {
	            return this.satellizerConfig.authHeader;
	        },
	        set: function set(value) {
	            this.satellizerConfig.authHeader = value;
	        }
	    }, {
	        key: 'authToken',
	        get: function get() {
	            return this.satellizerConfig.authToken;
	        },
	        set: function set(value) {
	            this.satellizerConfig.authToken = value;
	        }
	    }, {
	        key: 'withCredentials',
	        get: function get() {
	            return this.satellizerConfig.withCredentials;
	        },
	        set: function set(value) {
	            this.satellizerConfig.withCredentials = value;
	        }
	    }, {
	        key: 'storageType',
	        get: function get() {
	            return this.satellizerConfig.storageType;
	        },
	        set: function set(value) {
	            this.satellizerConfig.storageType = value;
	        }
	    }, {
	        key: 'httpInterceptor',
	        get: function get() {
	            return this.satellizerConfig.httpInterceptor;
	        },
	        set: function set(value) {
	            if (typeof value === 'function') {
	                this.satellizerConfig.httpInterceptor = value;
	            } else {
	                this.satellizerConfig.httpInterceptor = function () {
	                    return value;
	                };
	            }
	        }
	    }]);

	    return AuthProvider;
	}();

	exports.default = AuthProvider;

	AuthProvider.$inject = ['satellizerConfig'];

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Shared = function () {
	    function Shared($q, $window, $log, satellizerConfig, satellizerStorage) {
	        _classCallCheck(this, Shared);

	        this.$q = $q;
	        this.$window = $window;
	        this.$log = $log;
	        this.satellizerConfig = satellizerConfig;
	        this.satellizerStorage = satellizerStorage;
	        var _satellizerConfig = this.satellizerConfig;
	        var tokenName = _satellizerConfig.tokenName;
	        var tokenPrefix = _satellizerConfig.tokenPrefix;

	        this.prefixedTokenName = tokenPrefix ? [tokenPrefix, tokenName].join('_') : tokenName;
	    }

	    _createClass(Shared, [{
	        key: 'getToken',
	        value: function getToken() {
	            return this.satellizerStorage.get(this.prefixedTokenName);
	        }
	    }, {
	        key: 'getPayload',
	        value: function getPayload() {
	            var token = this.satellizerStorage.get(this.prefixedTokenName);
	            if (token && token.split('.').length === 3) {
	                try {
	                    var base64Url = token.split('.')[1];
	                    var base64 = base64Url.replace('-', '+').replace('_', '/');
	                    return JSON.parse(decodeURIComponent(window.atob(base64)));
	                } catch (e) {}
	            }
	        }
	    }, {
	        key: 'setToken',
	        value: function setToken(response) {
	            if (!response) {
	                return this.$log.warn('Can\'t set token without passing a value');
	            }
	            var token = void 0;
	            var accessToken = response && response.access_token;
	            if (accessToken) {
	                if (angular.isObject(accessToken) && angular.isObject(accessToken.data)) {
	                    response = accessToken;
	                } else if (angular.isString(accessToken)) {
	                    token = accessToken;
	                }
	            }
	            if (!token && response) {
	                var tokenRootData = this.satellizerConfig.tokenRoot && this.satellizerConfig.tokenRoot.split('.').reduce(function (o, x) {
	                    return o[x];
	                }, response.data);
	                token = tokenRootData ? tokenRootData[this.satellizerConfig.tokenName] : response.data && response.data[this.satellizerConfig.tokenName];
	            }
	            if (!token) {
	                var tokenPath = this.satellizerConfig.tokenRoot ? this.satellizerConfig.tokenRoot + '.' + this.satellizerConfig.tokenName : this.satellizerConfig.tokenName;
	                return this.$log.warn('Expecting a token named "' + tokenPath);
	            }
	            this.satellizerStorage.set(this.prefixedTokenName, token);
	        }
	    }, {
	        key: 'removeToken',
	        value: function removeToken() {
	            this.satellizerStorage.remove(this.prefixedTokenName);
	        }
	    }, {
	        key: 'isAuthenticated',
	        value: function isAuthenticated() {
	            var token = this.satellizerStorage.get(this.prefixedTokenName);
	            if (token) {
	                if (token.split('.').length === 3) {
	                    try {
	                        var base64Url = token.split('.')[1];
	                        var base64 = base64Url.replace('-', '+').replace('_', '/');
	                        var exp = JSON.parse(this.$window.atob(base64)).exp;
	                        if (exp) {
	                            var isExpired = Math.round(new Date().getTime() / 1000) >= exp;
	                            if (isExpired) {
	                                return false; // FAIL: Expired token
	                            } else {
	                                    return true; // PASS: Non-expired token
	                                }
	                        }
	                    } catch (e) {
	                        return true; // PASS: Non-JWT token that looks like JWT
	                    }
	                }
	                return true; // PASS: All other tokens
	            }
	            return false; // FAIL: No token at all
	        }
	    }, {
	        key: 'logout',
	        value: function logout() {
	            this.satellizerStorage.remove(this.prefixedTokenName);
	            return this.$q.when();
	        }
	    }, {
	        key: 'setStorageType',
	        value: function setStorageType(type) {
	            this.satellizerConfig.storageType = type;
	        }
	    }]);

	    return Shared;
	}();

	exports.default = Shared;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _url = __webpack_require__(5);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Local = function () {
	    function Local($http, satellizerConfig, satellizerShared) {
	        _classCallCheck(this, Local);

	        this.$http = $http;
	        this.satellizerConfig = satellizerConfig;
	        this.satellizerShared = satellizerShared;
	    }

	    _createClass(Local, [{
	        key: 'login',
	        value: function login(user) {
	            var _this = this;

	            var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	            options.url = options.url ? options.url : (0, _url.resolve)(this.satellizerConfig.baseUrl, this.satellizerConfig.loginUrl);
	            options.data = user || options.data;
	            options.method = options.method || 'POST';
	            options.withCredentials = options.withCredentials || this.satellizerConfig.withCredentials;
	            return this.$http(options).then(function (response) {
	                _this.satellizerShared.setToken(response);
	                return response;
	            });
	        }
	    }, {
	        key: 'signup',
	        value: function signup(user) {
	            var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	            options = options || {};
	            options.url = options.url ? options.url : (0, _url.resolve)(this.satellizerConfig.baseUrl, this.satellizerConfig.signupUrl);
	            options.data = user || options.data;
	            options.method = options.method || 'POST';
	            options.withCredentials = options.withCredentials || this.satellizerConfig.withCredentials;
	            return this.$http(options);
	        }
	    }]);

	    return Local;
	}();

	exports.default = Local;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	'use strict';

	var punycode = __webpack_require__(6);
	var util = __webpack_require__(8);

	exports.parse = urlParse;
	exports.resolve = urlResolve;
	exports.resolveObject = urlResolveObject;
	exports.format = urlFormat;

	exports.Url = Url;

	function Url() {
	  this.protocol = null;
	  this.slashes = null;
	  this.auth = null;
	  this.host = null;
	  this.port = null;
	  this.hostname = null;
	  this.hash = null;
	  this.search = null;
	  this.query = null;
	  this.pathname = null;
	  this.path = null;
	  this.href = null;
	}

	// Reference: RFC 3986, RFC 1808, RFC 2396

	// define these here so at least they only have to be
	// compiled once on the first module load.
	var protocolPattern = /^([a-z0-9.+-]+:)/i,
	    portPattern = /:[0-9]*$/,

	    // Special case for a simple path URL
	    simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,

	    // RFC 2396: characters reserved for delimiting URLs.
	    // We actually just auto-escape these.
	    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

	    // RFC 2396: characters not allowed for various reasons.
	    unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

	    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
	    autoEscape = ['\''].concat(unwise),
	    // Characters that are never ever allowed in a hostname.
	    // Note that any invalid chars are also handled, but these
	    // are the ones that are *expected* to be seen, so we fast-path
	    // them.
	    nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
	    hostEndingChars = ['/', '?', '#'],
	    hostnameMaxLen = 255,
	    hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
	    hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
	    // protocols that can allow "unsafe" and "unwise" chars.
	    unsafeProtocol = {
	      'javascript': true,
	      'javascript:': true
	    },
	    // protocols that never have a hostname.
	    hostlessProtocol = {
	      'javascript': true,
	      'javascript:': true
	    },
	    // protocols that always contain a // bit.
	    slashedProtocol = {
	      'http': true,
	      'https': true,
	      'ftp': true,
	      'gopher': true,
	      'file': true,
	      'http:': true,
	      'https:': true,
	      'ftp:': true,
	      'gopher:': true,
	      'file:': true
	    },
	    querystring = __webpack_require__(9);

	function urlParse(url, parseQueryString, slashesDenoteHost) {
	  if (url && util.isObject(url) && url instanceof Url) return url;

	  var u = new Url;
	  u.parse(url, parseQueryString, slashesDenoteHost);
	  return u;
	}

	Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
	  if (!util.isString(url)) {
	    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
	  }

	  // Copy chrome, IE, opera backslash-handling behavior.
	  // Back slashes before the query string get converted to forward slashes
	  // See: https://code.google.com/p/chromium/issues/detail?id=25916
	  var queryIndex = url.indexOf('?'),
	      splitter =
	          (queryIndex !== -1 && queryIndex < url.indexOf('#')) ? '?' : '#',
	      uSplit = url.split(splitter),
	      slashRegex = /\\/g;
	  uSplit[0] = uSplit[0].replace(slashRegex, '/');
	  url = uSplit.join(splitter);

	  var rest = url;

	  // trim before proceeding.
	  // This is to support parse stuff like "  http://foo.com  \n"
	  rest = rest.trim();

	  if (!slashesDenoteHost && url.split('#').length === 1) {
	    // Try fast path regexp
	    var simplePath = simplePathPattern.exec(rest);
	    if (simplePath) {
	      this.path = rest;
	      this.href = rest;
	      this.pathname = simplePath[1];
	      if (simplePath[2]) {
	        this.search = simplePath[2];
	        if (parseQueryString) {
	          this.query = querystring.parse(this.search.substr(1));
	        } else {
	          this.query = this.search.substr(1);
	        }
	      } else if (parseQueryString) {
	        this.search = '';
	        this.query = {};
	      }
	      return this;
	    }
	  }

	  var proto = protocolPattern.exec(rest);
	  if (proto) {
	    proto = proto[0];
	    var lowerProto = proto.toLowerCase();
	    this.protocol = lowerProto;
	    rest = rest.substr(proto.length);
	  }

	  // figure out if it's got a host
	  // user@server is *always* interpreted as a hostname, and url
	  // resolution will treat //foo/bar as host=foo,path=bar because that's
	  // how the browser resolves relative URLs.
	  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
	    var slashes = rest.substr(0, 2) === '//';
	    if (slashes && !(proto && hostlessProtocol[proto])) {
	      rest = rest.substr(2);
	      this.slashes = true;
	    }
	  }

	  if (!hostlessProtocol[proto] &&
	      (slashes || (proto && !slashedProtocol[proto]))) {

	    // there's a hostname.
	    // the first instance of /, ?, ;, or # ends the host.
	    //
	    // If there is an @ in the hostname, then non-host chars *are* allowed
	    // to the left of the last @ sign, unless some host-ending character
	    // comes *before* the @-sign.
	    // URLs are obnoxious.
	    //
	    // ex:
	    // http://a@b@c/ => user:a@b host:c
	    // http://a@b?@c => user:a host:c path:/?@c

	    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
	    // Review our test case against browsers more comprehensively.

	    // find the first instance of any hostEndingChars
	    var hostEnd = -1;
	    for (var i = 0; i < hostEndingChars.length; i++) {
	      var hec = rest.indexOf(hostEndingChars[i]);
	      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
	        hostEnd = hec;
	    }

	    // at this point, either we have an explicit point where the
	    // auth portion cannot go past, or the last @ char is the decider.
	    var auth, atSign;
	    if (hostEnd === -1) {
	      // atSign can be anywhere.
	      atSign = rest.lastIndexOf('@');
	    } else {
	      // atSign must be in auth portion.
	      // http://a@b/c@d => host:b auth:a path:/c@d
	      atSign = rest.lastIndexOf('@', hostEnd);
	    }

	    // Now we have a portion which is definitely the auth.
	    // Pull that off.
	    if (atSign !== -1) {
	      auth = rest.slice(0, atSign);
	      rest = rest.slice(atSign + 1);
	      this.auth = decodeURIComponent(auth);
	    }

	    // the host is the remaining to the left of the first non-host char
	    hostEnd = -1;
	    for (var i = 0; i < nonHostChars.length; i++) {
	      var hec = rest.indexOf(nonHostChars[i]);
	      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
	        hostEnd = hec;
	    }
	    // if we still have not hit it, then the entire thing is a host.
	    if (hostEnd === -1)
	      hostEnd = rest.length;

	    this.host = rest.slice(0, hostEnd);
	    rest = rest.slice(hostEnd);

	    // pull out port.
	    this.parseHost();

	    // we've indicated that there is a hostname,
	    // so even if it's empty, it has to be present.
	    this.hostname = this.hostname || '';

	    // if hostname begins with [ and ends with ]
	    // assume that it's an IPv6 address.
	    var ipv6Hostname = this.hostname[0] === '[' &&
	        this.hostname[this.hostname.length - 1] === ']';

	    // validate a little.
	    if (!ipv6Hostname) {
	      var hostparts = this.hostname.split(/\./);
	      for (var i = 0, l = hostparts.length; i < l; i++) {
	        var part = hostparts[i];
	        if (!part) continue;
	        if (!part.match(hostnamePartPattern)) {
	          var newpart = '';
	          for (var j = 0, k = part.length; j < k; j++) {
	            if (part.charCodeAt(j) > 127) {
	              // we replace non-ASCII char with a temporary placeholder
	              // we need this to make sure size of hostname is not
	              // broken by replacing non-ASCII by nothing
	              newpart += 'x';
	            } else {
	              newpart += part[j];
	            }
	          }
	          // we test again with ASCII char only
	          if (!newpart.match(hostnamePartPattern)) {
	            var validParts = hostparts.slice(0, i);
	            var notHost = hostparts.slice(i + 1);
	            var bit = part.match(hostnamePartStart);
	            if (bit) {
	              validParts.push(bit[1]);
	              notHost.unshift(bit[2]);
	            }
	            if (notHost.length) {
	              rest = '/' + notHost.join('.') + rest;
	            }
	            this.hostname = validParts.join('.');
	            break;
	          }
	        }
	      }
	    }

	    if (this.hostname.length > hostnameMaxLen) {
	      this.hostname = '';
	    } else {
	      // hostnames are always lower case.
	      this.hostname = this.hostname.toLowerCase();
	    }

	    if (!ipv6Hostname) {
	      // IDNA Support: Returns a punycoded representation of "domain".
	      // It only converts parts of the domain name that
	      // have non-ASCII characters, i.e. it doesn't matter if
	      // you call it with a domain that already is ASCII-only.
	      this.hostname = punycode.toASCII(this.hostname);
	    }

	    var p = this.port ? ':' + this.port : '';
	    var h = this.hostname || '';
	    this.host = h + p;
	    this.href += this.host;

	    // strip [ and ] from the hostname
	    // the host field still retains them, though
	    if (ipv6Hostname) {
	      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
	      if (rest[0] !== '/') {
	        rest = '/' + rest;
	      }
	    }
	  }

	  // now rest is set to the post-host stuff.
	  // chop off any delim chars.
	  if (!unsafeProtocol[lowerProto]) {

	    // First, make 100% sure that any "autoEscape" chars get
	    // escaped, even if encodeURIComponent doesn't think they
	    // need to be.
	    for (var i = 0, l = autoEscape.length; i < l; i++) {
	      var ae = autoEscape[i];
	      if (rest.indexOf(ae) === -1)
	        continue;
	      var esc = encodeURIComponent(ae);
	      if (esc === ae) {
	        esc = escape(ae);
	      }
	      rest = rest.split(ae).join(esc);
	    }
	  }


	  // chop off from the tail first.
	  var hash = rest.indexOf('#');
	  if (hash !== -1) {
	    // got a fragment string.
	    this.hash = rest.substr(hash);
	    rest = rest.slice(0, hash);
	  }
	  var qm = rest.indexOf('?');
	  if (qm !== -1) {
	    this.search = rest.substr(qm);
	    this.query = rest.substr(qm + 1);
	    if (parseQueryString) {
	      this.query = querystring.parse(this.query);
	    }
	    rest = rest.slice(0, qm);
	  } else if (parseQueryString) {
	    // no query string, but parseQueryString still requested
	    this.search = '';
	    this.query = {};
	  }
	  if (rest) this.pathname = rest;
	  if (slashedProtocol[lowerProto] &&
	      this.hostname && !this.pathname) {
	    this.pathname = '/';
	  }

	  //to support http.request
	  if (this.pathname || this.search) {
	    var p = this.pathname || '';
	    var s = this.search || '';
	    this.path = p + s;
	  }

	  // finally, reconstruct the href based on what has been validated.
	  this.href = this.format();
	  return this;
	};

	// format a parsed object into a url string
	function urlFormat(obj) {
	  // ensure it's an object, and not a string url.
	  // If it's an obj, this is a no-op.
	  // this way, you can call url_format() on strings
	  // to clean up potentially wonky urls.
	  if (util.isString(obj)) obj = urlParse(obj);
	  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
	  return obj.format();
	}

	Url.prototype.format = function() {
	  var auth = this.auth || '';
	  if (auth) {
	    auth = encodeURIComponent(auth);
	    auth = auth.replace(/%3A/i, ':');
	    auth += '@';
	  }

	  var protocol = this.protocol || '',
	      pathname = this.pathname || '',
	      hash = this.hash || '',
	      host = false,
	      query = '';

	  if (this.host) {
	    host = auth + this.host;
	  } else if (this.hostname) {
	    host = auth + (this.hostname.indexOf(':') === -1 ?
	        this.hostname :
	        '[' + this.hostname + ']');
	    if (this.port) {
	      host += ':' + this.port;
	    }
	  }

	  if (this.query &&
	      util.isObject(this.query) &&
	      Object.keys(this.query).length) {
	    query = querystring.stringify(this.query);
	  }

	  var search = this.search || (query && ('?' + query)) || '';

	  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

	  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
	  // unless they had them to begin with.
	  if (this.slashes ||
	      (!protocol || slashedProtocol[protocol]) && host !== false) {
	    host = '//' + (host || '');
	    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
	  } else if (!host) {
	    host = '';
	  }

	  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
	  if (search && search.charAt(0) !== '?') search = '?' + search;

	  pathname = pathname.replace(/[?#]/g, function(match) {
	    return encodeURIComponent(match);
	  });
	  search = search.replace('#', '%23');

	  return protocol + host + pathname + search + hash;
	};

	function urlResolve(source, relative) {
	  return urlParse(source, false, true).resolve(relative);
	}

	Url.prototype.resolve = function(relative) {
	  return this.resolveObject(urlParse(relative, false, true)).format();
	};

	function urlResolveObject(source, relative) {
	  if (!source) return relative;
	  return urlParse(source, false, true).resolveObject(relative);
	}

	Url.prototype.resolveObject = function(relative) {
	  if (util.isString(relative)) {
	    var rel = new Url();
	    rel.parse(relative, false, true);
	    relative = rel;
	  }

	  var result = new Url();
	  var tkeys = Object.keys(this);
	  for (var tk = 0; tk < tkeys.length; tk++) {
	    var tkey = tkeys[tk];
	    result[tkey] = this[tkey];
	  }

	  // hash is always overridden, no matter what.
	  // even href="" will remove it.
	  result.hash = relative.hash;

	  // if the relative url is empty, then there's nothing left to do here.
	  if (relative.href === '') {
	    result.href = result.format();
	    return result;
	  }

	  // hrefs like //foo/bar always cut to the protocol.
	  if (relative.slashes && !relative.protocol) {
	    // take everything except the protocol from relative
	    var rkeys = Object.keys(relative);
	    for (var rk = 0; rk < rkeys.length; rk++) {
	      var rkey = rkeys[rk];
	      if (rkey !== 'protocol')
	        result[rkey] = relative[rkey];
	    }

	    //urlParse appends trailing / to urls like http://www.example.com
	    if (slashedProtocol[result.protocol] &&
	        result.hostname && !result.pathname) {
	      result.path = result.pathname = '/';
	    }

	    result.href = result.format();
	    return result;
	  }

	  if (relative.protocol && relative.protocol !== result.protocol) {
	    // if it's a known url protocol, then changing
	    // the protocol does weird things
	    // first, if it's not file:, then we MUST have a host,
	    // and if there was a path
	    // to begin with, then we MUST have a path.
	    // if it is file:, then the host is dropped,
	    // because that's known to be hostless.
	    // anything else is assumed to be absolute.
	    if (!slashedProtocol[relative.protocol]) {
	      var keys = Object.keys(relative);
	      for (var v = 0; v < keys.length; v++) {
	        var k = keys[v];
	        result[k] = relative[k];
	      }
	      result.href = result.format();
	      return result;
	    }

	    result.protocol = relative.protocol;
	    if (!relative.host && !hostlessProtocol[relative.protocol]) {
	      var relPath = (relative.pathname || '').split('/');
	      while (relPath.length && !(relative.host = relPath.shift()));
	      if (!relative.host) relative.host = '';
	      if (!relative.hostname) relative.hostname = '';
	      if (relPath[0] !== '') relPath.unshift('');
	      if (relPath.length < 2) relPath.unshift('');
	      result.pathname = relPath.join('/');
	    } else {
	      result.pathname = relative.pathname;
	    }
	    result.search = relative.search;
	    result.query = relative.query;
	    result.host = relative.host || '';
	    result.auth = relative.auth;
	    result.hostname = relative.hostname || relative.host;
	    result.port = relative.port;
	    // to support http.request
	    if (result.pathname || result.search) {
	      var p = result.pathname || '';
	      var s = result.search || '';
	      result.path = p + s;
	    }
	    result.slashes = result.slashes || relative.slashes;
	    result.href = result.format();
	    return result;
	  }

	  var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
	      isRelAbs = (
	          relative.host ||
	          relative.pathname && relative.pathname.charAt(0) === '/'
	      ),
	      mustEndAbs = (isRelAbs || isSourceAbs ||
	                    (result.host && relative.pathname)),
	      removeAllDots = mustEndAbs,
	      srcPath = result.pathname && result.pathname.split('/') || [],
	      relPath = relative.pathname && relative.pathname.split('/') || [],
	      psychotic = result.protocol && !slashedProtocol[result.protocol];

	  // if the url is a non-slashed url, then relative
	  // links like ../.. should be able
	  // to crawl up to the hostname, as well.  This is strange.
	  // result.protocol has already been set by now.
	  // Later on, put the first path part into the host field.
	  if (psychotic) {
	    result.hostname = '';
	    result.port = null;
	    if (result.host) {
	      if (srcPath[0] === '') srcPath[0] = result.host;
	      else srcPath.unshift(result.host);
	    }
	    result.host = '';
	    if (relative.protocol) {
	      relative.hostname = null;
	      relative.port = null;
	      if (relative.host) {
	        if (relPath[0] === '') relPath[0] = relative.host;
	        else relPath.unshift(relative.host);
	      }
	      relative.host = null;
	    }
	    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
	  }

	  if (isRelAbs) {
	    // it's absolute.
	    result.host = (relative.host || relative.host === '') ?
	                  relative.host : result.host;
	    result.hostname = (relative.hostname || relative.hostname === '') ?
	                      relative.hostname : result.hostname;
	    result.search = relative.search;
	    result.query = relative.query;
	    srcPath = relPath;
	    // fall through to the dot-handling below.
	  } else if (relPath.length) {
	    // it's relative
	    // throw away the existing file, and take the new path instead.
	    if (!srcPath) srcPath = [];
	    srcPath.pop();
	    srcPath = srcPath.concat(relPath);
	    result.search = relative.search;
	    result.query = relative.query;
	  } else if (!util.isNullOrUndefined(relative.search)) {
	    // just pull out the search.
	    // like href='?foo'.
	    // Put this after the other two cases because it simplifies the booleans
	    if (psychotic) {
	      result.hostname = result.host = srcPath.shift();
	      //occationaly the auth can get stuck only in host
	      //this especially happens in cases like
	      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
	      var authInHost = result.host && result.host.indexOf('@') > 0 ?
	                       result.host.split('@') : false;
	      if (authInHost) {
	        result.auth = authInHost.shift();
	        result.host = result.hostname = authInHost.shift();
	      }
	    }
	    result.search = relative.search;
	    result.query = relative.query;
	    //to support http.request
	    if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
	      result.path = (result.pathname ? result.pathname : '') +
	                    (result.search ? result.search : '');
	    }
	    result.href = result.format();
	    return result;
	  }

	  if (!srcPath.length) {
	    // no path at all.  easy.
	    // we've already handled the other stuff above.
	    result.pathname = null;
	    //to support http.request
	    if (result.search) {
	      result.path = '/' + result.search;
	    } else {
	      result.path = null;
	    }
	    result.href = result.format();
	    return result;
	  }

	  // if a url ENDs in . or .., then it must get a trailing slash.
	  // however, if it ends in anything else non-slashy,
	  // then it must NOT get a trailing slash.
	  var last = srcPath.slice(-1)[0];
	  var hasTrailingSlash = (
	      (result.host || relative.host || srcPath.length > 1) &&
	      (last === '.' || last === '..') || last === '');

	  // strip single dots, resolve double dots to parent dir
	  // if the path tries to go above the root, `up` ends up > 0
	  var up = 0;
	  for (var i = srcPath.length; i >= 0; i--) {
	    last = srcPath[i];
	    if (last === '.') {
	      srcPath.splice(i, 1);
	    } else if (last === '..') {
	      srcPath.splice(i, 1);
	      up++;
	    } else if (up) {
	      srcPath.splice(i, 1);
	      up--;
	    }
	  }

	  // if the path is allowed to go above the root, restore leading ..s
	  if (!mustEndAbs && !removeAllDots) {
	    for (; up--; up) {
	      srcPath.unshift('..');
	    }
	  }

	  if (mustEndAbs && srcPath[0] !== '' &&
	      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
	    srcPath.unshift('');
	  }

	  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
	    srcPath.push('');
	  }

	  var isAbsolute = srcPath[0] === '' ||
	      (srcPath[0] && srcPath[0].charAt(0) === '/');

	  // put the host back
	  if (psychotic) {
	    result.hostname = result.host = isAbsolute ? '' :
	                                    srcPath.length ? srcPath.shift() : '';
	    //occationaly the auth can get stuck only in host
	    //this especially happens in cases like
	    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
	    var authInHost = result.host && result.host.indexOf('@') > 0 ?
	                     result.host.split('@') : false;
	    if (authInHost) {
	      result.auth = authInHost.shift();
	      result.host = result.hostname = authInHost.shift();
	    }
	  }

	  mustEndAbs = mustEndAbs || (result.host && srcPath.length);

	  if (mustEndAbs && !isAbsolute) {
	    srcPath.unshift('');
	  }

	  if (!srcPath.length) {
	    result.pathname = null;
	    result.path = null;
	  } else {
	    result.pathname = srcPath.join('/');
	  }

	  //to support request.http
	  if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
	    result.path = (result.pathname ? result.pathname : '') +
	                  (result.search ? result.search : '');
	  }
	  result.auth = relative.auth || result.auth;
	  result.slashes = result.slashes || relative.slashes;
	  result.href = result.format();
	  return result;
	};

	Url.prototype.parseHost = function() {
	  var host = this.host;
	  var port = portPattern.exec(host);
	  if (port) {
	    port = port[0];
	    if (port !== ':') {
	      this.port = port.substr(1);
	    }
	    host = host.substr(0, host.length - port.length);
	  }
	  if (host) this.hostname = host;
	};


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module, global) {/*! https://mths.be/punycode v1.3.2 by @mathias */
	;(function(root) {

		/** Detect free variables */
		var freeExports = typeof exports == 'object' && exports &&
			!exports.nodeType && exports;
		var freeModule = typeof module == 'object' && module &&
			!module.nodeType && module;
		var freeGlobal = typeof global == 'object' && global;
		if (
			freeGlobal.global === freeGlobal ||
			freeGlobal.window === freeGlobal ||
			freeGlobal.self === freeGlobal
		) {
			root = freeGlobal;
		}

		/**
		 * The `punycode` object.
		 * @name punycode
		 * @type Object
		 */
		var punycode,

		/** Highest positive signed 32-bit float value */
		maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

		/** Bootstring parameters */
		base = 36,
		tMin = 1,
		tMax = 26,
		skew = 38,
		damp = 700,
		initialBias = 72,
		initialN = 128, // 0x80
		delimiter = '-', // '\x2D'

		/** Regular expressions */
		regexPunycode = /^xn--/,
		regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
		regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

		/** Error messages */
		errors = {
			'overflow': 'Overflow: input needs wider integers to process',
			'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
			'invalid-input': 'Invalid input'
		},

		/** Convenience shortcuts */
		baseMinusTMin = base - tMin,
		floor = Math.floor,
		stringFromCharCode = String.fromCharCode,

		/** Temporary variable */
		key;

		/*--------------------------------------------------------------------------*/

		/**
		 * A generic error utility function.
		 * @private
		 * @param {String} type The error type.
		 * @returns {Error} Throws a `RangeError` with the applicable error message.
		 */
		function error(type) {
			throw RangeError(errors[type]);
		}

		/**
		 * A generic `Array#map` utility function.
		 * @private
		 * @param {Array} array The array to iterate over.
		 * @param {Function} callback The function that gets called for every array
		 * item.
		 * @returns {Array} A new array of values returned by the callback function.
		 */
		function map(array, fn) {
			var length = array.length;
			var result = [];
			while (length--) {
				result[length] = fn(array[length]);
			}
			return result;
		}

		/**
		 * A simple `Array#map`-like wrapper to work with domain name strings or email
		 * addresses.
		 * @private
		 * @param {String} domain The domain name or email address.
		 * @param {Function} callback The function that gets called for every
		 * character.
		 * @returns {Array} A new string of characters returned by the callback
		 * function.
		 */
		function mapDomain(string, fn) {
			var parts = string.split('@');
			var result = '';
			if (parts.length > 1) {
				// In email addresses, only the domain name should be punycoded. Leave
				// the local part (i.e. everything up to `@`) intact.
				result = parts[0] + '@';
				string = parts[1];
			}
			// Avoid `split(regex)` for IE8 compatibility. See #17.
			string = string.replace(regexSeparators, '\x2E');
			var labels = string.split('.');
			var encoded = map(labels, fn).join('.');
			return result + encoded;
		}

		/**
		 * Creates an array containing the numeric code points of each Unicode
		 * character in the string. While JavaScript uses UCS-2 internally,
		 * this function will convert a pair of surrogate halves (each of which
		 * UCS-2 exposes as separate characters) into a single code point,
		 * matching UTF-16.
		 * @see `punycode.ucs2.encode`
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode.ucs2
		 * @name decode
		 * @param {String} string The Unicode input string (UCS-2).
		 * @returns {Array} The new array of code points.
		 */
		function ucs2decode(string) {
			var output = [],
			    counter = 0,
			    length = string.length,
			    value,
			    extra;
			while (counter < length) {
				value = string.charCodeAt(counter++);
				if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
					// high surrogate, and there is a next character
					extra = string.charCodeAt(counter++);
					if ((extra & 0xFC00) == 0xDC00) { // low surrogate
						output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
					} else {
						// unmatched surrogate; only append this code unit, in case the next
						// code unit is the high surrogate of a surrogate pair
						output.push(value);
						counter--;
					}
				} else {
					output.push(value);
				}
			}
			return output;
		}

		/**
		 * Creates a string based on an array of numeric code points.
		 * @see `punycode.ucs2.decode`
		 * @memberOf punycode.ucs2
		 * @name encode
		 * @param {Array} codePoints The array of numeric code points.
		 * @returns {String} The new Unicode string (UCS-2).
		 */
		function ucs2encode(array) {
			return map(array, function(value) {
				var output = '';
				if (value > 0xFFFF) {
					value -= 0x10000;
					output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
					value = 0xDC00 | value & 0x3FF;
				}
				output += stringFromCharCode(value);
				return output;
			}).join('');
		}

		/**
		 * Converts a basic code point into a digit/integer.
		 * @see `digitToBasic()`
		 * @private
		 * @param {Number} codePoint The basic numeric code point value.
		 * @returns {Number} The numeric value of a basic code point (for use in
		 * representing integers) in the range `0` to `base - 1`, or `base` if
		 * the code point does not represent a value.
		 */
		function basicToDigit(codePoint) {
			if (codePoint - 48 < 10) {
				return codePoint - 22;
			}
			if (codePoint - 65 < 26) {
				return codePoint - 65;
			}
			if (codePoint - 97 < 26) {
				return codePoint - 97;
			}
			return base;
		}

		/**
		 * Converts a digit/integer into a basic code point.
		 * @see `basicToDigit()`
		 * @private
		 * @param {Number} digit The numeric value of a basic code point.
		 * @returns {Number} The basic code point whose value (when used for
		 * representing integers) is `digit`, which needs to be in the range
		 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
		 * used; else, the lowercase form is used. The behavior is undefined
		 * if `flag` is non-zero and `digit` has no uppercase form.
		 */
		function digitToBasic(digit, flag) {
			//  0..25 map to ASCII a..z or A..Z
			// 26..35 map to ASCII 0..9
			return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
		}

		/**
		 * Bias adaptation function as per section 3.4 of RFC 3492.
		 * http://tools.ietf.org/html/rfc3492#section-3.4
		 * @private
		 */
		function adapt(delta, numPoints, firstTime) {
			var k = 0;
			delta = firstTime ? floor(delta / damp) : delta >> 1;
			delta += floor(delta / numPoints);
			for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
				delta = floor(delta / baseMinusTMin);
			}
			return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
		}

		/**
		 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
		 * symbols.
		 * @memberOf punycode
		 * @param {String} input The Punycode string of ASCII-only symbols.
		 * @returns {String} The resulting string of Unicode symbols.
		 */
		function decode(input) {
			// Don't use UCS-2
			var output = [],
			    inputLength = input.length,
			    out,
			    i = 0,
			    n = initialN,
			    bias = initialBias,
			    basic,
			    j,
			    index,
			    oldi,
			    w,
			    k,
			    digit,
			    t,
			    /** Cached calculation results */
			    baseMinusT;

			// Handle the basic code points: let `basic` be the number of input code
			// points before the last delimiter, or `0` if there is none, then copy
			// the first basic code points to the output.

			basic = input.lastIndexOf(delimiter);
			if (basic < 0) {
				basic = 0;
			}

			for (j = 0; j < basic; ++j) {
				// if it's not a basic code point
				if (input.charCodeAt(j) >= 0x80) {
					error('not-basic');
				}
				output.push(input.charCodeAt(j));
			}

			// Main decoding loop: start just after the last delimiter if any basic code
			// points were copied; start at the beginning otherwise.

			for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

				// `index` is the index of the next character to be consumed.
				// Decode a generalized variable-length integer into `delta`,
				// which gets added to `i`. The overflow checking is easier
				// if we increase `i` as we go, then subtract off its starting
				// value at the end to obtain `delta`.
				for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

					if (index >= inputLength) {
						error('invalid-input');
					}

					digit = basicToDigit(input.charCodeAt(index++));

					if (digit >= base || digit > floor((maxInt - i) / w)) {
						error('overflow');
					}

					i += digit * w;
					t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

					if (digit < t) {
						break;
					}

					baseMinusT = base - t;
					if (w > floor(maxInt / baseMinusT)) {
						error('overflow');
					}

					w *= baseMinusT;

				}

				out = output.length + 1;
				bias = adapt(i - oldi, out, oldi == 0);

				// `i` was supposed to wrap around from `out` to `0`,
				// incrementing `n` each time, so we'll fix that now:
				if (floor(i / out) > maxInt - n) {
					error('overflow');
				}

				n += floor(i / out);
				i %= out;

				// Insert `n` at position `i` of the output
				output.splice(i++, 0, n);

			}

			return ucs2encode(output);
		}

		/**
		 * Converts a string of Unicode symbols (e.g. a domain name label) to a
		 * Punycode string of ASCII-only symbols.
		 * @memberOf punycode
		 * @param {String} input The string of Unicode symbols.
		 * @returns {String} The resulting Punycode string of ASCII-only symbols.
		 */
		function encode(input) {
			var n,
			    delta,
			    handledCPCount,
			    basicLength,
			    bias,
			    j,
			    m,
			    q,
			    k,
			    t,
			    currentValue,
			    output = [],
			    /** `inputLength` will hold the number of code points in `input`. */
			    inputLength,
			    /** Cached calculation results */
			    handledCPCountPlusOne,
			    baseMinusT,
			    qMinusT;

			// Convert the input in UCS-2 to Unicode
			input = ucs2decode(input);

			// Cache the length
			inputLength = input.length;

			// Initialize the state
			n = initialN;
			delta = 0;
			bias = initialBias;

			// Handle the basic code points
			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue < 0x80) {
					output.push(stringFromCharCode(currentValue));
				}
			}

			handledCPCount = basicLength = output.length;

			// `handledCPCount` is the number of code points that have been handled;
			// `basicLength` is the number of basic code points.

			// Finish the basic string - if it is not empty - with a delimiter
			if (basicLength) {
				output.push(delimiter);
			}

			// Main encoding loop:
			while (handledCPCount < inputLength) {

				// All non-basic code points < n have been handled already. Find the next
				// larger one:
				for (m = maxInt, j = 0; j < inputLength; ++j) {
					currentValue = input[j];
					if (currentValue >= n && currentValue < m) {
						m = currentValue;
					}
				}

				// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
				// but guard against overflow
				handledCPCountPlusOne = handledCPCount + 1;
				if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
					error('overflow');
				}

				delta += (m - n) * handledCPCountPlusOne;
				n = m;

				for (j = 0; j < inputLength; ++j) {
					currentValue = input[j];

					if (currentValue < n && ++delta > maxInt) {
						error('overflow');
					}

					if (currentValue == n) {
						// Represent delta as a generalized variable-length integer
						for (q = delta, k = base; /* no condition */; k += base) {
							t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
							if (q < t) {
								break;
							}
							qMinusT = q - t;
							baseMinusT = base - t;
							output.push(
								stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
							);
							q = floor(qMinusT / baseMinusT);
						}

						output.push(stringFromCharCode(digitToBasic(q, 0)));
						bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
						delta = 0;
						++handledCPCount;
					}
				}

				++delta;
				++n;

			}
			return output.join('');
		}

		/**
		 * Converts a Punycode string representing a domain name or an email address
		 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
		 * it doesn't matter if you call it on a string that has already been
		 * converted to Unicode.
		 * @memberOf punycode
		 * @param {String} input The Punycoded domain name or email address to
		 * convert to Unicode.
		 * @returns {String} The Unicode representation of the given Punycode
		 * string.
		 */
		function toUnicode(input) {
			return mapDomain(input, function(string) {
				return regexPunycode.test(string)
					? decode(string.slice(4).toLowerCase())
					: string;
			});
		}

		/**
		 * Converts a Unicode string representing a domain name or an email address to
		 * Punycode. Only the non-ASCII parts of the domain name will be converted,
		 * i.e. it doesn't matter if you call it with a domain that's already in
		 * ASCII.
		 * @memberOf punycode
		 * @param {String} input The domain name or email address to convert, as a
		 * Unicode string.
		 * @returns {String} The Punycode representation of the given domain name or
		 * email address.
		 */
		function toASCII(input) {
			return mapDomain(input, function(string) {
				return regexNonASCII.test(string)
					? 'xn--' + encode(string)
					: string;
			});
		}

		/*--------------------------------------------------------------------------*/

		/** Define the public API */
		punycode = {
			/**
			 * A string representing the current Punycode.js version number.
			 * @memberOf punycode
			 * @type String
			 */
			'version': '1.3.2',
			/**
			 * An object of methods to convert from JavaScript's internal character
			 * representation (UCS-2) to Unicode code points, and back.
			 * @see <https://mathiasbynens.be/notes/javascript-encoding>
			 * @memberOf punycode
			 * @type Object
			 */
			'ucs2': {
				'decode': ucs2decode,
				'encode': ucs2encode
			},
			'decode': decode,
			'encode': encode,
			'toASCII': toASCII,
			'toUnicode': toUnicode
		};

		/** Expose `punycode` */
		// Some AMD build optimizers, like r.js, check for specific condition patterns
		// like the following:
		if (
			true
		) {
			!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
				return punycode;
			}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else if (freeExports && freeModule) {
			if (module.exports == freeExports) { // in Node.js or RingoJS v0.8.0+
				freeModule.exports = punycode;
			} else { // in Narwhal or RingoJS v0.7.0-
				for (key in punycode) {
					punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
				}
			}
		} else { // in Rhino or a web browser
			root.punycode = punycode;
		}

	}(this));

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)(module), (function() { return this; }())))

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  isString: function(arg) {
	    return typeof(arg) === 'string';
	  },
	  isObject: function(arg) {
	    return typeof(arg) === 'object' && arg !== null;
	  },
	  isNull: function(arg) {
	    return arg === null;
	  },
	  isNullOrUndefined: function(arg) {
	    return arg == null;
	  }
	};


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.decode = exports.parse = __webpack_require__(10);
	exports.encode = exports.stringify = __webpack_require__(11);


/***/ },
/* 10 */
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	'use strict';

	// If obj.hasOwnProperty has been overridden, then calling
	// obj.hasOwnProperty(prop) will break.
	// See: https://github.com/joyent/node/issues/1707
	function hasOwnProperty(obj, prop) {
	  return Object.prototype.hasOwnProperty.call(obj, prop);
	}

	module.exports = function(qs, sep, eq, options) {
	  sep = sep || '&';
	  eq = eq || '=';
	  var obj = {};

	  if (typeof qs !== 'string' || qs.length === 0) {
	    return obj;
	  }

	  var regexp = /\+/g;
	  qs = qs.split(sep);

	  var maxKeys = 1000;
	  if (options && typeof options.maxKeys === 'number') {
	    maxKeys = options.maxKeys;
	  }

	  var len = qs.length;
	  // maxKeys <= 0 means that we should not limit keys count
	  if (maxKeys > 0 && len > maxKeys) {
	    len = maxKeys;
	  }

	  for (var i = 0; i < len; ++i) {
	    var x = qs[i].replace(regexp, '%20'),
	        idx = x.indexOf(eq),
	        kstr, vstr, k, v;

	    if (idx >= 0) {
	      kstr = x.substr(0, idx);
	      vstr = x.substr(idx + 1);
	    } else {
	      kstr = x;
	      vstr = '';
	    }

	    k = decodeURIComponent(kstr);
	    v = decodeURIComponent(vstr);

	    if (!hasOwnProperty(obj, k)) {
	      obj[k] = v;
	    } else if (Array.isArray(obj[k])) {
	      obj[k].push(v);
	    } else {
	      obj[k] = [obj[k], v];
	    }
	  }

	  return obj;
	};


/***/ },
/* 11 */
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	'use strict';

	var stringifyPrimitive = function(v) {
	  switch (typeof v) {
	    case 'string':
	      return v;

	    case 'boolean':
	      return v ? 'true' : 'false';

	    case 'number':
	      return isFinite(v) ? v : '';

	    default:
	      return '';
	  }
	};

	module.exports = function(obj, sep, eq, name) {
	  sep = sep || '&';
	  eq = eq || '=';
	  if (obj === null) {
	    obj = undefined;
	  }

	  if (typeof obj === 'object') {
	    return Object.keys(obj).map(function(k) {
	      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
	      if (Array.isArray(obj[k])) {
	        return obj[k].map(function(v) {
	          return ks + encodeURIComponent(stringifyPrimitive(v));
	        }).join(sep);
	      } else {
	        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
	      }
	    }).join(sep);

	  }

	  if (!name) return '';
	  return encodeURIComponent(stringifyPrimitive(name)) + eq +
	         encodeURIComponent(stringifyPrimitive(obj));
	};


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _querystring = __webpack_require__(9);

	var _url = __webpack_require__(5);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Popup = function () {
	    function Popup($interval, $window) {
	        _classCallCheck(this, Popup);

	        this.$interval = $interval;
	        this.$window = $window;
	        this.popup = null;
	        this.url = 'about:blank'; // TODO remove
	        this.defaults = {
	            redirectUri: null
	        };
	    }

	    _createClass(Popup, [{
	        key: 'open',
	        value: function open(url, name, popupOptions, redirectUri) {
	            this.url = url; // TODO remove
	            var width = popupOptions.width || 500;
	            var height = popupOptions.height || 500;
	            var options = (0, _querystring.stringify)({
	                width: width,
	                height: height,
	                top: this.$window.screenY + (this.$window.outerHeight - height) / 2.5,
	                left: this.$window.screenX + (this.$window.outerWidth - width) / 2
	            }, ',');
	            var popupName = this.$window['cordova'] || this.$window.navigator.userAgent.includes('CriOS') ? '_blank' : name;
	            this.popup = this.$window.open(this.url, popupName, options);
	            if (this.popup && this.popup.focus) {
	                this.popup.focus();
	            }
	            if (this.$window['cordova']) {
	                return this.eventListener(this.defaults.redirectUri); // TODO pass redirect uri
	            } else {
	                    return this.polling(redirectUri);
	                }
	        }
	    }, {
	        key: 'polling',
	        value: function polling(redirectUri) {
	            var _this = this;

	            return new Promise(function (resolve, reject) {
	                var redirectUriObject = (0, _url.parse)(redirectUri);
	                var polling = _this.$interval(function () {
	                    if (!_this.popup || _this.popup.closed || _this.popup.closed === undefined) {
	                        _this.$interval.cancel(polling);
	                        reject(new Error('The popup window was closed'));
	                    }
	                    try {
	                        var popupUrl = _this.popup.location.host + _this.popup.location.pathname;
	                        if (popupUrl === redirectUriObject.host + redirectUriObject.pathname) {
	                            if (_this.popup.location.search || _this.popup.location.hash) {
	                                var query = (0, _querystring.parse)(_this.popup.location.search.substring(1).replace(/\/$/, ''));
	                                var hash = (0, _querystring.parse)(_this.popup.location.hash.substring(1).replace(/[\/$]/, ''));
	                                var params = Object.assign({}, query, hash);
	                                if (params.error) {
	                                    reject(new Error(params.error));
	                                } else {
	                                    resolve(params);
	                                }
	                            } else {
	                                reject(new Error('OAuth redirect has occurred but no query or hash parameters were found. ' + 'They were either not set during the redirect, or were removed—typically by a ' + 'routing library—before Satellizer could read it.'));
	                            }
	                            _this.$interval.cancel(polling);
	                            _this.popup.close();
	                        }
	                    } catch (error) {}
	                }, 500);
	            });
	        }
	    }, {
	        key: 'eventListener',
	        value: function eventListener(redirectUri) {
	            var _this2 = this;

	            return new Promise(function (resolve, reject) {
	                _this2.popup.addEventListener('loadstart', function (event) {
	                    if (!event.url.includes(redirectUri)) {
	                        return;
	                    }
	                    var url = (0, _url.parse)(event.url);
	                    if (url.search || url.hash) {
	                        var query = (0, _querystring.parse)(url.search.substring(1).replace(/\/$/, ''));
	                        var hash = (0, _querystring.parse)(url.hash.substring(1).replace(/[\/$]/, ''));
	                        var params = Object.assign({}, query, hash);
	                        if (params.error) {
	                            reject(new Error(params.error));
	                        } else {
	                            resolve(params);
	                        }
	                        _this2.popup.close();
	                    }
	                });
	                _this2.popup.addEventListener('loaderror', function () {
	                    reject(new Error('Authorization failed'));
	                });
	            });
	        }
	    }]);

	    return Popup;
	}();

	exports.default = Popup;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _url = __webpack_require__(5);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var OAuth = function () {
	    function OAuth($http, satellizerConfig, satellizerShared, satellizerOAuth1, satellizerOAuth2) {
	        _classCallCheck(this, OAuth);

	        this.$http = $http;
	        this.satellizerConfig = satellizerConfig;
	        this.satellizerShared = satellizerShared;
	        this.satellizerOAuth1 = satellizerOAuth1;
	        this.satellizerOAuth2 = satellizerOAuth2;
	    }

	    _createClass(OAuth, [{
	        key: 'authenticate',
	        value: function authenticate(name, data) {
	            var _this = this;

	            return new Promise(function (resolve, reject) {
	                var provider = _this.satellizerConfig.providers[name];
	                var initialize = provider.oauthType === '1.0' ? _this.satellizerOAuth1.init(provider, data) : _this.satellizerOAuth2.init(provider, data);
	                return initialize.then(function (response) {
	                    if (provider.url) {
	                        _this.satellizerShared.setToken(response);
	                    }
	                    resolve(response);
	                }).catch(function (error) {
	                    reject(error);
	                });
	            });
	        }
	    }, {
	        key: 'unlink',
	        value: function unlink(provider, httpOptions) {
	            httpOptions.url = httpOptions.url ? httpOptions.url : (0, _url.resolve)(this.satellizerConfig.baseUrl, this.satellizerConfig.unlinkUrl);
	            httpOptions.data = { provider: provider } || httpOptions.data;
	            httpOptions.method = httpOptions.method || 'POST';
	            httpOptions.withCredentials = httpOptions.withCredentials || this.satellizerConfig.withCredentials;
	            return this.$http(httpOptions);
	        }
	    }]);

	    return OAuth;
	}();

	exports.default = OAuth;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _url = __webpack_require__(5);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var OAuth2 = function () {
	    function OAuth2($http, $window, $timeout, satellizerConfig, satellizerPopup, satellizerStorage) {
	        _classCallCheck(this, OAuth2);

	        this.$http = $http;
	        this.$window = $window;
	        this.$timeout = $timeout;
	        this.satellizerConfig = satellizerConfig;
	        this.satellizerPopup = satellizerPopup;
	        this.satellizerStorage = satellizerStorage;
	        this.defaults = {
	            url: null,
	            clientId: null,
	            name: null,
	            authorizationEndpoint: null,
	            redirectUri: null,
	            scopePrefix: null,
	            scopeDelimiter: null,
	            state: null,
	            defaultUrlParams: ['response_type', 'client_id', 'redirect_uri'],
	            responseType: 'code',
	            responseParams: {
	                code: 'code',
	                clientId: 'clientId',
	                redirectUri: 'redirectUri'
	            },
	            popupOptions: { width: null, height: null }
	        };
	    }

	    _createClass(OAuth2, [{
	        key: 'init',
	        value: function init(options, data) {
	            var _this = this;

	            return new Promise(function (resolve, reject) {
	                Object.assign(_this.defaults, options);
	                _this.$timeout(function () {
	                    var url = [_this.defaults.authorizationEndpoint, _this.buildQueryString()].join('?');
	                    var stateName = _this.defaults.name + '_state'; // TODO what if name is undefined
	                    var _defaults = _this.defaults;
	                    var name = _defaults.name;
	                    var state = _defaults.state;
	                    var popupOptions = _defaults.popupOptions;
	                    var redirectUri = _defaults.redirectUri;
	                    var responseType = _defaults.responseType;

	                    if (typeof state === 'function') {
	                        _this.satellizerStorage.set(stateName, state());
	                    } else if (typeof state === 'string') {
	                        _this.satellizerStorage.set(stateName, state);
	                    }
	                    _this.satellizerPopup.open(url, name, popupOptions, redirectUri).then(function (oauth) {
	                        if (responseType === 'token' || !url) {
	                            return resolve(oauth);
	                        }
	                        if (oauth.state && oauth.state !== _this.satellizerStorage.get(stateName)) {
	                            return reject(new Error('The value returned in the state parameter does not match the state value from your original ' + 'authorization code request.'));
	                        }
	                        resolve(_this.exchangeForToken(oauth, data));
	                    }).catch(function (error) {
	                        return reject(error);
	                    });
	                });
	            });
	        }
	    }, {
	        key: 'exchangeForToken',
	        value: function exchangeForToken(oauth, data) {
	            var _this2 = this;

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
	                        payload[value] = _this2.defaults.clientId;
	                        break;
	                    case 'redirectUri':
	                        payload[value] = _this2.defaults.redirectUri;
	                        break;
	                    default:
	                        payload[value] = oauth[key];
	                }
	            });
	            if (oauth.state) {
	                payload.state = oauth.state;
	            }
	            var exchangeForTokenUrl = this.satellizerConfig.baseUrl ? (0, _url.resolve)(this.satellizerConfig.baseUrl, this.defaults.url) : this.defaults.url;
	            return this.$http.post(exchangeForTokenUrl, payload, { withCredentials: this.satellizerConfig.withCredentials });
	        }
	    }, {
	        key: 'buildQueryString',
	        value: function buildQueryString() {
	            var _this3 = this;

	            var keyValuePairs = [];
	            var urlParamsCategories = ['defaultUrlParams', 'requiredUrlParams', 'optionalUrlParams'];
	            angular.forEach(urlParamsCategories, function (paramsCategory) {
	                angular.forEach(_this3.defaults[paramsCategory], function (paramName) {
	                    var camelizedName = _this3.camelCase(paramName);
	                    var paramValue = angular.isFunction(_this3.defaults[paramName]) ? _this3.defaults[paramName]() : _this3.defaults[camelizedName];
	                    if (paramName === 'redirect_uri' && !paramValue) {
	                        return;
	                    }
	                    if (paramName === 'state') {
	                        var stateName = _this3.defaults.name + '_state'; // todo what if name undefined
	                        paramValue = encodeURIComponent(_this3.satellizerStorage.get(stateName));
	                    }
	                    if (paramName === 'scope' && Array.isArray(paramValue)) {
	                        paramValue = paramValue.join(_this3.defaults.scopeDelimiter);
	                        if (_this3.defaults.scopePrefix) {
	                            paramValue = [_this3.defaults.scopePrefix, paramValue].join(_this3.defaults.scopeDelimiter);
	                        }
	                    }
	                    keyValuePairs.push([paramName, paramValue]);
	                });
	            });
	            return keyValuePairs.map(function (pair) {
	                return pair.join('=');
	            }).join('&');
	        }
	    }, {
	        key: 'camelCase',
	        value: function camelCase(name) {
	            return name.replace(/([\:\-\_]+(.))/g, function (_, separator, letter, offset) {
	                return offset ? letter.toUpperCase() : letter;
	            });
	        }
	    }]);

	    return OAuth2;
	}();

	exports.default = OAuth2;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _url = __webpack_require__(5);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var OAuth1 = function () {
	    function OAuth1($http, $window, satellizerConfig, satellizerPopup) {
	        _classCallCheck(this, OAuth1);

	        this.$http = $http;
	        this.$window = $window;
	        this.satellizerConfig = satellizerConfig;
	        this.satellizerPopup = satellizerPopup;
	        this.defaults = {
	            url: null,
	            redirectUri: null
	        };
	    }

	    _createClass(OAuth1, [{
	        key: 'init',
	        value: function init(options, data) {
	            var _this = this;

	            var name = options.name;
	            var popupOptions = options.popupOptions;
	            var redirectUri = options.redirectUri;

	            var popupWindow = void 0;
	            if (!this.$window['cordova']) {
	                popupWindow = this.satellizerPopup.open('about:blank', name, popupOptions, redirectUri);
	            }
	            return this.getRequestToken().then(function (response) {
	                var url = [options.authorizationEndpoint, _this.buildQueryString(response.data)].join('?');
	                if (_this.$window['cordova']) {
	                    popupWindow = _this.satellizerPopup.open(url, name, popupOptions, redirectUri);
	                } else {
	                    popupWindow.popupWindow.location = url;
	                }
	                var popupListener = void 0;
	                if (_this.$window['cordova']) {
	                    popupListener = popupWindow.eventListener(_this.defaults.redirectUri);
	                } else {
	                    popupListener = popupWindow.pollPopup(_this.defaults.redirectUri);
	                }
	                return popupListener.then(function (popupResponse) {
	                    return _this.exchangeForToken(popupResponse, data);
	                });
	            });
	        }
	    }, {
	        key: 'getRequestToken',
	        value: function getRequestToken() {
	            var url = this.satellizerConfig.baseUrl ? (0, _url.resolve)(this.satellizerConfig.baseUrl, this.defaults.url) : this.defaults.url;
	            return this.$http.post(url, this.defaults);
	        }
	    }, {
	        key: 'exchangeForToken',
	        value: function exchangeForToken(oauth, data) {
	            var payload = Object.assign({}, data, oauth);
	            var exchangeForTokenUrl = this.satellizerConfig.baseUrl ? (0, _url.resolve)(this.satellizerConfig.baseUrl, this.defaults.url) : this.defaults.url;
	            return this.$http.post(exchangeForTokenUrl, payload, { withCredentials: this.satellizerConfig.withCredentials });
	        }
	    }, {
	        key: 'buildQueryString',
	        value: function buildQueryString(obj) {
	            var str = [];
	            angular.forEach(obj, function (value, key) {
	                str.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
	            });
	            return str.join('&');
	        }
	    }]);

	    return OAuth1;
	}();

	exports.default = OAuth1;

/***/ },
/* 16 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Storage = function () {
	    function Storage($window, satellizerConfig) {
	        _classCallCheck(this, Storage);

	        this.$window = $window;
	        this.satellizerConfig = satellizerConfig;
	        this.memoryStore = {};
	    }

	    _createClass(Storage, [{
	        key: "get",
	        value: function get(key) {
	            try {
	                return this.$window[this.satellizerConfig.storageType].getItem(key);
	            } catch (e) {
	                return this.memoryStore[key];
	            }
	        }
	    }, {
	        key: "set",
	        value: function set(key, value) {
	            try {
	                this.$window[this.satellizerConfig.storageType].setItem(key, value);
	            } catch (e) {
	                this.memoryStore[key] = value;
	            }
	        }
	    }, {
	        key: "remove",
	        value: function remove(key) {
	            try {
	                this.$window[this.satellizerConfig.storageType].removeItem(key);
	            } catch (e) {
	                delete this.memoryStore[key];
	            }
	        }
	    }]);

	    return Storage;
	}();

	exports.default = Storage;

/***/ },
/* 17 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Interceptor = function Interceptor($q, satellizerConfig, satellizerShared, satellizerStorage) {
	    var _this = this;

	    _classCallCheck(this, Interceptor);

	    this.$q = $q;
	    this.satellizerConfig = satellizerConfig;
	    this.satellizerShared = satellizerShared;
	    this.satellizerStorage = satellizerStorage;
	    this.request = function (request) {
	        if (request.skipAuthorization) {
	            return request;
	        }
	        if (_this.satellizerShared.isAuthenticated() && _this.satellizerConfig.httpInterceptor(request)) {
	            var tokenName = _this.satellizerConfig.tokenPrefix ? [_this.satellizerConfig.tokenPrefix, _this.satellizerConfig.tokenName].join('_') : _this.satellizerConfig.tokenName;
	            var token = _this.satellizerStorage.get(tokenName);
	            if (_this.satellizerConfig.authHeader && _this.satellizerConfig.authToken) {
	                token = _this.satellizerConfig.authToken + ' ' + token;
	            }
	            request.headers[_this.satellizerConfig.authHeader] = token;
	        }
	        return request;
	    };
	    this.responseError = function (response) {
	        return _this.$q.reject(response);
	    };
	};

	exports.default = Interceptor;

	Interceptor.$inject = ['$q', 'satellizerConfig', 'satellizerShared', 'satellizerStorage'];

/***/ },
/* 18 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var HttpProviderConfig = function HttpProviderConfig($httpProvider) {
	    _classCallCheck(this, HttpProviderConfig);

	    this.$httpProvider = $httpProvider;
	    $httpProvider.interceptors.push('satellizerInterceptor');
	};

	exports.default = HttpProviderConfig;

	HttpProviderConfig.$inject = ['$httpProvider'];

/***/ }
/******/ ])
});
;