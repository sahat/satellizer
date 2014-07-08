/**
 * ngAuth 0.0.1
 * (c) 2014 Sahat Yalkabov <sahat@me.com>
 * License: MIT
 */

angular.module('ngAuth', [])
  .provider('ngAuth', function() {
//    var config = {
//      apiUrl: '/api',
//      signOutUrl: '/auth/sign_out',
//      emailSignInPath: '/auth/sign_in',
//      emailRegistrationPath: '/auth',
//      confirmationSuccessUrl: window.location.href,
//      tokenValidationPath: '/auth/validate_token',
//      proxyIf: function() {
//        return false;
//      },
//      proxyUrl: '/proxy',
//      authProviderPaths: {
//        github: '/auth/github',
//        facebook: '/auth/facebook',
//        google: '/auth/google_oauth2'
//      }
//    };
    this.$get = ['$http', function($http) {
      return {
        hello: function() {
          console.log('Hello world');
        }
      };
    }];
  })
  .factory('Local', ['$http', '$location', '$rootScope', '$alert', '$window',
    function($http, $location, $rootScope, $alert, $window) {
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
        login: function(user) {
          return $http.post('/api/login', user).success(function(data) {
            $window.localStorage.token = data.token;
            var token = $window.localStorage.token;
            var payload = JSON.parse($window.atob(token.split('.')[1]));
            $rootScope.currentUser = payload.prn;
            $location.path('/');
          });
        },
        signup: function(user) {
          return $http.post('/api/signup', user).success(function() {
            $location.path('/login');
          });
        },
        logout: function() {
          delete $window.localStorage.token;
          $rootScope.currentUser = null;
          $location.path('/');
        }
      };
    }])
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
  .config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  }]);
