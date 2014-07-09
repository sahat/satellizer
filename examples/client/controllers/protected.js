angular.module('MyApp')
  .controller('ProtectedCtrl', function($scope, Auth, Account) {
    Account.getUserInfo().success(function(data) {
      $scope.userInfo = data;
    });
  });