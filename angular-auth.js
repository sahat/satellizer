/**
 * ngAuth 0.0.1
 * (c) 2014 Sahat Yalkabov <sahat@me.com>
 * License: MIT
 */

angular.module('ngAuth', [])
  .provider('Auth', function() {
    var config = {
      logoutRedirect: '/',
      loginRedirect: '/',
      loginUrl: '/login',
      signupUrl: '/signup',
      providers: {
        facebook: {
          appId: null,
          scope: null,
          authorizationUrl: 'https://www.facebook.com/dialog/oauth',
          verificationUrl: 'https://graph.facebook.com/oauth/access_token'
        },
        google: {
          clientId: null,
          scope: null,
          authorizationUrl: 'https://accounts.google.com/o/oauth2/auth',
          verificationUrl: 'https://accounts.google.com/o/oauth2/token'
        }
      }
    };
    return {
      setLogoutRedirect: function(value) {
        config.logoutRedirect = value;
      },
      setLoginRedirect: function(value) {
        config.loginRedirect = value;
      },
      setLoginUrl: function(value) {
        config.loginUrl = value;
      },
      setSignupUrl: function(value) {
        config.signupUrl = value;
      },
      facebook: function(opts) {
        angular.extend(config.providers.facebook, opts);
      },
      google: function(opts) {
        angular.extend(config.providers.google, opts);
      },
      oauth2: function(name, opts) {

      },
//      configure: function(name, options) {
//        console.log(name, config.providers);
//
//        config.providers[name] = config.providers[name] || {};
//
//        angular.extend(config.providers[name], options);
//        console.log(config);
//      },
      $get: function($http, $location, $rootScope, $alert, $q, $window) {
        var token = $window.localStorage.token;

        if (token) {
          var payload = JSON.parse($window.atob(token.split('.')[1]));
          if (Date.now() > payload.exp) {
            $window.alert('Token has expired');
            delete $window.localStorage.token;
          } else {
            $rootScope.currentUser = payload.prn;
          }
        }

        return {
          oauth: function(provider, options) {
            var objectToQueryString = function(obj) {
              var str = [];
              angular.forEach(obj, function(value, key) {
                str.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
              });
              return str.join("&");
            };
          },
          login: function(user) {
            return $http.post(config.loginUrl, user).success(function(data) {
              $window.localStorage.token = data.token;
              var token = $window.localStorage.token;
              var payload = JSON.parse($window.atob(token.split('.')[1]));
              $rootScope.currentUser = payload.prn;
              $location.path(config.loginRedirect);
            });
          },
          signup: function(user) {
            return $http.post(config.signupUrl, user).success(function() {
              $location.path(config.loginUrl);
            });
          },
          logout: function() {
            delete $window.localStorage.token;
            $rootScope.currentUser = null;
            $location.path(config.logoutRedirect);
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
  });
