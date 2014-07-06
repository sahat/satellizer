angular.module('MyApp')
  .controller('ProtectedCtrl', ['$scope', 'Auth', 'Account', function($scope, Auth, Account) {
    Account.getUserInfo().success(function(user) {
      $scope.userInfo = user;
    });
  }]);