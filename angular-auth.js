/**
 * ngAuth 0.0.1
 * (c) 2014 Sahat Yalkabov <sahat@me.com>
 * License: MIT
 */

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
          authorizationUrl: 'https://www.facebook.com/dialog/oauth',
          scope: 'scope, email',
          requiredUrlParams: {display: 'popup'}
        },
        google: {
          authorizationUrl: 'https://accounts.google.com/o/oauth2/auth',
          scope: ''
        },
        linkedin: {
          authorizationUrl: 'https://www.linkedin.com/uas/oauth2/authorization',
          state: 'STATE'
        }
      }
    };

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
          var deferred = $q.defer();
          // TODO: refactor
          var optionsString = stringifyOptions(prepareOptions(options || {}));
          this.popup = $window.open(url, '*', optionsString);
          this.popup.focus();

          this.createPostMessageHandler(deferred);
          this.pollPopup(deferred);

          return deferred.promise;
        };

        Popup.prototype.pollPopup = function(deferred) {
          var self = this;
          var intervalHandler = function() {
            if (self.popup.closed) {
              $interval.cancel(self.polling);
              deferred.reject('Popup was closed by the user.');
            }
            self.requestAuthorizationCode();
          };
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

        // TODO: getRedirectUri vs redirect_uri using location.href
        var getRedirectUri = function() {
          return $window.location.origin;
        };


        var oauthKeys = ['code', 'access_token', 'expires_in'];

        var OAuth2 = function() {
          this.name = null;
          this.clientId = null;
          this.scope = null;
          this.authorizationUrl = null;
          this.responseType = 'code';
        };

        OAuth2.prototype.getDefaultRequiredUrlParams = function() {
          return {
            response_type: this.responseType,
            client_id: this.clientId,
            redirect_uri: getRedirectUri()
          }
        };

        OAuth2.prototype.buildQueryString = function(obj) {
          var str = [];
          angular.forEach(obj, function(value, key) {
            str.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
          });
          return str.join('&');
        };

        OAuth2.prototype.open = function() {
          var name = this.name;
          var url = this.buildUrl();
          var redirectUri = $window.location.href;
          // TODO cleanup from memory
          var popup = new Popup();
          return popup.open(url, oauthKeys).then(function(authData) {
            return {
              authorizationCode: authData.code,
              provider: name,
              getRedirectUri: redirectUri
            }
          });
        };

        OAuth2.prototype.buildUrl = function(optionalUrlParams) {
          var defaultRequiredUrlParams = this.getDefaultRequiredUrlParams();
          if (this.requiredUrlParams) {
            angular.extend(defaultRequiredUrlParams, this.requiredUrlParams);
          }
          var base = this.authorizationUrl;
          var params = angular.extend(defaultRequiredUrlParams, optionalUrlParams);
          var qs = this.buildQueryString(params);
          return [base, qs].join('?');
        };


        OAuth2.createProvider = function(providerName) {
          var providerOptions = config.providers[providerName];
          var oauth2 = new OAuth2();
          var provider = angular.extend(oauth2, providerOptions);
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
            var deferred = $q.defer;
            if (!providerName) {
              deferred.reject('Expected a provider named \'' + providerName + '\', did you forget to add it?');
              return deferred.promise;
            }
            var provider = OAuth2.createProvider(providerName);
            return provider.open(options);
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
                gapi.auth.authorize({
                  client_id: config.providers.google.clientId,
                  scope: config.providers.google.scope,
                  immediate: false
                }, function(token) {
                  gapi.client.load('plus', 'v1', function() {
                    var request = gapi.client.plus.people.get({
                      userId: 'me'
                    });
                    request.execute(function(response) {
                      var data = {
                        accessToken: token.access_token,
                        profile: response
                      };
                      $http.post(config.providers.google.url, data).success(function(token) {
                        var payload = JSON.parse($window.atob(token.split('.')[1]));
                        $window.localStorage.token = token;
                        $rootScope.currentUser = payload.user;
                        $location.path(config.loginRedirect);
                      });
                    });
                  });
                });
                break;
              case 'linkedin':
                IN.UI.Authorize().place();
                IN.Event.on(IN, 'auth', function() {
                    IN.API.Profile('me').result(function(result) {
                      var profile = result.values[0];
                      $http.post(config.providers.linkedin.url, {profile: profile}).success(function(token) {
                        var payload = JSON.parse($window.atob(token.split('.')[1]));
                        $window.localStorage.token = token;
                        $rootScope.currentUser = payload.user;
                        $location.path(config.loginRedirect);
                      });
                    });
                  }
                );
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