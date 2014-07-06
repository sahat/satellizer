angular.module('MyApp')
  .factory('Auth', ['$http', '$location', '$rootScope', '$alert', '$window',
    function($http, $location, $rootScope, $alert, $window) {
      var token = $window.localStorage.token;

      if (token) {
        var payload = JSON.parse($window.atob(token.split('.')[1]));
        if (Date.now() > payload.exp) {
          $window.alert('Token has expired');
          delete $window.localStorage.token;
        } else {
          $rootScope.currentUser = payload.prn;
        }
      }

      return {
        login: function(user) {
          return $http.post('/api/login', user).success(function(data) {
            $window.localStorage.token = data.token;
            var token = $window.localStorage.token;
            var payload = JSON.parse($window.atob(token.split('.')[1]));
            $rootScope.currentUser = payload.prn;
            $location.path('/');
          });
        },
        signup: function(user) {
          return $http.post('/api/signup', user).success(function() {
            $location.path('/login');
          });
        },
        logout: function() {
          delete $window.localStorage.token;
          $rootScope.currentUser = null;
          $location.path('/');
        }
      };
    }]);