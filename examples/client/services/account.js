angular.module('MyApp')
  .factory('Account', ['$http', '$window', function($http, $window) {
    return {
      getUserInfo: function() {
        return $http.get('/api/me');
      }
    };
  }]);