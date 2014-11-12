angular.module('satellizer')
  .factory('satellizer.local', [
    '$q',
    '$http',
    '$location',
    'satellizer.utils',
    'satellizer.shared',
    'satellizer.config',
    function($q, $http, $location, utils, shared, config) {
      var local = {};

      local.login = function(user) {
        return $http.post(config.loginUrl, user)
          .then(function(response) {
            shared.setToken(response);
            return response;
          });
      };

      local.signup = function(user) {
        return $http.post(config.signupUrl, user)
          .then(function(response) {
            if (config.loginOnSignup) {
              shared.setToken(response);
            } else {
              $location.path(config.signupRedirect);
            }
            return response;
          });
      };

      return local;
    }]);
