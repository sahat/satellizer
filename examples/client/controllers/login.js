angular.module('MyApp')
  .controller('LoginCtrl', ['$scope', 'Local', function($scope, Local) {
    $scope.login = function() {
      Local.login({
        email: $scope.email,
        password: $scope.password
      });
    };
  }]);