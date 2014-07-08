angular.module('MyApp')
  .controller('SignupCtrl', ['$scope', 'Local', function($scope, Local) {
    $scope.signup = function() {
      Local.signup({
        email: $scope.email,
        password: $scope.password
      });
    };
  }]);