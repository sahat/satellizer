/**
 * ngAuth 0.0.1
 * (c) 2014 Sahat Yalkabov <sahat@me.com>
 * License: MIT
 */

(function(window, angular, undefined) {
  angular.module('ngAuth', [])
    .provider('ngAuth', function() {
      var config = {
        apiUrl: '/api',
        signOutUrl: '/auth/sign_out',
        emailSignInPath: '/auth/sign_in',
        emailRegistrationPath: '/auth',
        confirmationSuccessUrl: window.location.href,
        tokenValidationPath: '/auth/validate_token',
        proxyIf: function() {
          return false;
        },
        proxyUrl: '/proxy',
        authProviderPaths: {
          github: '/auth/github',
          facebook: '/auth/facebook',
          google: '/auth/google_oauth2'
        }
      };

      this.$get = ['$http', function($http) {

        return {};
      }];

    });
})(window, window.angular);
