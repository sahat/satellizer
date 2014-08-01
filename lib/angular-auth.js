/**
 * ngAuth 0.0.1
 * (c) 2014 Sahat Yalkabov <sahat@me.com>
 * License: MIT
 */

(function(window, angular, undefined) {
  'use strict';

  angular.module('ngAuth', [])
    .provider('Auth', function() {
      var config = this.config = {
        logoutRedirect: '/',
        loginRedirect: '/',
        loginUrl: '/auth/login',
        signupUrl: '/auth/signup',
        signupRedirect: '/login',
        providers: {
          facebook: {
            url: '/auth/facebook',
            authorizationEndpoint: 'https://www.facebook.com/dialog/oauth',
            redirectUri: window.location.origin,
            scope: 'email',
            requiredUrlParams: ['display'],
            display: 'popup',
            protocol: 'OAuth2',
            popupOptions: {
              width: 481,
              height: 269
            }
          },
          google: {
            url: '/auth/google',
            authorizationEndpoint: 'https://accounts.google.com/o/oauth2/auth',
            redirectUri: window.location.origin,
            scope: 'openid profile email',
            requiredUrlParams: ['scope'],
            optionalUrlParams: ['display'],
            display: 'popup',
            protocol: 'OAuth2'
          },
          linkedin: {
            url: '/auth/linkedin',
            authorizationEndpoint: 'https://www.linkedin.com/uas/oauth2/authorization',
            redirectUri: window.location.origin,
            requiredUrlParams: ['state'],
            state: 'STATE',
            protocol: 'OAuth2'
          },
          twitter: {
            url: '/auth/twitter',
            protocol: 'OAuth1'
          }
        }
      };
      // TODO: defineProperty setter on scope
      // TODO: $state = md5(rand());

      return {
        setProvider: function(params) {
          config.providers[params.name] = config.providers[params.name] || { };
          angular.extend(config.providers[params.name], params);
        },
        $get: function($interval, $timeout, $http, $location, $rootScope, $alert, $q, $injector, $window) {



          // BEGIN OAUTH


          // Popup window.
          var Popup = function(protocol) {
            this.popup = null;
            this.protocol = protocol;
          };

          Popup.prototype.open = function(url, options) {
            var deferred = $q.defer();
            // TODO: refactor
            // todo wildcard star
            var optionsString = stringifyOptions(prepareOptions(options || { }));
            this.popup = $window.open(url, 'ngAuth', optionsString);
            this.popup.focus();

            this.createPostMessageHandler(deferred);
            this.pollPopup(deferred);

            return deferred.promise;
          };

          Popup.prototype.pollPopup = function(deferred) {
            var self = this;
            this.polling = $interval(function() {
              if (self.popup.closed) {
                $interval.cancel(self.polling);
                deferred.reject('Popup was closed by the user.');
              }
            }, 35);
          };

          Popup.prototype.createPostMessageHandler = function(deferred) {
            $window.addEventListener('message', function(event) {
              if (event.origin === $window.location.origin) {
                var query = this.parseQueryString(event.data);
                deferred.resolve(query);
              }
            }.bind(this), false);
          };

          Popup.prototype.parseQueryString = function(keyValue) {
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

          Popup.prototype.close = function() {
            if (this.popup) {
              this.popup.close();
              this.popup = null;
            }
          };

          function prepareOptions(options) {
            var width = options.width || 500;
            var height = options.height || 500;
            return angular.extend({
              left: ((window.screen.width / 2) - (width / 2)),
              top: ((window.screen.height / 2) - (height / 2)),
              width: width,
              height: height
            }, options);
          }

          function stringifyOptions(options) {
            var optionsStrings = [];
            for (var key in options) {
              if (options.hasOwnProperty(key)) {
                var value;
                switch (options[key]) {
                  case true:
                    value = '1';
                    break;
                  case false:
                    value = '0';
                    break;
                  default:
                    value = options[key];
                }
                optionsStrings.push(
                  key + '=' + value
                );
              }
            }
            return optionsStrings.join(',');
          }

          /**
           * OAuth 1.0
           */
          var OAuth1 = function(config) {
            angular.extend(this, config);
            this.name = config.name;
            this.url = config.url;
          };

          OAuth1.prototype.open = function() {
            var deferred = $q.defer();

            var popup = new Popup();
            popup.open(this.url).then(function(authData) {
              deferred.resolve(authData.token);
            });

            return deferred.promise;
          };

          // TODO: send initiation GET to /auth/twitter
          // TODO: get oauth_token from POST /request_token
          // TODO: send it back to the client
          // TODO: open popup api.twitter.com/oauth/authenticate?oauth_token=XXX
          // TODO: twitter redirects to http://localhost:3000/auth/twitter with oauth_token and oauth_verifier
          // TODO: check if oauth_token matches new oauth_token
          // TODO: POST oauth/access_token
          // TODO: redirect back to localhost:3000 in popup at some point


          /**
           * OAuth 2.0
           */
          var OAuth2 = function(config) {
            angular.extend(this, config);
            this.name = config.name;
            this.clientId = config.clientId;
            this.scope = config.scope;
            this.authorizationEndpoint = config.authorizationEndpoint;
            this.redirectUri = config.redirectUri;
            this.responseType = 'code';
            this.defaultUrlParams = ['response_type', 'client_id', 'redirect_uri'];
            this.requiredUrlParams = config.requiredUrlParams;
            this.optionalUrlParams = config.optionalUrlParams;
            this.popupOptions = config.popupOptions;
          };

          OAuth2.prototype._camelCase = function(name) {
            return name.replace(/([\:\-\_]+(.))/g, function(_, separator, letter, offset) {
              return offset ? letter.toUpperCase() : letter;
            });
          };

          OAuth2.prototype.open = function() {
            var deferred = $q.defer();
            var url = this._buildUrl();
            var popup = new Popup();

            popup.open(url, this.popupOptions).then(function(authData) {
              this._exchangeForJwtToken(authData.code).then(function(response) {
                deferred.resolve(response.data);
              });
            }.bind(this));

            return deferred.promise;
          };

          OAuth2.prototype._exchangeForJwtToken = function(code) {
            var params = {
              code: code,
              clientId: config.providers[this.name].clientId,
              redirectUri: config.providers[this.name].redirectUri
            };

            console.log(params);

            return $http.post(this.url, params);
          };

          OAuth2.prototype._buildUrl = function() {
            var baseUrl = this.authorizationEndpoint;
            var qs = this._buildQueryString();
            return [baseUrl, qs].join('?');
          };

          OAuth2.prototype._buildQueryString = function() {
            var obj = this;
            var keyValuePairs = [];

            angular.forEach(this.defaultUrlParams, function(paramName) {
              var camelizedName = obj._camelCase(paramName);
              var paramValue = obj[camelizedName];
              keyValuePairs.push([paramName, encodeURIComponent(paramValue)]);
            });

            angular.forEach(this.requiredUrlParams, function(paramName) {
              var camelizedName = obj._camelCase(paramName);
              var paramValue = obj[camelizedName];
              keyValuePairs.push([paramName, encodeURIComponent(paramValue)]);
            });

            angular.forEach(this.optionalUrlParams, function(paramName) {
              var camelizedName = obj._camelCase(paramName);
              var paramValue = obj[camelizedName];
              keyValuePairs.push([paramName, encodeURIComponent(paramValue)]);
            });

            // TODO: avoid duplicates
            return keyValuePairs.map(function(pair) {
              return pair.join('=');
            }).join('&');
          };


          // END OAUTH


          return {
            authenticate: function(providerName, options) {
              var provider;

              if (!providerName) {
                return $q.reject('Expected a provider named \'' + providerName + '\', did you forget to add it?');
              }

              if (config.providers[providerName].protocol === 'OAuth1') {
                provider = new OAuth1(config.providers[providerName]);
              } else {
                provider = new OAuth2(config.providers[providerName]);
              }

              var deferred = $q.defer();

              provider.open(options).then(function(token) {
                var payload = JSON.parse($window.atob(token.split('.')[1]));
                $window.localStorage.token = token;
                $rootScope.currentUser = payload.user;
                $location.path(config.loginRedirect);
                deferred.resolve();
              });

              return deferred.promise;
            },

            login: function(user) {
              return $http.post(config.loginUrl, user).success(function(data) {
                $window.localStorage.token = data.token;
                var payload = JSON.parse($window.atob(data.token.split('.')[1]));
                $rootScope[config.userGlobal] = payload.user;
                $location.path(config.loginRedirect);
              });
            },
            signup: function(user) {
              return $http.post(config.signupUrl, user).success(function() {
                $location.path(config.signupRedirect);
              });
            },
            logout: function() {
              delete $window.localStorage.token;
              $rootScope.currentUser = null;
              $location.path(config.logoutRedirect);
            },
            isAuthenticated: function() {
              return Boolean($rootScope.currentUser);
            }
          };
        }
      }

    })
    .factory('authInterceptor', function($q, $window, $location) {
      return {
        request: function(config) {
          if ($window.localStorage.token) {
            config.headers.Authorization = 'Bearer ' + $window.localStorage.token;
          }
          return config;
        },
        responseError: function(response) {
          if (response.status === 401 || response.status === 403) {
            $location.path('/login');
          }
          return $q.reject(response);
        }
      }
    })
    .config(function($httpProvider) {
      $httpProvider.interceptors.push('authInterceptor');
    })
    .run(function($rootScope, $window, $location) {
      console.log('token')
      var token = $window.localStorage.token;
      if (token) {
        var payload = JSON.parse($window.atob(token.split('.')[1]));
        $rootScope.currentUser = payload.user;
      }

      var query = $window.location.search.substring(1);
      if ($window.opener && (query.indexOf('code') > -1 || query.indexOf('token') > -1)) {
        $window.opener.postMessage(query, '*');
        $window.close();
      }

      $rootScope.$on('$routeChangeStart', function(event, current, previous) {
        if ($rootScope.currentUser &&
          (current.originalPath === '/login' || current.originalPath === '/signup')) {
          $location.path('/');
        }
        if (current.authenticated && !$rootScope.currentUser) {
          $location.path('/login');
        }
      });
    });
})(window, window.angular);

