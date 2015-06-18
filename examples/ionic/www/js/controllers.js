angular.module('starter.controllers', [])
  .controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  })
  .controller('HomeCtrl', function($scope, $ionicPopup, $auth) {

    $scope.authenticate = function(provider) {
      $auth.authenticate(provider)
        .then(function() {
          $ionicPopup.alert({
            title: 'Success',
            content: 'You have successfully logged in!'
          })
        })
        .catch(function(response) {
          $ionicPopup.alert({
            title: 'Error',
            content: response.data ? response.data || response.data.message : response
          })

        });
    };


    $scope.logout = function() {
      $auth.logout();
    };

    $scope.isAuthenticated = function() {
      return $auth.isAuthenticated();
    };
  });