angular.module('MyApp')
  .controller('LogoutCtrl', function($auth) {
    $auth.logout();
  });