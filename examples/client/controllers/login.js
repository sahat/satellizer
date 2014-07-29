angular.module('MyApp')
  .controller('LoginCtrl', function($scope, Auth) {


    $scope.login = function() {
      Auth.login({
        email: $scope.email,
        password: $scope.password
      });
    };
    $scope.loginOauth = function(provider) {

      Auth.authenticate(provider)
        .then(function(){
          console.log('authenticated!');
        })
    }
  });