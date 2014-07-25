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
          url: '/auth/facebook',
          appId: null,
          scope: null,
          responseType: 'token',
          locale: 'en_US',
          version: 'v2.0'
        },
        google: {
          clientId: null,
          scope: null,
          getRedirectUri: null,
          responseType: 'token'
        },
        linkedin: {
          url: '/auth/linkedin',
          clientId: null,
          scope: null,
          getRedirectUri: null,
          responseType: 'token'
        }
      }
    };

    function loadLinkedinSdk() {
      (function() {
        var e = document.createElement('script');
        e.type = 'text/javascript';
        e.src = 'https://platform.linkedin.com/in.js?async=true';
        e.onload = function() {
          IN.init({
            api_key: '75z17ew9n8c2pm',
            authorize: true,
            credentials_cookie: true
          });
        };
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(e, s);
      })();
    }

    function loadFacebookSdk($document, $window) {
      if (!$document[0].getElementById('fb-root')) {
        $document.find('body').append('<div id="fb-root"></div>');
      }

      $window.fbAsyncInit = function() {
        FB.init(config.providers.facebook);
      };

      (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {
          return;
        }
        js = d.createElement(s);
        js.id = id;
        js.src = "//connect.facebook.net/" + config.providers.facebook.locale + "/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
    }

    function loadGooglePlusSdk() {
      (function() {
        var po = document.createElement('script');
        po.type = 'text/javascript';
        po.async = true;
        po.src = 'https://apis.google.com/js/client:plusone.js';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(po, s);
      })();
    }

    return {
      addProvider: function(params) {
        console.log(params.name)
        config.providers[params.name] = config.providers[params.name] || {};
        angular.extend(config.providers[params.name], params);
      },

      facebook: function(params) {
        angular.extend(config.providers.facebook, params);
      },

      google: function(params) {
        angular.extend(config.providers.google, params);
      },

      linkedin: function(params) {
        angular.extend(config.providers.linkedin, params);
      },

      $get: function(OAuth2, fb, $http, $location, $rootScope, $alert, $q, $injector, $window, $document, $cookieStore) {

        var token = $window.localStorage.token;
        if (token) {
          var payload = JSON.parse($window.atob(token.split('.')[1]));
          $rootScope[config.userGlobal] = payload.user;
        }

        if (config.providers.linkedin.clientId) {
          loadLinkedinSdk();
        }

        if (config.providers.facebook.appId) {
          loadFacebookSdk($document, $window);
        }

        if (config.providers.google.clientId) {
          loadGooglePlusSdk();
        }

        return {
          authenticate: function(provider, options) {
            var deferred = $q.defer;
            if (!provider) {
              throw new Error('Expected a provider named \'' + provider + '\', did you forget to add it?');
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
  .factory('OAuth2', function($window, $location, $http, $q, $rootScope, $timeout) {
    var oauthKeys = ['code', 'access_token', 'expires_in'];

    var config = {
      name: null,
      baseUrl: null,
      apiKey: null,
      scope: null,
      clientId: null,
      responseType: 'code'
    };

    var Popup = {
      // Open a popup window. Returns a promise that resolves or rejects
      // accoring to if the popup is redirected with arguments in the URL.
      //
      // For example, an OAuth2 request:
      //
      // popup.open('http://some-oauth.com', ['code']).then(function(data){
      //   // resolves with data.code, as from http://app.com?code=13124
      // });
      //

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
      response_type: config.responseType,
      client_id: config.clientId,
      redirect_uri: getRedirectUri()
    };

    return {
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

        var base = config.baseUrl;
        var params = angular.extend(defaultRequiredUrlParams, optionalUrlParams);
        var qs = this.buildQueryString(params);
        return [base, qs].join('?');
      },

      open: function() {
        var name = config.name;
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

    }
  })
  .factory('fb', function(OAuth2) {
    var options = {
      name: 'facebook-oauth2',
      baseUrl: 'https://www.facebook.com/dialog/oauth',
      scope: 'scope, email',
      requiredUrlParams: { display: 'popup' }
    };

    return angular.extend(OAuth2, options);
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
