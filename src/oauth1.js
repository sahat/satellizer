angular.module('satellizer')
  .factory('satellizer.Oauth1', ['$q', '$http', 'satellizer.popup', function($q, $http, popup) {
    return function() {

      var defaults = {
        url: null,
        name: null,
        popupOptions: null
      };

      var oauth1 = {};

      oauth1.open = function(options, userData) {
        angular.extend(defaults, options);
        return popup.open(defaults.url, defaults.popupOptions)
          .then(function(response) {
            return oauth1.exchangeForToken(response, userData)
          });
      };

      oauth1.exchangeForToken = function(oauthData, userData) {
        var data = angular.extend({}, userData, oauthData);
        var qs = oauth1.buildQueryString(data);
        return $http.get(defaults.url + '?' + qs);
      };

      oauth1.buildQueryString = function(obj) {
        var str = [];
        angular.forEach(obj, function(value, key) {
          str.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
        });
        return str.join('&');
      };

      return oauth1;
    };
  }]);
