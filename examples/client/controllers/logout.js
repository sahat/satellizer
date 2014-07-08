angular.module('MyApp')
  .controller('LogoutCtrl', ['Auth', function(Auth) {
    Auth.logout();
  }]);