angular.module('satellizer')
  .factory('satellizer.shared', [
    '$q',
    '$window',
    '$location',
    'satellizer.config',
    function($q, $window, $location, config) {
      var shared = {};

      shared.getToken = function() {
        var tokenName = config.tokenPrefix ? config.tokenPrefix + '_' + config.tokenName : config.tokenName;
        return $window.localStorage[tokenName];
      };

      shared.getPayload = function() {
        var tokenName = config.tokenPrefix ? config.tokenPrefix + '_' + config.tokenName : config.tokenName;
        var token = $window.localStorage[tokenName];

        if (token && token.split('.').length === 3) {
          var base64Url = token.split('.')[1];
          var base64 = base64Url.replace('-', '+').replace('_', '/');
          return JSON.parse($window.atob(base64));
        }
      };

      shared.setToken = function(response, isLinking) {
        var token = response.access_token || response.data[config.tokenName];
        var tokenName = config.tokenPrefix ? config.tokenPrefix + '_' + config.tokenName : config.tokenName;

        if (!token) {
          throw new Error('Expecting a token named "' + config.tokenName + '" but instead got: ' + JSON.stringify(response.data));
        }

        $window.localStorage[tokenName] = token;

        if (config.loginRedirect && !isLinking) {
          $location.path(config.loginRedirect);
        }
      };

      shared.isAuthenticated = function() {
        var tokenName = config.tokenPrefix ? config.tokenPrefix + '_' + config.tokenName : config.tokenName;
        var token = $window.localStorage[tokenName];

        if (token) {
          if (token.split('.').length === 3) {
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace('-', '+').replace('_', '/');
            var exp = JSON.parse($window.atob(base64)).exp;
            return Math.round(new Date().getTime() / 1000) <= exp;
          } else {
            return true;
          }
        }

        return false;
      };

      shared.logout = function() {
        var tokenName = config.tokenPrefix ? config.tokenPrefix + '_' + config.tokenName : config.tokenName;
        delete $window.localStorage[tokenName];

        if (config.logoutRedirect) {
          $location.path(config.logoutRedirect);
        }
        return $q.when();
      };

      return shared;
    }]);
