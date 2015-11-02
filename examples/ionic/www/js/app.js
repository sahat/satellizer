angular.module('starter', ['ionic', 'satellizer', 'starter.controllers'])
  .config(function ($stateProvider, $urlRouterProvider, $authProvider) {
    $stateProvider
      .state('app', {
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
      })
      .state('app.home', {
        url: '/',
        views: {
          'menuContent': {
            templateUrl: 'templates/home.html',
            controller: 'HomeCtrl'
          }
        }
      });

    $urlRouterProvider.otherwise('/');

    if (ionic.Platform.isIOS() || ionic.Platform.isAndroid()) {
      $authProvider.cordova = true;
    }

    $authProvider.facebook({
      clientId: '100703896938969',
      redirectUri: 'http://localhost'
    });

    $authProvider.twitter({
      url: 'http://localhost:3000/auth/twitter',
      redirectUri: 'http://localhost'
    });

    $authProvider.google({
      clientId: '631036554609-v5hm2amv4pvico3asfi97f54sc51ji4o.apps.googleusercontent.com',
      url: 'http://localhost:3000/auth/google',
      redirectUri: 'http://localhost'
    });
  })
  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  });
