/**
 * Satellizer 0.9.4
 * (c) 2015 Sahat Yalkabov
 * License: MIT
 */
(function(window, angular, undefined) {
  'use strict';

  angular.module('satellizer', [])
    .constant('satellizer.config', {
      httpInterceptor: true,
      loginOnSignup: true,
      loginRedirect: '/',
      logoutRedirect: '/',
      signupRedirect: '/login',
      loginUrl: '/auth/login',
      signupUrl: '/auth/signup',
      loginRoute: '/login',
      signupRoute: '/signup',
      tokenRoot: false,
      tokenName: 'token',
      tokenPrefix: 'satellizer',
      authHeader: 'Authorization',
      withCredentials: true,
      platform: 'browser'
    })
    .provider('$auth', ['satellizer.config', function(config) {
      Object.defineProperties(this, {
        httpInterceptor: {
          get: function() { return config.httpInterceptor; },
          set: function(value) { config.httpInterceptor = value; }
        },
        loginOnSignup: {
          get: function() { return config.loginOnSignup; },
          set: function(value) { config.loginOnSignup = value; }
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
        authHeader: {
          get: function() { return config.authHeader; },
          set: function(value) { config.authHeader = value; }
        },
        withCredentials: {
          get: function() { return config.withCredentials; },
          set: function(value) { config.withCredentials = value; }
        },
        platform: {
          get: function() { return config.platform; },
          set: function(value) { config.platform = value; }
        }
      });

      this.$get = [
        '$q',
        'satellizer.shared',
        'satellizer.local',
        function($q, shared, local) {
          var $auth = {};

          $auth.login = function(user, redirect) {
            return local.login(user, redirect);
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

          return $auth;
        }];

    }])
    .factory('satellizer.shared', [
      '$q',
      '$window',
      '$location',
      'satellizer.config',
      'satellizer.storage',
      function($q, $window, $location, config, storage) {
        var shared = {};
        var tokenName = config.tokenPrefix ? config.tokenPrefix + '_' + config.tokenName : config.tokenName;

        shared.getToken = function() {
          return storage.get(tokenName);
        };

        shared.getPayload = function() {
          var token = storage.get(tokenName);

          if (token && token.split('.').length === 3) {
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace('-', '+').replace('_', '/');
            return JSON.parse($window.atob(base64));
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
          }  else if (redirect && angular.isString(redirect)) {
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

        return shared;
      }])
    .factory('satellizer.local', [
      '$q',
      '$http',
      '$location',
      'satellizer.utils',
      'satellizer.shared',
      'satellizer.config',
      function($q, $http, $location, utils, shared, config) {
        var local = {};

        local.login = function(user, redirect) {
          return $http.post(config.loginUrl, user)
            .then(function(response) {
              shared.setToken(response, redirect);
              return response;
            });
        };

        local.signup = function(user) {
          return $http.post(config.signupUrl, user)
            .then(function(response) {
              if (config.loginOnSignup) {
                shared.setToken(response);
              } else if (config.signupRedirect) {
                $location.path(config.signupRedirect);
              }
              return response;
            });
        };

        return local;
      }])
    .service('satellizer.utils', function() {
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
    })
    .factory('satellizer.storage', function() {
      if (supportsLocalStorage()) {
        return {
          get: function(key) { return localStorage.getItem(key); },
          set: function(key, value) { return localStorage.setItem(key, value); },
          remove: function(key) { return localStorage.removeItem(key); }
        };
      } else {
        console.warn('Warning: Browser Local Storage is disabled or unavailable. Satellizer will not work correctly.');
        return {
          get: function(key) {},
          set: function(key, value) {},
          remove: function(key) {}
        };
      }

      function supportsLocalStorage() {
        try {
          return 'localStorage' in window && window['localStorage'] !== null;
        } catch(e){
          return false;
        }
      }
    })
    .factory('satellizer.interceptor', [
      '$q',
      'satellizer.config',
      'satellizer.storage',
      function($q, config, storage) {
        var tokenName = config.tokenPrefix ? config.tokenPrefix + '_' + config.tokenName : config.tokenName;
        return {
          request: function(httpConfig) {
            var token = storage.get(tokenName);
            if (token && config.httpInterceptor) {
              token = config.authHeader === 'Authorization' ? 'Bearer ' + token : token;
              httpConfig.headers[config.authHeader] = token;
            }
            return httpConfig;
          },
          responseError: function(response) {
            return $q.reject(response);
          }
        };
      }])
    .config(['$httpProvider', function($httpProvider) {
      $httpProvider.interceptors.push('satellizer.interceptor');
    }]);

})(window, window.angular);

// Base64.js Polyfill (@davidchambers)
(function() {
  var object = typeof exports != 'undefined' ? exports : this;
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

  function InvalidCharacterError(message) {
    this.message = message;
  }

  InvalidCharacterError.prototype = new Error;
  InvalidCharacterError.prototype.name = 'InvalidCharacterError';

  object.btoa || (
    object.btoa = function(input) {
      var str = String(input);
      for (var block, charCode, idx = 0, map = chars, output = ''; str.charAt(idx | 0) || (map = '=', idx % 1); output += map.charAt(63 & block >> 8 - idx % 1 * 8)) {
        charCode = str.charCodeAt(idx += 3 / 4);
        if (charCode > 0xFF) {
          throw new InvalidCharacterError("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
        }
        block = block << 8 | charCode;
      }
      return output;
    });

  object.atob || (
    object.atob = function(input) {
      var str = String(input).replace(/=+$/, '');
      if (str.length % 4 == 1) {
        throw new InvalidCharacterError("'atob' failed: The string to be decoded is not correctly encoded.");
      }
      for (var bc = 0, bs, buffer, idx = 0, output = ''; buffer = str.charAt(idx++); ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer, bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0) {
        buffer = chars.indexOf(buffer);
      }
      return output;
    });
}());
