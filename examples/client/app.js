angular.module('MyApp', ['ngResource', 'ngMessages', 'ngRoute', 'Satellizer', 'mgcrea.ngStrap'])
  .config(function($routeProvider, $authProvider) {
    $routeProvider
      .when('/', {
        templateUrl: '../views/home.html'
      })
      .when('/login', {
        templateUrl: '../views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/signup', {
        templateUrl: '../views/signup.html',
        controller: 'SignupCtrl'
      })
      .when('/logout', {
        template: null,
        controller: 'LogoutCtrl'
      })
      .when('/profile', {
        templateUrl: '../views/profile.html',
        controller: 'ProfileCtrl',
        protected: true

      })
      .otherwise({
        redirectTo: '/'
      });

    $authProvider.facebook({
      clientId: '657854390977827'
    });

    $authProvider.google({
      clientId: '631036554609-v5hm2amv4pvico3asfi97f54sc51ji4o.apps.googleusercontent.com'
    });

    $authProvider.github({
      clientId: '0ba2600b1dbdb756688b'
    });

    $authProvider.linkedin({
      clientId: '77cw786yignpzj'
    });

    $authProvider.twitter({
      url: '/auth/twitter'
    });

    $authProvider.oauth2({
      name: 'foursquare',
      url: '/auth/foursquare',
      clientId: 'MTCEJ3NGW2PNNB31WOSBFDSAD4MTHYVAZ1UKIULXZ2CVFC2K',
      redirectUri: window.location.origin,
      authorizationEndpoint: 'https://foursquare.com/oauth2/authenticate'
    });
  });
