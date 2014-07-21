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
        authenticated: true
      })
      .otherwise({
        redirectTo: '/'
      });

//    AuthProvider.setProvider('facebook', {
//      url: '/auth/facebook',
//      appId: '624059410963642',
//      scope: ['email', 'public_profile', 'user_friends']
//    });
//
//    AuthProvider.setProvider('google', {
//      url: '/auth/google',
//      clientId: '828110519058.apps.googleusercontent.com',
//      scope: ['https://www.googleapis.com/auth/plus.login']
//    });
//
//    AuthProvider.setProvider('linkedin', {
//      url: '/auth/linkedin',
//      clientId: 'JMBFUZQ6fajbxt92xDW8pw '
//    });


    AuthProvider.facebook({
      url: '/auth/facebook',
      appId: '624059410963642',
      scope: ['email', 'public_profile', 'user_friends']
    });

    AuthProvider.google({
      url: '/auth/google',
      clientId: '828110519058.apps.googleusercontent.com',
      scope: ['https://www.googleapis.com/auth/plus.login']
    });

    AuthProvider.linkedin({
      url: '/auth/linkedin',
      clientId: '75z17ew9n8c2pm'
    });

    AuthProvider.oauth2({
      name: 'hacker-school',
      url: '/auth/hacker-school'
      appId: null
    });

    console.log(AuthProvider.facebook)

  });
