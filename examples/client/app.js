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
        controller: 'ProtectedCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

    AuthProvider.setFacebook({
      url: '/auth/facebook',
      appId: '624059410963642',
      scope: 'email,public_profile,user_friends'
    });

    AuthProvider.setGoogle({
      clientId: '621491837925521',
      scope: 'email'
    });

    AuthProvider.setOauth2('hackerSchool', {
      clientId: '621491837925521',
      scope: 'email'
    });

  });
