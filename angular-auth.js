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
          baseUrl: 'https://www.facebook.com/dialog/oauth',
          scope: 'scope, email',
          requiredUrlParams: { display: 'popup' }
        }
      }
    };

    return {
      setProvider: function(params) {
        config.providers[params.name] = config.providers[params.name] || {};
        angular.extend(config.providers[params.name], params);
      },

      $get: function($interval, $timeout, $http, $location, $rootScope, $alert, $q, $injector, $window, $document, $cookieStore) {

        // BEGIN OAUTH


        function parseKeyValue(keyValue) {
          var obj = {}, key_value, key;
          angular.forEach((keyValue || "").split('&'), function(keyValue) {
            if (keyValue) {
              key_value = keyValue.split('=');
              key = decodeURIComponent(key_value[0]);
              obj[key] = angular.isDefined(key_value[1]) ? decodeURIComponent(key_value[1]) : true;
            }
          });
          return obj;
        }


        var Popup = function() {
          this.popup = null;
        };

        Popup.prototype.open = function(url, keys, options) {
          var deferred = $q.defer();
          var lastPopup = this.popup;

          if (lastPopup) {
            this.close();
          }

          var optionsString = stringifyOptions(prepareOptions(options || {}));
          this.popup = window.open(url, 'ng-auth', optionsString);

          if (this.popup && !this.popup.closed) {
            this.popup.focus();
          } else {
            deferred.reject('Popup could not open or was closed');
          }

          $window.addEventListener('message', function(event) {
            console.log('handling postMessage');
            console.log(event);
            if (event.data.message === 'deliverCredenrials') {
              delete event.data.message;
            }
            deferred.resolve(event.data);
          }, false);

          var self = this;

          this.polling = $interval(function() {
            self.requestCredentials(self.popup);
          }, 35);

          return deferred.promise;
        };

        Popup.prototype.close = function() {
          if (this.popup) {
            this.popup.close();
            this.popup = null;
            $rootScope.$emit('didClose');
          }
        };

        Popup.prototype.pollPopup = function() {
          console.log('pollin');
          if (!this.popup) {
            return;
          }
          if (this.popup.closed) {
            $timeout.cancel(this.polling);
          }
        };

        Popup.prototype.requestCredentials = function(authWindow) {
          var search = authWindow.location.search;
          if (search.match('code') || search.match('token')) {
            console.log('found code or token');
            var data = parseKeyValue(authWindow.location.search.substring(1));
            $window.postMessage(data, $window.location.origin);
            $interval.cancel(this.polling);
            // angular lifecycle before page loads
            authWindow.close();
          }
          console.log('requesting creds!!')

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


        var oauthKeys = ['code', 'access_token', 'expires_in'];

        var OAuth2 = function() {
          this.name = null;
          this.clientId = null;
          this.scope = null;
          this.baseUrl = null;
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
          var base = this.baseUrl;
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
