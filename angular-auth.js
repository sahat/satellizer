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
  .factory('authInterceptor', function($q, $window, $location) {
    return {
      request: function(config) {
        if ($window.localStorage.token) {
          config.headers.Authorization = 'Bearer ' + $window.localStorage.token;
        }
        return config;
      },
      responseError: function(response) {
        if (response.status === 401) {
          $location.path('/login');
        }
        return $q.reject(response);
      }
    }
  })
  .config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  }]);
