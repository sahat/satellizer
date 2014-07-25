/**
 * ngAuth 0.0.1
 * (c) 2014 Sahat Yalkabov <sahat@me.com>
 * License: MIT
 */

// TODO: Enable CORS, separate server from client, Gulp server runner
// TODO: Provider return object, underscore private functions < 10loc
// TODO: Modular, enable/disable facebook or twitter or local auth

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
          baseUrl: 'https://www.facebook.com/dialog/oauth',
          scope: 'scope, email',
          requiredUrlParams: { display: 'popup' }
        }
      }
    };

    function providerLookup(provider) {
      var options = config.providers[provider];
      return angular.extend(OAuth2, options);
    }

    return {
      setProvider: function(params) {
        config.providers[params.name] = config.providers[params.name] || {};
        angular.extend(config.providers[params.name], params);
      },


      $get: function($timeout, $http, $location, $rootScope, $alert, $q, $injector, $window, $document, $cookieStore) {

        // BEGIN OAUTH
        var oauthKeys = ['code', 'access_token', 'expires_in'];

        var oauthConfig = {
          name: null,
          baseUrl: null,
          apiKey: null,
          scope: null,
          clientId: null,
          responseType: 'code'
        };

        var Popup = {
          open: function(url, keys, options) {
            var service = this;
            var lastPopup = this.popup;
            var deferred = $q.defer();

            if (lastPopup) {
              service.close();
            }

            var optionsString = stringifyOptions(prepareOptions(options || {}));
            service.popup = window.open(url, 'ng-auth ;))', optionsString);

            if (service.popup && !service.popup.closed) {
              service.popup.focus();
            } else {
              deferred.reject('Popup could not open or was closed');
            }

            service.schedulePolling();
          },

          close: function() {
            if (this.popup) {
              this.popup.close();
              this.popup = null;
              $rootScope.$emit('didClose');
            }
          },

          pollPopup: function() {
            if (!this.popup) {
              return;
            }
            if (this.popup.closed) {
              $rootScope.$emit('didClose');
            }
          },

          schedulePolling: function() {
            this.polling = $timeout(function() {
              this.pollPopup();
              this.schedulePolling();
            }, 35);
          },

          stopPolling: function() {
            $rootScope.$on('didClose', function() {
              $timeout.cancel(this.polling);
            });
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

        var getRedirectUri = function() {
          return $window.location.href;
        };

        var defaultRequiredUrlParams = {
          response_type: oauthConfig.responseType,
          client_id: oauthConfig.clientId,
          redirect_uri: getRedirectUri()
        };

        var OAuth2 = {
          buildQueryString: function(obj) {
            var str = [];
            angular.forEach(obj, function(value, key) {
              str.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
            });
            return str.join('&');
          },

          buildUrl: function(optionalUrlParams) {
            if (this.requiredUrlParams) {
              angular.extend(defaultRequiredUrlParams, this.requiredUrlParams);
            }

            var base = oauthConfig.baseUrl;
            var params = angular.extend(defaultRequiredUrlParams, optionalUrlParams);
            var qs = this.buildQueryString(params);
            return [base, qs].join('?');
          },

          open: function() {
            var name = oauthConfig.name;
            var url = this.buildUrl();
            var redirectUri = $window.location.href;

            return Popup.open(url, oauthKeys).then(function(authData) {
              return {
                authorizationCode: authData.code,
                provider: name,
                getRedirectUri: redirectUri
              }
            });
          }

        };

        // END OAUTH




        var token = $window.localStorage.token;
        if (token) {
          var payload = JSON.parse($window.atob(token.split('.')[1]));
          $rootScope[config.userGlobal] = payload.user;
        }

        return {
          authenticate: function(provider, options) {
            var deferred = $q.defer;
            if (!provider) {
              throw new Error('Expected a provider named \'' + provider + '\', did you forget to add it?');
            } else {
              provider = providerLookup(provider);
              // angular.extend(OAuth2, options);
            }

            deferred.resolve(provider.open(options));
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
                }, { scope: scope });
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
                      $http.post(config.providers.linkedin.url, { profile: profile }).success(function(token) {
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
