angular.module('MyApp')
  .controller('LoginCtrl', function($scope, Auth) {
    $scope.login = function() {
      Auth.login({
        email: $scope.email,
        password: $scope.password
      });
    };
    $scope.loginOauth = function(provider) {
      Auth.loginOauth(provider);
    }
  });