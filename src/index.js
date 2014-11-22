/**
 * Satellizer
 * (c) 2014 Sahat Yalkabov
 * License: MIT
 */

angular.module('satellizer', [])
  .config(['$httpProvider', '$authProvider', 'satellizer.config', function($httpProvider, $authProvider, config) {
    $httpProvider.interceptors.push(['$q', function($q) {
      var tokenName = config.tokenPrefix ? config.tokenPrefix + '_' + config.tokenName : config.tokenName;
      return {
        request: function(httpConfig) {
          var token = localStorage.getItem(tokenName);
          if (token) {
            token = config.authHeader === 'Authorization' ? 'Bearer ' + token : token;
            httpConfig.headers[config.authHeader] = token;
          }
          return httpConfig;
        },
        responseError: function(response) {
          return $q.reject(response);
        }
      };
    }]);
  }]);
