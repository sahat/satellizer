angular.module('satellizer')
  .factory('satellizer.interceptor', [
    '$q',
    '$authProvider',
    'satellizer.config',
    function($q, $authProvider, config) {
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
