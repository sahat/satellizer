angular.module('MyApp')
  .controller('LogoutCtrl', ['Local', function(Local) {
    Local.logout();
  }]);