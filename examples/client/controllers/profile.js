angular.module('MyApp')
  .controller('ProfileCtrl', function($scope, $auth, $alert, Account) {

    /**
     * Get user's profile information.
     */
    $scope.getProfile = function() {
      Account.getProfile()
        .success(function(data) {
          $scope.user = data;
        })
        .error(function(error) {
          $alert({
            content: error.message,
            animation: 'fadeZoomFadeDown',
            type: 'material',
            duration: 3
          });
        });
    };


    /**
     * Update user's profile information.
     */
    $scope.updateProfile = function() {
      Account.updateProfile({
        displayName: $scope.user.displayName,
        email: $scope.user.email
      }).then(function() {
        $alert({
          content: 'Profile has been updated',
          animation: 'fadeZoomFadeDown',
          type: 'material',
          duration: 3
        });
      });
    };

    $scope.getProfile();
  });