angular.module('MyApp')
  .controller('SignupCtrl', function($scope, $auth) {
    $scope.signup = function() {
      $auth.signup({
        email: $scope.email,
        password: $scope.password
      });
    };
  });