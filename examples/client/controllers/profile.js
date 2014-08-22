angular.module('MyApp')
  .controller('ProfileCtrl', function($scope, $auth) {
    $scope.link = function(provider) {
      $auth.link(provider);
    };

    $scope.unlink = function(provider) {
      $auth.unlink(provider);
    };
  });