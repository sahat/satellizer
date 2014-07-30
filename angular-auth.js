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
        userGlobal: 'currentUser',
        providers: {
          facebook: {
            url: '/auth/facebook',
            authorizationEndpoint: 'https://www.facebook.com/dialog/oauth',
            redirectUri: 'http://localhost:3000',
            scope: 'email',
            requiredUrlParams: ['display'],
            display: 'popup'
          },
          google: {
            url: '/auth/google',
            authorizationEndpoint: 'https://accounts.google.com/o/oauth2/auth',
            redirectUri: 'http://localhost:3000',
            scope: 'openid profile email',
            requiredUrlParams: ['scope'],
            optionalUrlParams: ['display', 'state'],
            display: 'popup',
            state: 'STATE'
          },
          linkedin: {
            authorizationEndpoint: 'https://www.linkedin.com/uas/oauth2/authorization',
            redirectUri: 'http://localhost:3000',
            requiredUrlParams: ['state'],
            state: 'STATE'
          }
        }
      };


      // TODO: defineProperty setter on scope
      // TODO: $state = md5(rand());
      // TODO: Use requiredUrlParams instead of passing all properties
      // TODO: pass scope delimiter
      // TODO: default responseType to code if token is obtained on server

      return {
        setProvider: function(params) {
          config.providers[params.name] = config.providers[params.name] || {};
          angular.extend(config.providers[params.name], params);
        },

        $get: function($interval, $timeout, $http, $location, $rootScope, $alert, $q, $injector, $window) {

          // BEGIN OAUTH


          // Popup window.
          var Popup = function() {
            this.popup = null;
          };

          Popup.prototype.open = function(url, keys, options) {
            console.log(url)
            var deferred = $q.defer();
            // TODO: refactor
            // todo wildcard star
            var optionsString = stringifyOptions(prepareOptions(options || {}));
            this.popup = $window.open(url, '*', optionsString);
            this.popup.focus();

            this.createPostMessageHandler(deferred);
            this.pollPopup(deferred);

            return deferred.promise;
          };

          Popup.prototype.pollPopup = function(deferred) {
            var intervalHandler = function() {
              if (this.popup.closed) {
                $interval.cancel(this.polling);
                deferred.reject('Popup was closed by the user.');
              }
              this.requestAuthorizationCode();
            }.bind(this);
            this.polling = $interval(intervalHandler, 35);
          };

          Popup.prototype.requestAuthorizationCode = function() {
            var query = this.popup.location.search.substring(1);
            if (query.indexOf('code') > -1) {
              var code = this.parseQueryString(query).code;
              $window.postMessage(code, $window.location.origin);
              $interval.cancel(this.polling);
              this.popup.close();
            }
          };

          Popup.prototype.createPostMessageHandler = function(deferred) {
            $window.addEventListener('message', function(event) {
              deferred.resolve(event.data);
            }, false);
          };

          Popup.prototype.parseQueryString = function(keyValue) {
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
              left: ((screen.width / 2) - (width / 2)),
              top: ((screen.height / 2) - (height / 2)),
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





          var Oauth2 = function(config) {
            //if (this instanceof CustomObject)

            this.name = config.name;
            this.clientId = config.clientId;
            this.scope = config.scope;
            this.authorizationEndpoint = config.authorizationEndpoint;
            this.redirectUri = config.redirectUri;
            this.responseType = 'code';
            this.defaultUrlParams = ['response_type', 'client_id', 'redirect_uri'];
            this.requiredUrlParams = config.requiredUrlParams;
            this.optionalUrlParams = config.optionalUrlParams;
          };

          Oauth2.prototype.camelCase = function(name) {
            return name.replace(/([\:\-\_]+(.))/g, function(_, separator, letter, offset) {
              return offset ? letter.toUpperCase() : letter;
            });
          };

          Oauth2.prototype.open = function() {
            var deferred = $q.defer();
            var url = this.buildUrl();
            var popup = new Popup();

            popup.open(url).then(function(code) {
              this.exchangeForToken(code).then(function(response) {
                deferred.resolve(response.data);
              });
            }.bind(this));

            return deferred.promise;
          };

          Oauth2.prototype.exchangeForToken = function(code) {
            var params = {
              clientId: config.providers[this.name].clientId,
              redirectUri: $window.location.origin + '/',
              code: code
            };

            return $http.post('/auth/facebook', params);
          };

          Oauth2.prototype.buildUrl = function() {
            var baseUrl = this.authorizationEndpoint;
            var qs = this.buildQueryString();
            return [baseUrl, qs].join('?');
          };

          Oauth2.prototype.buildQueryString = function() {
            var obj = this;
            var keyValuePairs = [];

            angular.forEach(this.defaultUrlParams, function(paramName) {
              var camelizedName = obj.camelCase(paramName);
              var paramValue = obj[camelizedName];
              keyValuePairs.push([paramName, paramValue]);
            });

            angular.forEach(this.requiredUrlParams, function(paramName) {
              var camelizedName = obj.camelCase(paramName);
              var paramValue = obj[camelizedName];
              keyValuePairs.push([paramName, paramValue]);
            });

            angular.forEach(this.optionalUrlParams, function(paramName) {
              var camelizedName = obj.camelCase(paramName);
              var paramValue = obj[camelizedName];
              keyValuePairs.push([paramName, paramValue]);
            });

            console.log(keyValuePairs)
            return keyValuePairs.map(function(pair) {
              return pair.join('=');
            }).join('&');
          };


          Oauth2.createProvider = function(providerName) {
            var providerOptions = config.providers[providerName];
            var provider = new Oauth2(providerOptions);
            return provider;
          };


          // END OAUTH

          var token = $window.localStorage.token;
          if (token) {
            var payload = JSON.parse($window.atob(token.split('.')[1]));
            $rootScope[config.userGlobal] = payload.user;
          }

          return {
            authenticate: function(providerName, options) {
              if (!providerName) {
                return $q.reject('Expected a provider named \'' + providerName + '\', did you forget to add it?');
              }

              var provider = Oauth2.createProvider(providerName);

              var deferred = $q.defer();

              provider.open(options).then(function(data) {
                console.log('OPENED')
                deferred.resolve(data);
              });

              return deferred.promise;
            },

            loginOauth: function(provider) {
              provider = provider.trim().toLowerCase();

              switch (provider) {
                case 'facebook':
                  var scope = config.providers.facebook.scope.join(',');
                  FB.login(function(response) {
                    FB.api('/me', function(profile) {
                      // TODO normalize return properties like passport
                      var data = {
                        accessToken: response.authResponse.accessToken,
                        signedRequest: response.authResponse.signedRequest,
                        profile: profile
                      };
                      $http.post(config.providers.facebook.url, data).success(function(token) {
                        var payload = JSON.parse($window.atob(token.split('.')[1]));
                        $window.localStorage.token = token;
                        $rootScope[config.userGlobal] = payload.user;
                        $location.path(config.loginRedirect);
                      });
                    });
                  }, {scope: scope});
                  break;
                case 'google':

                  break;
                case 'linkedin':
                  break;
                default:
                  break;
              }
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
              $rootScope[config.userGlobal] = null;
              $location.path(config.logoutRedirect);
            },
            isAuthenticated: function() {
              return $rootScope[config.userGlobal];
            }
          };
        }
      };
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
    .run(function($rootScope, $location) {
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

