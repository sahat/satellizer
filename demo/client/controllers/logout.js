angular.module('MyApp')
  .controller('LogoutCtrl', function(Auth) {
    Auth.logout();
  });