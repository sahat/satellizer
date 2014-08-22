angular.module('MyApp')
  .controller('ProfileCtrl', function($scope, Account) {
    Account.getUserInfo().success(function(data) {
      $scope.userInfo = data;
    });
  });