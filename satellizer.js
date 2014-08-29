/**
 * Satellizer
 * (c) 2014 Sahat Yalkabov <sahat@me.com>
 * License: MIT
 */

(function(window, angular, undefined) {
  'use strict';

  angular.module('satellizer', [])
    .constant('satellizer.config', {
      logoutRedirect: '/',
      loginRedirect: '/',
      signupRedirect: '/login',
      loginUrl: '/auth/login',
      signupUrl: '/auth/signup',
      loginRoute: '/login',
      signupRoute: '/signup',
      tokenName: 'token',
      tokenPrefix: 'satellizer',
      unlinkUrl: '/auth/unlink/',
      providers: {
        google: {
          url: '/auth/google',
          authorizationEndpoint: 'https://accounts.google.com/o/oauth2/auth',
          redirectUri: window.location.origin,
          scope: 'openid profile email',
          scopeDelimiter: ' ',
          requiredUrlParams: ['scope'],
          optionalUrlParams: ['display'],
          display: 'popup',
          type: '2.0',
          popupOptions: {
            width: 452,
            height: 633
          }
        },
        facebook: {
          url: '/auth/facebook',
          authorizationEndpoint: 'https://www.facebook.com/dialog/oauth',
          redirectUri: window.location.origin + '/',
          scope: 'email',
          scopeDelimiter: ',',
          requiredUrlParams: ['display', 'scope'],
          display: 'popup',
          type: '2.0',
          popupOptions: {
            width: 481,
            height: 269
          }
        },
        linkedin: {
          url: '/auth/linkedin',
          authorizationEndpoint: 'https://www.linkedin.com/uas/oauth2/authorization',
          redirectUri: window.location.origin,
          requiredUrlParams: ['state'],
          scope: [],
          scopeDelimiter: ' ',
          state: 'STATE',
          type: '2.0',
          popupOptions: {
            width: 527,
            height: 582
          }
        },
        github: {
          name: 'github',
          url: '/auth/github',
          authorizationEndpoint: 'https://github.com/login/oauth/authorize',
          redirectUri: window.location.origin,
          scope: [],
          scopeDelimiter: ' ',
          type: '2.0',
          popupOptions: {
            width: 1020,
            height: 618
          }
        },
        twitter: {
          url: '/auth/twitter',
          type: '1.0'
        }
      }
    })
    .provider('$auth', ['satellizer.config', function(config) {
      Object.defineProperties(this, {
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
        }
      });

      this.facebook = function(params) {
        angular.extend(config.providers.facebook, params);
      };

      this.google = function(params) {
        angular.extend(config.providers.google, params);
      };

      this.linkedin = function(params) {
        angular.extend(config.providers.linkedin, params);
      };

      this.github = function(params) {
        angular.extend(config.providers.github, params);
      };

      this.twitter = function(params) {
        angular.extend(config.providers.twitter, params);
      };

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
        'satellizer.shared',
        'satellizer.local',
        'satellizer.oauth',
        function($q, shared, local, oauth) {
          var $auth = {};

          $auth.authenticate = function(name) {
            return oauth.authenticate(name);
          };

          $auth.login = function(user) {
            return local.login(user);
          };

          $auth.signup = function(user) {
            return local.signup(user);
          };

          $auth.logout = function() {
            return shared.logout();
          };

          $auth.isAuthenticated = function() {
            return shared.isAuthenticated();
          };

          $auth.link = function(name) {
            return $auth.authenticate(name);
          };

          $auth.unlink = function(provider) {
            return oauth.unlink(provider);
          };

          // TODO: call from parseUser
          $auth.updateToken = function(token) {
            localStorage.setItem([config.tokenPrefix, config.tokenName].join('_'), token);
          };

          return $auth;
        }];

    }])
    .factory('satellizer.shared', [
      '$window',
      '$location',
      'satellizer.config',
      function($window, $location, config) {
        var shared = {};

        shared.parseUser = function(token, deferred) {
          var namespace = [config.tokenPrefix, config.tokenName].join('_');
          $window.localStorage[namespace] = token;
//          $rootScope.isAuthenticated = true;
          if (config.loginRedirect) {
            $location.path(config.loginRedirect);
          }
          deferred.resolve();
        };


        shared.isAuthenticated = function() {
          var token = [config.tokenPrefix, config.tokenName].join('_');
          return Boolean($window.localStorage[token]);
        };

        shared.logout = function() {
          var deferred = $q.defer();
          var token = [config.tokenPrefix, config.tokenName].join('_');
          delete $window.localStorage[token];
          deferred.resolve();

          // todo location.path null, empty, undef
          if (config.logoutRedirect) {
            $location.path(config.logoutRedirect);
          }

          return deferred.promise;
        };

        shared.unlink = function(provider) {
          var deferred = $q.defer();

          $http.get(config.unlinkUrl + provider)
            .then(function(response) {
              shared.parseUser(response.data[config.tokenName], deferred);
            })
            .catch(function(response) {
              deferred.reject(response);
            });

          return deferred.promise;
        };

        return shared;
      }])
    .factory('satellizer.oauth', [
      '$q',
      'satellizer.config',
      'satellizer.shared',
      'satellizer.Oauth1',
      'satellizer.Oauth2',
      function($q, config, shared, Oauth1, Oauth2) {
        var oauth = {};

        oauth.authenticate = function(name) {
          var deferred = $q.defer();
          var provider = config.providers[name].type === '1.0' ? new Oauth1() : new Oauth2();
          provider.open(config.providers[name])
            .then(function(response) {
              shared.parseUser(response.data[config.tokenName], deferred);
            })
            .catch(function(response) {
              deferred.reject(response);
            });
          return deferred.promise;
        };

        return oauth;
      }])
    .factory('satellizer.local', [
      '$q',
      '$http',
      '$location',
      '$rootScope',
      'satellizer.utils',
      'satellizer.shared',
      'satellizer.config',
      function($q, $http, $location, $rootScope, utils, shared, config) {
        var local = {};

        local.login = function(user) {
          var deferred = $q.defer();

          $http.post(config.loginUrl, user)
            .then(function(response) {
              shared.parseUser(response.data[config.tokenName], deferred);
            })
            .catch(function(response) {
              deferred.reject(response);
            });

          return deferred.promise;
        };

        local.signup = function(user) {
          var deferred = $q.defer();

          $http.post(config.signupUrl, user)
            .then(function() {
              $location.path(config.signupRedirect);
              deferred.resolve();
            })
            .catch(function(response) {
              deferred.reject(response);
            });

          return deferred.promise;
        };

        return local;
      }])
    .factory('satellizer.Oauth2', [
      '$q',
      '$http',
      'satellizer.popup',
      'satellizer.utils',
      function($q, $http, popup, utils) {
        return function() {
          var defaults = {
            url: null,
            name: null,
            scope: null,
            scopeDelimiter: null,
            clientId: null,
            redirectUri: null,
            popupOptions: null,
            authorizationEndpoint: null,
            requiredUrlParams: null,
            optionalUrlParams: null,
            defaultUrlParams: ['response_type', 'client_id', 'redirect_uri'],
            responseType: 'code'
          };

          // TODO: setup scope delimiter and document it in readme

          function open(options) {
            angular.extend(defaults, options);
            var deferred = $q.defer();
            var url = buildUrl();

            popup.open(url, defaults.popupOptions)
              .then(function(oauthData) {
                exchangeForToken(oauthData)
                  .then(function(response) {
                    deferred.resolve(response);
                  })
                  .catch(function(response) {
                    deferred.reject(response);
                  });
              })
              .catch(function(error) {
                deferred.reject(error);
              });

            return deferred.promise;
          }

          function exchangeForToken(oauthData) {
            return $http.post(defaults.url, {
              code: oauthData.code,
              clientId: defaults.clientId,
              redirectUri: defaults.redirectUri
            });
          }

          function buildUrl() {
            var baseUrl = defaults.authorizationEndpoint;
            var qs = buildQueryString();
            return [baseUrl, qs].join('?');
          }

          function buildQueryString() {
            var keyValuePairs = [];
            var urlParams = ['defaultUrlParams', 'requiredUrlParams', 'optionalUrlParams'];

            angular.forEach(urlParams, function(params) {
              angular.forEach(defaults[params], function(paramName) {
                var camelizedName = utils.camelCase(paramName);
                var paramValue = defaults[camelizedName];
                keyValuePairs.push([paramName, encodeURIComponent(paramValue)]);
              });
            });

            return keyValuePairs.map(function(pair) {
              return pair.join('=');
            }).join('&');
          }

          return {
            open: open,
            exchangeForToken: exchangeForToken,
            buildUrl: buildUrl,
            buildQueryString: buildQueryString
          };
        };
      }])
    .factory('satellizer.Oauth1', ['$q', '$http', 'satellizer.popup', function($q, $http, popup) {
      return function() {
        var defaults = {
          url: null,
          name: null,
          popupOptions: null
        };

        function open(options) {
          angular.extend(defaults, options);

          var deferred = $q.defer();

          popup.open(defaults.url)
            .then(function(response) {
              exchangeForToken(response)
                .then(function(response) {
                  deferred.resolve(response);
                })
                .catch(function(response) {
                  deferred.reject(response);
                });
            })
            .catch(function(response) {
              deferred.reject(response);
            });

          return deferred.promise;
        }

        function exchangeForToken(oauthData) {
          oauthData = buildQueryString(oauthData);
          return $http.get(defaults.url + '?' + oauthData);
        }

        function buildQueryString(obj) {
          var str = [];
          angular.forEach(obj, function(value, key) {
            str.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
          });
          return str.join('&');
        }

        return {
          open: open,
          exchangeForToken: exchangeForToken,
          buildQueryString: buildQueryString
        };
      };
    }])
    .factory('satellizer.popup', ['$q', '$interval', '$window', function($q, $interval, $window) {
      var popupWindow = null;
      var polling = null;

      var popup = {};

      popup.popupWindow = popupWindow;

      popup.open = function(url, options) {

        var deferred = $q.defer();
        var optionsString = popup.stringifyOptions(popup.prepareOptions(options || {}));

        popupWindow = $window.open(url, '_blank', optionsString);
        popupWindow.focus();

        popup.postMessageHandler(deferred);
        popup.pollPopup(deferred);

        return deferred.promise;
      };

      popup.pollPopup = function(deferred) {
        polling = $interval(function() {
          if (popupWindow.closed) {
            $interval.cancel(polling);
            deferred.reject({ data: 'Authorization Failed' });
          }
        }, 35);
      };

      popup.postMessageHandler = function(deferred) {
        $window.addEventListener('message', function(event) {
          if (event.origin === $window.location.origin) {
            popupWindow.close();
            if (event.data.error) {
              deferred.reject({ data: event.data.error });
            } else {
              deferred.resolve(event.data);
            }
          }
        }, false);
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
    .service('satellizer.utils', function() {
      this.camelCase = function(name) {
        return name.replace(/([\:\-\_]+(.))/g, function(_, separator, letter, offset) {
          return offset ? letter.toUpperCase() : letter;
        });
      };

      this.parseQueryString = function(keyValue) {
        var obj = { }, key, value;
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
    .config(['$httpProvider', 'satellizer.config', function($httpProvider, config) {
      $httpProvider.interceptors.push(['$q', function($q) {
        return {
          request: function(httpConfig) {
            if (localStorage.getItem([config.tokenPrefix, config.tokenName].join('_'))) {
              httpConfig.headers.Authorization = 'Bearer ' + localStorage.getItem([config.tokenPrefix, config.tokenName].join('_'));
            }
            return httpConfig;
          },
          responseError: function(response) {
            if (response.status === 401) {
              localStorage.removeItem([config.tokenPrefix, config.tokenName].join('_'));
            }
            return $q.reject(response);
          }
        };
      }]);
    }])
    .run(['$rootScope', '$window', '$location', 'satellizer.utils', 'satellizer.config',
      function($rootScope, $window, $location, utils, config) {
        var token = localStorage.getItem([config.tokenPrefix, config.tokenName].join('_'));

        if (token) {
          $rootScope.isAuthenticated = true;
        }

        var params = $window.location.search.substring(1);
        var qs = Object.keys($location.search()).length ? $location.search() : utils.parseQueryString(params);

        if ($window.opener && $window.opener.location.origin === $window.location.origin) {
          if (qs.oauth_token && qs.oauth_verifier) {
            $window.opener.postMessage({ oauth_token: qs.oauth_token, oauth_verifier: qs.oauth_verifier }, $window.location.origin);
          } else if (qs.code) {
            $window.opener.postMessage({ code: qs.code }, $window.location.origin);
          } else if (qs.error) {
            $window.opener.postMessage({ error: qs.error }, $window.location.origin);
          }
        }

        /////////////////
        /////////////////

        // ngRoute
//        try {
//          angular.module('ngRoute');
//          $rootScope.$on('$routeChangeStart', function(event, current) {
//            if ($rootScope.isAuthenticated &&
//              (current.originalPath === config.loginRoute || current.originalPath === config.signupRoute)) {
//              $location.path(config.loginRedirect);
//            }
//
//            if (current.protected && !$rootScope.isAuthenticated) {
//              $location.path(config.loginRoute);
//            }
//          });
//        } catch (error) {
//
//        }
//
//        // UI-Router
//        try {
//          angular.module('ui.router');
//          $rootScope.$on('$stateChangeStart', function(event, toState) {
//            if ($rootScope.isAuthenticated &&
//              (toState.url === config.loginRoute || toState.url === config.signupRoute)) {
//              $location.path(config.loginRedirect);
//            }
//            if (toState.protected && !$rootScope.isAuthenticated) {
//              $location.path(config.loginRoute);
//            }
//          });
//        } catch (error) {
//
//        }
      }]);

})(window, window.angular);

