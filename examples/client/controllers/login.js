angular.module('MyApp')
  .controller('LoginCtrl', function($scope, $alert, $auth) {
    $scope.login = function() {
      $auth.login({ email: $scope.email, password: $scope.password })
        .catch(function(response) {
          $alert({
            title: 'Error!',
            content: response.data.message,
            animation: 'fadeZoomFadeDown',
            type: 'material',
            duration: 3
          });
        });
    };
    $scope.authenticate = function(provider) {
      $auth.authenticate(provider)
        .then(function() {
          console.log('authenticated!');
        })
        .catch(function(response) {
          console.log(response.data);
        });
    };
  });