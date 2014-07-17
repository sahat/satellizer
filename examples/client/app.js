angular.module('MyApp', ['ngResource', 'ngMessages', 'ngRoute', 'ngAuth', 'mgcrea.ngStrap'])
  .config(function($routeProvider, AuthProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/signup', {
        templateUrl: 'views/signup.html',
        controller: 'SignupCtrl'
      })
      .when('/logout', {
        template: null,
        controller: 'LogoutCtrl'
      })
      .when('/protected', {
        templateUrl: 'views/protected.html',
        controller: 'ProtectedCtrl',
//        resolve: AuthProvider.isAuthenticated,
        authenticated: true
//        loginRequired: true
      })
      .otherwise({
        redirectTo: '/'
      });

    AuthProvider.setProvider('facebook', {
      url: '/auth/facebook',
      appId: '624059410963642',
//      scope: 'email,public_profile,user_friends'
      scope: ['email', 'public_profile', 'user_friends']
    });


  });
