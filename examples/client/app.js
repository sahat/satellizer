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


    AuthProvider.setProvider({
      name: 'facebook',
      clientId: '624059410963642'
    });

    AuthProvider.setProvider({
      name: 'google',
      clientId: '836215426053-98eofc7oss4p4oaeahdi2q5c3ocvnp8s.apps.googleusercontent.com',
    });

    AuthProvider.setProvider({
      name: 'linkedin',
      clientId: '77cw786yignpzj'
    });

//    AuthProvider.providers['facebook'] = {
//      clientId: '624059410963642'
//    };

//    AuthProvider.providers['hackerschool'] = {
//      clientId: '04d6956da17b5401c49ce46fd86091d212d9fb8c1282bedd4922156d90670099',
//      authorizationUrl: 'https://www.hackerschool.com/oauth/authorize'
//    };
//
//    AuthProvider.providers['facebook'] = {
//      clientId: '624059410963642'
//    };
//
//
//    AuthProvider.setProvider('linkedin', {
//      url: '/auth/linkedin',
//      clientId: 'JMBFUZQ6fajbxt92xDW8pw '
//    });
//
//
//    AuthProvider.google({
//      url: '/auth/google',
//      clientId: '828110519058.apps.googleusercontent.com',
//      scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/plus.me']
//    });
//
//    AuthProvider.linkedin({
//      url: '/auth/linkedin',
//      clientId: '75z17ew9n8c2pm'
//    });
//
//    AuthProvider.oauth2({
//      name: 'hacker-school',
//      url: '/auth/hacker-school',
//      appId: null
//    });


  });
