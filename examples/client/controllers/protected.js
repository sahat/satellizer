angular.module('MyApp')
  .controller('ProtectedCtrl', ['$scope', 'Local', 'Account', function($scope, Local, Account) {
    Account.getUserInfo().success(function(data) {
      $scope.userInfo = data;
    });
  }]);