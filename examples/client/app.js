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

    AuthProvider.configure({
      apiUrl: '/api',
      facebook: {
        clientId: '',
        redirectUri: '',
        scopes: []
      },
      hackerSchool: {
        clientId: '',
        redirectUri: '',
        scopes: [],
        verificationEndpoint: '',
        authorizationEndpoint: ''
      }
    });
  });
