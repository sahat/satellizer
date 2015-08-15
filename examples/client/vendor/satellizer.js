/**
 * Satellizer 0.11.2
 * (c) 2015 Sahat Yalkabov
 * License: MIT
 */
(function(window, angular, undefined) {
  'use strict';

  angular.module('satellizer', [])
    .constant('SatellizerConfig', {
      httpInterceptor: true,
      loginOnSignup: true,
      withCredentials: true,
      tokenRoot: false,
      cordova: false,
      baseUrl: '/',
      loginRedirect: '/',
      logoutRedirect: '/',
      signupRedirect: '/login',
      loginUrl: '/auth/login',
      signupUrl: '/auth/signup',
      loginRoute: '/login',
      signupRoute: '/signup',
      tokenName: 'token',
      tokenPrefix: 'satellizer',
      unlinkUrl: '/auth/unlink/',
      unlinkMethod: 'get',
      authHeader: 'Authorization',
      authToken: 'Bearer',
      storageType: 'localStorage',
      providers: {
        google: {
          name: 'google',
          url: '/auth/google',
          authorizationEndpoint: 'https://accounts.google.com/o/oauth2/auth',
          redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
          scope: ['profile', 'email'],
          scopePrefix: 'openid',
          scopeDelimiter: ' ',
          requiredUrlParams: ['scope'],
          optionalUrlParams: ['display'],
          display: 'popup',
          type: '2.0',
          popupOptions: { width: 452, height: 633 }
        },
        facebook: {
          name: 'facebook',
          url: '/auth/facebook',
          authorizationEndpoint: 'https://www.facebook.com/v2.3/dialog/oauth',
          redirectUri: (window.location.origin || window.location.protocol + '//' + window.location.host) + '/',
          scope: ['email'],
          scopeDelimiter: ',',
          requiredUrlParams: ['nonce','display', 'scope'],
          display: 'popup',
          type: '2.0',
          popupOptions: { width: 580, height: 400 }
        },
        linkedin: {
          name: 'linkedin',
          url: '/auth/linkedin',
          authorizationEndpoint: 'https://www.linkedin.com/uas/oauth2/authorization',
          redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
          requiredUrlParams: ['state'],
          scope: ['r_emailaddress'],
          scopeDelimiter: ' ',
          state: 'STATE',
          type: '2.0',
          popupOptions: { width: 527, height: 582 }
        },
        github: {
          name: 'github',
          url: '/auth/github',
          authorizationEndpoint: 'https://github.com/login/oauth/authorize',
          redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
          optionalUrlParams: ['scope'],
          scope: ['user:email'],
          scopeDelimiter: ' ',
          type: '2.0',
          popupOptions: { width: 1020, height: 618 }
        },
        yahoo: {
          name: 'yahoo',
          url: '/auth/yahoo',
          authorizationEndpoint: 'https://api.login.yahoo.com/oauth2/request_auth',
          redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
          scope: [],
          scopeDelimiter: ',',
          type: '2.0',
          popupOptions: { width: 559, height: 519 }
        },
        twitter: {
          name: 'twitter',
          url: '/auth/twitter',
          authorizationEndpoint: 'https://api.twitter.com/oauth/authenticate',
          redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
          type: '1.0',
          popupOptions: { width: 495, height: 645 }
        },
        live: {
          name: 'live',
          url: '/auth/live',
          authorizationEndpoint: 'https://login.live.com/oauth20_authorize.srf',
          redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
          scope: ['wl.emails'],
          scopeDelimiter: ' ',
          requiredUrlParams: ['display', 'scope'],
          display: 'popup',
          type: '2.0',
          popupOptions: { width: 500, height: 560 }
        },
        azure: {
          name: 'azure',
          url: '/auth/azure',
          authorizationEndpoint: 'https://login.microsoftonline.com/common/oauth2/authorize',
          redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
          type: '2.0'
        }
      }
    })
    .provider('$auth', ['SatellizerConfig', function(config) {
      Object.defineProperties(this, {
        httpInterceptor: {
          get: function() { return config.httpInterceptor; },
          set: function(value) { config.httpInterceptor = value; }
        },
        loginOnSignup: {
          get: function() { return config.loginOnSignup; },
          set: function(value) { config.loginOnSignup = value; }
        },
        baseUrl: {
          get: function() { return config.baseUrl; },
          set: function(value) { config.baseUrl = value; }
        },
        logoutRedirect: {
          get: function() { return config.logoutRedirect; },
          set: function(value) { config.logoutRedirect = value; }
        },
        loginRedirect: {
          set: function(value) { config.loginRedirect = value; },
          get: function() { return config.loginRedirect; }
        },
        signupRedirect: {
          get: function() { return config.signupRedirect; },
          set: function(value) { config.signupRedirect = value; }
        },
        loginUrl: {
          get: function() { return config.loginUrl; },
          set: function(value) { config.loginUrl = value; }
        },
        signupUrl: {
          get: function() { return config.signupUrl; },
          set: function(value) { config.signupUrl = value; }
        },
        loginRoute: {
          get: function() { return config.loginRoute; },
          set: function(value) { config.loginRoute = value; }
        },
        signupRoute: {
          get: function() { return config.signupRoute; },
          set: function(value) { config.signupRoute = value; }
        },
        tokenRoot: {
          get: function() { return config.tokenRoot; },
          set: function(value) { config.tokenRoot = value; }
        },
        tokenName: {
          get: function() { return config.tokenName; },
          set: function(value) { config.tokenName = value; }
        },
        tokenPrefix: {
          get: function() { return config.tokenPrefix; },
          set: function(value) { config.tokenPrefix = value; }
        },
        unlinkUrl: {
          get: function() { return config.unlinkUrl; },
          set: function(value) { config.unlinkUrl = value; }
        },
        authHeader: {
          get: function() { return config.authHeader; },
          set: function(value) { config.authHeader = value; }
        },
        authToken: {
          get: function() { return config.authToken; },
          set: function(value) { config.authToken = value; }
        },
        withCredentials: {
          get: function() { return config.withCredentials; },
          set: function(value) { config.withCredentials = value; }
        },
        unlinkMethod: {
          get: function() { return config.unlinkMethod; },
          set: function(value) { config.unlinkMethod = value; }
        },
        cordova: {
          get: function() { return config.cordova; },
          set: function(value) { config.cordova = value; }
        },
        storageType: {
          get: function() { return config.storageType; },
          set: function(value) { config.storageType = value; }
        }
      });

      angular.forEach(Object.keys(config.providers), function(provider) {
        this[provider] = function(params) {
          return angular.extend(config.providers[provider], params);
        };
      }, this);

      var oauth = function(params) {
        config.providers[params.name] = config.providers[params.name] || {};
        angular.extend(config.providers[params.name], params);
      };

      this.oauth1 = function(params) {
        oauth(params);
        config.providers[params.name].type = '1.0';
      };

      this.oauth2 = function(params) {
        oauth(params);
        config.providers[params.name].type = '2.0';
      };

      this.$get = [
        '$q',
        'SatellizerShared',
        'SatellizerLocal',
        'SatellizerOauth',
        function($q, shared, local, oauth) {
          var $auth = {};

          $auth.authenticate = function(name, userData) {
            return oauth.authenticate(name, false, userData);
          };

          $auth.login = function(user, opts) {
            return local.login(user, opts);
          };

          $auth.signup = function(user) {
            return local.signup(user);
          };

          $auth.logout = function(redirect) {
            return shared.logout(redirect);
          };

          $auth.isAuthenticated = function() {
            return shared.isAuthenticated();
          };

          $auth.link = function(name, userData) {
            return oauth.authenticate(name, true, userData);
          };

          $auth.unlink = function(provider) {
            return oauth.unlink(provider);
          };

          $auth.getToken = function() {
            return shared.getToken();
          };

          $auth.setToken = function(token, redirect) {
            shared.setToken({ access_token: token }, redirect);
          };

          $auth.removeToken = function() {
            return shared.removeToken();
          };

          $auth.getPayload = function() {
            return shared.getPayload();
          };

          $auth.setStorageType = function(type) {
            return shared.setStorageType(type);
          };

          return $auth;
        }];

    }])
    .factory('SatellizerShared', [
      '$q',
      '$window',
      '$location',
      'SatellizerConfig',
      'SatellizerStorage',
      function($q, $window, $location, config, storage) {
        var shared = {};
        var tokenName = config.tokenPrefix ? [config.tokenPrefix, config.tokenName].join('_') : config.tokenName;

        shared.getToken = function() {
          return storage.get(tokenName);
        };

        shared.getPayload = function() {
          var token = storage.get(tokenName);

          if (token && token.split('.').length === 3) {
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace('-', '+').replace('_', '/');
            return JSON.parse(decodeURIComponent(escape(window.atob(base64))));
          }
        };

        shared.setToken = function(response, redirect) {
          var accessToken = response && response.access_token;
          var token;

          if (accessToken) {
            if (angular.isObject(accessToken) && angular.isObject(accessToken.data)) {
              response = accessToken;
            } else if (angular.isString(accessToken)) {
              token = accessToken;
            }
          }

          if (!token && response) {
            token = config.tokenRoot && response.data[config.tokenRoot] ?
              response.data[config.tokenRoot][config.tokenName] : response.data[config.tokenName];
          }

          if (!token) {
            var tokenPath = config.tokenRoot ? config.tokenRoot + '.' + config.tokenName : config.tokenName;
            throw new Error('Expecting a token named "' + tokenPath + '" but instead got: ' + JSON.stringify(response.data));
          }

          storage.set(tokenName, token);

          if (config.loginRedirect && !redirect) {
            $location.path(config.loginRedirect);
          } else if (redirect && angular.isString(redirect)) {
            $location.path(encodeURI(redirect));
          }
        };

        shared.removeToken = function() {
          storage.remove(tokenName);
        };

        shared.isAuthenticated = function() {
          var token = storage.get(tokenName);

          if (token) {
            if (token.split('.').length === 3) {
              var base64Url = token.split('.')[1];
              var base64 = base64Url.replace('-', '+').replace('_', '/');
              var exp = JSON.parse($window.atob(base64)).exp;
              if (exp) {
                return Math.round(new Date().getTime() / 1000) <= exp;
              }
              return true;
            }
            return true;
          }
          return false;
        };

        shared.logout = function(redirect) {
          storage.remove(tokenName);

          if (config.logoutRedirect && !redirect) {
            $location.url(config.logoutRedirect);
          }
          else if (angular.isString(redirect)) {
            $location.url(redirect);
          }

          return $q.when();
        };

        shared.setStorageType = function(type) {
          config.storageType = type;
        };

        return shared;
      }])
    .factory('SatellizerOauth', [
      '$q',
      '$http',
      'SatellizerConfig',
      'SatellizerUtils',
      'SatellizerShared',
      'SatellizerOauth1',
      'SatellizerOauth2',
      function($q, $http, config, utils, shared, Oauth1, Oauth2) {
        var oauth = {};

        oauth.authenticate = function(name, redirect, userData) {
          var provider = config.providers[name].type === '1.0' ? new Oauth1() : new Oauth2();
          var deferred = $q.defer();

          provider.open(config.providers[name], userData || {})
            .then(function(response) {
              shared.setToken(response, redirect);
              deferred.resolve(response);
            })
            .catch(function(error) {
              deferred.reject(error);
            });

          return deferred.promise;
        };

        oauth.unlink = function(provider) {
          var unlinkUrl =  config.baseUrl ? utils.joinUrl(config.baseUrl, config.unlinkUrl) : config.unlinkUrl;

          if (config.unlinkMethod === 'get') {
            return $http.get(unlinkUrl + provider);
          } else if (config.unlinkMethod === 'post') {
            return $http.post(unlinkUrl, provider);
          }
        };

        return oauth;
      }])
    .factory('SatellizerLocal', [
      '$http',
      'SatellizerUtils',
      'SatellizerShared',
      'SatellizerConfig',
      function($http, utils, shared, config) {
        var Local = {};

        /**
         * @param {Object} user - User information. (e.g. email and password)
         * @param {Object} opts - HTTP config object.
         *    - method – {String} – HTTP method. (e.g. 'GET', 'POST', etc)
         *    - url – {String} – Absolute or relative URL of the resource that is being requested.
         *    - params – {Object.<String|Object>} – Map of strings or objects which will be serialized with the paramSerializer and appended as GET parameters.
         *    - data – {String|Object} – Data to be sent as the request message data.
         *    - headers – {Object} – Map of strings or functions which return strings representing HTTP headers to send to the server. If the return value of a function is null, the header will not be sent. Functions accept a config object as an argument.
         *    - xsrfHeaderName – {String} – Name of HTTP header to populate with the XSRF token.
         *    - xsrfCookieName – {String} – Name of cookie containing the XSRF token.
         *    - transformRequest – {function(data, headersGetter)|Array.<function(data, headersGetter)>} – transform function or an array of such functions. The transform function takes the http request body and headers and returns its transformed (typically serialized) version. See Overriding the Default Transformations
         *    - transformResponse – {function(data, headersGetter, status)|Array.<function(data, headersGetter, status)>} – transform function or an array of such functions. The transform function takes the http response body, headers and status and returns its transformed (typically deserialized) version. See Overriding the Default TransformationjqLiks
         *    - paramSerializer - {String|function(Object<String,String>):String} - A function used to prepare the string representation of request parameters (specified as an object). If specified as string, it is interpreted as function registered with the $injector, which means you can create your own serializer by registering it as a service. The default serializer is the $httpParamSerializer; alternatively, you can use the $httpParamSerializerJQLike
         *    - cache – {Boolean|Cache} – If true, a default $http cache will be used to cache the GET request, otherwise if a cache instance built with $cacheFactory, this cache will be used for caching.
         *    - timeout – {Number|Promise} – timeout in milliseconds, or promise that should abort the request when resolved.
         *    - withCredentials - {Boolean} - whether to set the withCredentials flag on the XHR object. See requests with credentials for more information.
         *    - responseType - {String} - see XMLHttpRequest.responseType.
         * @returns {Promise} - Returns a Promise that will be resolved when the request succeeds or fails.
         */
        Local.login = function(user, opts) {
          opts = opts || {};
          opts.url = config.baseUrl ? utils.joinUrl(config.baseUrl, config.loginUrl) : config.loginUrl;
          opts.data = user || opts.data;
          opts.method = opts.method || 'POST';

          return $http(opts).then(function(response) {
            shared.setToken(response);
            return response;
          });
        };

        /**
         * @param {Object} user - User information. (e.g. email and password)
         * @param {Object} opts - HTTP config object.
         *    - method – {String} – HTTP method. (e.g. 'GET', 'POST', etc)
         *    - url – {String} – Absolute or relative URL of the resource that is being requested.
         *    - params – {Object.<String|Object>} – Map of strings or objects which will be serialized with the paramSerializer and appended as GET parameters.
         *    - data – {String|Object} – Data to be sent as the request message data.
         *    - headers – {Object} – Map of strings or functions which return strings representing HTTP headers to send to the server. If the return value of a function is null, the header will not be sent. Functions accept a config object as an argument.
         *    - xsrfHeaderName – {String} – Name of HTTP header to populate with the XSRF token.
         *    - xsrfCookieName – {String} – Name of cookie containing the XSRF token.
         *    - transformRequest – {function(data, headersGetter)|Array.<function(data, headersGetter)>} – transform function or an array of such functions. The transform function takes the http request body and headers and returns its transformed (typically serialized) version. See Overriding the Default Transformations
         *    - transformResponse – {function(data, headersGetter, status)|Array.<function(data, headersGetter, status)>} – transform function or an array of such functions. The transform function takes the http response body, headers and status and returns its transformed (typically deserialized) version. See Overriding the Default TransformationjqLiks
         *    - paramSerializer - {String|function(Object<String,String>):String} - A function used to prepare the string representation of request parameters (specified as an object). If specified as string, it is interpreted as function registered with the $injector, which means you can create your own serializer by registering it as a service. The default serializer is the $httpParamSerializer; alternatively, you can use the $httpParamSerializerJQLike
         *    - cache – {Boolean|Cache} – If true, a default $http cache will be used to cache the GET request, otherwise if a cache instance built with $cacheFactory, this cache will be used for caching.
         *    - timeout – {Number|Promise} – timeout in milliseconds, or promise that should abort the request when resolved.
         *    - withCredentials - {Boolean} - whether to set the withCredentials flag on the XHR object. See requests with credentials for more information.
         *    - responseType - {String} - see XMLHttpRequest.responseType.
         * @returns {Promise} - Returns a Promise that will be resolved when the request succeeds or fails.
         */
        Local.signup = function(user, opts) {
          opts = opts || {};
          opts.url = config.baseUrl ? utils.joinUrl(config.baseUrl, config.signupUrl) : config.signupUrl;
          opts.data = user || opts.data;
          opts.method = opts.method || 'POST';

          return $http(opts);
        };

        return Local;
      }])
    .factory('SatellizerOauth2', [
      '$q',
      '$http',
      '$window',
      'SatellizerPopup',
      'SatellizerUtils',
      'SatellizerConfig',
      'SatellizerStorage',
      function($q, $http, $window, popup, utils, config, storage) {
        return function() {

          var defaults = {
            url: null,
            name: null,
            state: null,
            scope: null,
            scopeDelimiter: null,
            clientId: null,
            redirectUri: null,
            popupOptions: null,
            authorizationEndpoint: null,
            responseParams: null,
            requiredUrlParams: null,
            optionalUrlParams: null,
            defaultUrlParams: ['response_type', 'client_id', 'redirect_uri'],
            responseType: 'code'
          };

          var oauth2 = {};

          oauth2.open = function(options, userData) {
            angular.extend(defaults, options);

            var stateName = defaults.name + '_state';

            if (angular.isFunction(defaults.state)) {
              storage.set(stateName, defaults.state());
            } else if (angular.isString(defaults.state)) {
              storage.set(stateName, defaults.state);
            }

            var url = defaults.authorizationEndpoint + '?' + oauth2.buildQueryString();

            var openPopup;
            if (config.cordova) {
              openPopup = popup.open(url, defaults.name, defaults.popupOptions, defaults.redirectUri).eventListener(defaults.redirectUri);
            } else {
              openPopup = popup.open(url, defaults.name, defaults.popupOptions, defaults.redirectUri).pollPopup();
            }

            return openPopup.then(function(oauthData) {
              if (defaults.responseType === 'token') {
                return oauthData;
              }
              if (oauthData.state && oauthData.state !== storage.get(stateName)) {
                return $q.reject('OAuth 2.0 state parameter mismatch.');
              }
              return oauth2.exchangeForToken(oauthData, userData);
            });

          };

          oauth2.exchangeForToken = function(oauthData, userData) {
            var data = angular.extend({}, userData, {
              code: oauthData.code,
              clientId: defaults.clientId,
              redirectUri: defaults.redirectUri
            });

            if (oauthData.state) {
              data.state = oauthData.state;
            }

            angular.forEach(defaults.responseParams, function(param) {
              data[param] = oauthData[param];
            });

            var exchangeForTokenUrl = config.baseUrl ? utils.joinUrl(config.baseUrl, defaults.url) : defaults.url;
            return $http.post(exchangeForTokenUrl, data, { withCredentials: config.withCredentials });
          };

          oauth2.buildQueryString = function() {
            var keyValuePairs = [];
            var urlParams = ['defaultUrlParams', 'requiredUrlParams', 'optionalUrlParams'];

            angular.forEach(urlParams, function(params) {

              angular.forEach(defaults[params], function(paramName) {
                var camelizedName = utils.camelCase(paramName);
                var paramValue = angular.isFunction(defaults[paramName]) ? defaults[paramName]() : defaults[camelizedName];

                if (paramName === 'state') {
                  var stateName = defaults.name + '_state';
                  paramValue = encodeURIComponent(storage.get(stateName));
                }

                if (paramName === 'scope' && Array.isArray(paramValue)) {
                  paramValue = paramValue.join(defaults.scopeDelimiter);

                  if (defaults.scopePrefix) {
                    paramValue = [defaults.scopePrefix, paramValue].join(defaults.scopeDelimiter);
                  }
                }

                keyValuePairs.push([paramName, paramValue]);
              });
            });

            return keyValuePairs.map(function(pair) {
              return pair.join('=');
            }).join('&');
          };

          return oauth2;
        };
      }])
    .factory('SatellizerOauth1', [
      '$q',
      '$http',
      'SatellizerPopup',
      'SatellizerConfig',
      'SatellizerUtils',
      function($q, $http, popup, config, utils) {
        return function() {

          var defaults = {
            url: null,
            name: null,
            popupOptions: null,
            redirectUri: null,
            authorizationEndpoint: null
          };

          var oauth1 = {};

          oauth1.open = function(options, userData) {
            angular.extend(defaults, options);
            var popupWindow;
            var serverUrl = config.baseUrl ? utils.joinUrl(config.baseUrl, defaults.url) : defaults.url;

            if (!config.cordova) {
              popupWindow = popup.open('', defaults.name, defaults.popupOptions, defaults.redirectUri);
            }

            return $http.post(serverUrl, defaults)
              .then(function(response) {
                if (config.cordova) {
                  popupWindow = popup.open([defaults.authorizationEndpoint, oauth1.buildQueryString(response.data)].join('?'), defaults.name, defaults.popupOptions, defaults.redirectUri);
                } else {
                  popupWindow.popupWindow.location = [defaults.authorizationEndpoint, oauth1.buildQueryString(response.data)].join('?');
                }

                var popupListener = config.cordova ? popupWindow.eventListener(defaults.redirectUri) : popupWindow.pollPopup();

                return popupListener.then(function(response) {
                  return oauth1.exchangeForToken(response, userData);
                });
              });

          };

          oauth1.exchangeForToken = function(oauthData, userData) {
            var data = angular.extend({}, userData, oauthData);
            var exchangeForTokenUrl = config.baseUrl ? utils.joinUrl(config.baseUrl, defaults.url) : defaults.url;
            return $http.post(exchangeForTokenUrl, data, { withCredentials: config.withCredentials });
          };

          oauth1.buildQueryString = function(obj) {
            var str = [];

            angular.forEach(obj, function(value, key) {
              str.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
            });

            return str.join('&');
          };

          return oauth1;
        };
      }])
    .factory('SatellizerPopup', [
      '$q',
      '$interval',
      '$window',
      '$location',
      'SatellizerConfig',
      'SatellizerUtils',
      function($q, $interval, $window, $location, config, utils) {
        var popup = {};
        popup.url = '';
        popup.popupWindow = null;

        popup.open = function(url, name, options, redirectUri) {
          popup.url = url;

          var stringifiedOptions = popup.stringifyOptions(popup.prepareOptions(options || {}));
          var windowName = config.cordova ? '_blank' : name;

          popup.popupWindow = window.open(url, windowName, stringifiedOptions);

          window.popup =  popup.popupWindow;

          if (popup.popupWindow && popup.popupWindow.focus) {
            popup.popupWindow.focus();
          }

          return popup;
        };

        popup.eventListener = function(redirectUri) {
          var deferred = $q.defer();

          popup.popupWindow.addEventListener('loadstart', function(event) {
            if (event.url.indexOf(redirectUri) !== 0) { return; }

            var parser = document.createElement('a');
            parser.href = event.url;

            if (parser.search || parser.hash) {
              var queryParams = parser.search.substring(1).replace(/\/$/, '');
              var hashParams = parser.hash.substring(1).replace(/\/$/, '');
              var hash = utils.parseQueryString(hashParams);
              var qs = utils.parseQueryString(queryParams);

              angular.extend(qs, hash);

              if (qs.error) {
                deferred.reject({ error: qs.error });
              } else {
                deferred.resolve(qs);
              }

              popup.popupWindow.close();
            }
          });

          popup.popupWindow.addEventListener('exit', function() {
            deferred.reject({ data: 'Provider Popup was closed' });
          });

          popup.popupWindow.addEventListener('loaderror', function() {
            deferred.reject({ data: 'Authorization Failed' });
          });

          return deferred.promise;
        };

        popup.pollPopup = function() {
          var polling;
          var deferred = $q.defer();

          polling = $interval(function() {
            try {
              var documentOrigin = document.location.host;
              var popupWindowOrigin = popup.popupWindow.location.host;

              if (popupWindowOrigin === documentOrigin && (popup.popupWindow.location.search || popup.popupWindow.location.hash)) {
                var queryParams = popup.popupWindow.location.search.substring(1).replace(/\/$/, '');
                var hashParams = popup.popupWindow.location.hash.substring(1).replace(/[\/$]/, '');
                var hash = utils.parseQueryString(hashParams);
                var qs = utils.parseQueryString(queryParams);

                angular.extend(qs, hash);

                if (qs.error) {
                  deferred.reject({ error: qs.error });
                } else {
                  deferred.resolve(qs);
                }

                popup.popupWindow.close();
                $interval.cancel(polling);
              }
            } catch (error) {}

            if (!popup.popupWindow) {
              $interval.cancel(polling);
              deferred.reject({ data: 'Provider Popup Blocked' });
            } else if (popup.popupWindow.closed || popup.popupWindow.closed === undefined) {
              $interval.cancel(polling);
              deferred.reject({ data: 'Authorization Failed' });
            }
          }, 35);

          return deferred.promise;
        };

        popup.prepareOptions = function(options) {
          var width = options.width || 500;
          var height = options.height || 500;
          return angular.extend({
            width: width,
            height: height,
            left: $window.screenX + (($window.outerWidth - width) / 2),
            top: $window.screenY + (($window.outerHeight - height) / 2.5)
          }, options);
        };

        popup.stringifyOptions = function(options) {
          var parts = [];
          angular.forEach(options, function(value, key) {
            parts.push(key + '=' + value);
          });
          return parts.join(',');
        };

        return popup;
      }])
    .service('SatellizerUtils', function() {
      this.camelCase = function(name) {
        return name.replace(/([\:\-\_]+(.))/g, function(_, separator, letter, offset) {
          return offset ? letter.toUpperCase() : letter;
        });
      };

      this.parseQueryString = function(keyValue) {
        var obj = {}, key, value;
        angular.forEach((keyValue || '').split('&'), function(keyValue) {
          if (keyValue) {
            value = keyValue.split('=');
            key = decodeURIComponent(value[0]);
            obj[key] = angular.isDefined(value[1]) ? decodeURIComponent(value[1]) : true;
          }
        });
        return obj;
      };

      this.joinUrl = function(baseUrl, url) {
        if (/^(?:[a-z]+:)?\/\//i.test(url)) {
          return url;
        }

        var joined = [baseUrl, url].join('/');

        var normalize = function(str) {
          return str
            .replace(/[\/]+/g, '/')
            .replace(/\/\?/g, '?')
            .replace(/\/\#/g, '#')
            .replace(/\:\//g, '://');
        };

        return normalize(joined);
      };
    })
    .factory('SatellizerStorage', ['$window', 'SatellizerConfig', function($window, config) {
      var browserSupportsLocalStorage = (function() {
        try {
          var supported = config.storageType in $window && $window[config.storageType] !== null;

          if (supported) {
            var key = Math.random().toString(36).substring(7);
            $window[config.storageType].setItem(key, '');
            $window[config.storageType].removeItem(key);
          }

          return supported;
        } catch (e) {
          return false;
        }
      })();

      if (!browserSupportsLocalStorage) {
        console.warn('Satellizer Warning: ' + config.storageType + ' is not available.');
      }

      return {
        get: function(key) {
          return browserSupportsLocalStorage ? $window[config.storageType].getItem(key) : undefined;
        },
        set: function(key, value) {
          return browserSupportsLocalStorage ? $window[config.storageType].setItem(key, value) : undefined;
        },
        remove: function(key) {
          return browserSupportsLocalStorage ? $window[config.storageType].removeItem(key): undefined;
        }
      };
    }])
    .factory('SatellizerInterceptor', [
      '$q',
      'SatellizerConfig',
      'SatellizerStorage',
      'SatellizerShared',
      function($q, config, storage, shared) {
        return {
          request: function(request) {
            if (request.skipAuthorization) {
              return request;
            }
             if (shared.isAuthenticated() && config.httpInterceptor) {
              var tokenName = config.tokenPrefix ? config.tokenPrefix + '_' + config.tokenName : config.tokenName;
              var token = storage.get(tokenName);

              if (config.authHeader && config.authToken) {
                token = config.authToken + ' ' + token;
              }

              request.headers[config.authHeader] = token;
            }

            return request;
          },
          responseError: function(response) {
            return $q.reject(response);
          }
        };
      }])
    .config(['$httpProvider', function($httpProvider) {
      $httpProvider.interceptors.push('SatellizerInterceptor');
    }]);

})(window, window.angular);
