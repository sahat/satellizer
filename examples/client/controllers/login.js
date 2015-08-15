angular.module('MyApp')
  .controller('LoginCtrl', function($scope, toastr, $auth) {
    $scope.login = function() {
      $auth.login($scope.user)
        .then(function() {
          toastr.success('You have successfully signed in');
        })
        .catch(function(response) {
          toastr.error(response.data.message, response.status);
        });
    };
    $scope.authenticate = function(provider) {
      $auth.authenticate(provider)
        .then(function() {
          toastr.success('You have successfully signed in with ' + provider);
        })
        .catch(function(response) {
          toastr.error(response.data.message);
        });
    };
  });