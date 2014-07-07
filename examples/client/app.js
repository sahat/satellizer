// TODO: remove querystring from $http.get since i use interceptors to modify headers
// TODO: redirect to /login before loading the protected

angular.module('MyApp', ['ngResource', 'ngMessages', 'ngRoute', 'mgcrea.ngStrap'])
  .config(['$routeProvider', function($routeProvider) {
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
  }])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push(function($rootScope, $q, $window, $location) {
      return {
        request: function(config) {
          if ($window.localStorage.token) {
            config.headers.Authorization = 'Bearer ' + $window.localStorage.token;
          }
          return config;
        },
        responseError: function(response) {
          if (response.status === 401) {
            $location.path('/login');
          }
          return $q.reject(response);
        }
      };
    });
  });