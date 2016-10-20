angular.module('MyApp')
  .controller('SignupCtrl', function($scope, $location, $auth, toastr, appAuth) {

    if ($scope.user.isAdmin === true) {
      $scope.signup = function() {
        $auth.signup($scope.user)
          .then(function(response) {
            appAuth.isAdminAuthorized = true;
            $auth.setToken(response);
            $location.path('/');
            toastr.info('You have successfully created a new account and have been signed-in');
          })
          .catch(function(response) {
            toastr.error(response.data.message);
          });
      };
    } else {
      $scope.signup = function() {
        $auth.signup($scope.user)
          .then(function(response) {
            appAuth.isUserAuthorized = true;
            $auth.setToken(response);
            $location.path('/');
            toastr.info('You have successfully created a new account and have been signed-in');
          })
          .catch(function(response) {
            toastr.error(response.data.message);
          });
      };
    }


  });
