angular.module('MyApp')
  .controller('LogoutCtrl', function($auth, toastr) {
    if (!$auth.isAuthenticated()) { return; }
    $auth.logout()
      .then(function() {
        toastr.info('You have been logged out');
      });
  });