angular.module('satellizer')
  .factory('satellizer.oauth', [
    '$q',
    '$http',
    'satellizer.config',
    'satellizer.shared',
    'satellizer.Oauth1',
    'satellizer.Oauth2',
    function($q, $http, config, shared, Oauth1, Oauth2) {
      var oauth = {};

      oauth.authenticate = function(name, isLinking, userData, immediate) {
        var provider = config.providers[name].type === '1.0' ? new Oauth1() : new Oauth2();

        return provider.open(config.providers[name], userData || {}, immediate)
          .then(function(response) {
            shared.setToken(response, isLinking);
            return response;
          });

      };

      oauth.unlink = function(provider) {
        return $http.get(config.unlinkUrl + provider);
      };

      return oauth;
    }]);
