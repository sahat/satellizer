angular.module('MyApp')
  .controller('ProtectedCtrl', function($scope, Account) {
    Account.getUserInfo().success(function(data) {
      $scope.userInfo = data;
    });
  });