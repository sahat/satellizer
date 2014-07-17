/**
 * ngAuth 0.0.1
 * (c) 2014 Sahat Yalkabov <sahat@me.com>
 * License: MIT
 */

// TODO: Enable CORS, separate server from client, Gulp server runner
// TODO: Provider return object, underscore private functions < 10loc

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
          appId: null,
          scope: null,
          responseType: 'token',
          locale: 'en_US',
          version: 'v2.0'
        },
        google: {
          clientId: null,
          scope: null,
          redirectUri: null,
          responseType: 'token',
          authorizationEndpoint: 'https://accounts.google.com/o/oauth2/auth',
          verificationEndpoint: 'https://accounts.google.com/o/oauth2/token'
        }
      }
    };

    this.isAuthenticated = function($q, $location) {
      var deferred = $q.defer();
      if (!$rootScope.currentUser) {
        $location.path('/login')
      }
      deferred.resolve();
      return deferred.promise();
    };

    this.setProvider = function(provider, params) {
      angular.extend(config.providers[provider], params);
    };

    this.$get = function($http, $location, $rootScope, $alert, $q, $injector, $window, $document) {

      // Local
      var token = $window.localStorage.token;

      if (token) {
        var payload = JSON.parse($window.atob(token.split('.')[1]));
        if (Date.now() > payload.exp) {
          $window.alert('Token has expired');
          delete $window.localStorage.token;
        } else {
          $rootScope.currentUser = payload.user;

          console.log($rootScope.currentUser)
        }
      }

      // Initialzie Facebook
      if (config.providers.facebook.appId) {
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

      // Google
      if (config.providers.google.clientId) {

      }


      return {
        loginOauth: function(provider) {
          provider = provider.trim().toLowerCase();

          switch (provider) {
            case 'facebook':
              FB.login(function(response) {
                FB.api('/me', function(profile) {

                  var info = {
                    signedRequest: response.authResponse.signedRequest,
                    profile: profile
                  };

                  $http.post(config.providers.facebook.url, info).success(function(token) {
                    var payload = JSON.parse($window.atob(token.split('.')[1]));
                    $window.localStorage.token = token;
                    $rootScope.currentUser = payload.user;
                    $location.path(config.loginRedirect);
                  });

                });
              }, { scope: config.providers.facebook.scope });
              break;
            case 'google':
              console.log('google signin');
              break;
            default:
              break;
          }
        },
        login: function(user) {
          return $http.post(config.loginUrl, user).success(function(data) {
            $window.localStorage.token = data.token;
            var token = $window.localStorage.token;
            var payload = JSON.parse($window.atob(token.split('.')[1]));
            $rootScope.currentUser = payload.user;
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
        }
      };
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
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
      if (next.authenticated && !$rootScope.currentUser) {
        $location.path('/login');
      }
    });
  });
