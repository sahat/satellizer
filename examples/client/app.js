angular.module('MyApp', ['ngResource', 'ngMessages', 'ngRoute', 'Satellizer'])
  .config(function($routeProvider, $authProvider) {
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
      })
      .otherwise({
        redirectTo: '/'
      });

    $authProvider.setProvider({
      name: 'facebook',
      clientId: '657854390977827'
    });

    $authProvider.setProvider({
      name: 'google',
      clientId: '631036554609-v5hm2amv4pvico3asfi97f54sc51ji4o.apps.googleusercontent.com',
    });

    $authProvider.setProvider({
      name: 'linkedin',
      clientId: '77cw786yignpzj'
    });
  });