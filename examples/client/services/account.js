angular.module('MyApp')
  .factory('Account', function($http, $auth) {
    return {
      updateProfile: function(profileData) {
        return $http.put('/api/me', profileData).then(function(response) {
          $auth.updateToken(response.data.token);
        });
      }
    };
  });