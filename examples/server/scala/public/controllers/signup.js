angular.module('MyApp')
  .controller('SignupCtrl', function($scope, $auth) {
    $scope.signup = function() {
      $auth.signup({
        displayName: $scope.displayName,
        email: $scope.email,
        password: $scope.password
      });
    };
  });