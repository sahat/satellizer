angular.module('MyApp')
  .factory('Account', function($http) {
    return {
      getUserInfo: function() {
        return $http.get('/api/me');
      }
    };
  });