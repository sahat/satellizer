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
      clientId: '624059410963642'
    });

    $authProvider.google({
      clientId: '836215426053-98eofc7oss4p4oaeahdi2q5c3ocvnp8s.apps.googleusercontent.com'
    });

    $authProvider.github({
      clientId: '45ab07066fb6a805ed74'
    });

    $authProvider.linkedin({
      clientId: '77yh0fkkk1gwue'
    });

    $authProvider.twitter({
      url: '/auth/twitter'
    });

    $authProvider.oauth2({
      name: 'foursquare',
      url: '/auth/foursquare',
      clientId: '52HQZ5C02PUSLPGSPVWBU43AGIA4QPUGQFRTEWKZFAWLTZ0X',
      redirectUri: window.location.origin,
      authorizationEndpoint: 'https://foursquare.com/oauth2/authenticate'
    });
  });