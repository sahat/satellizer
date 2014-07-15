/**
 * ngAuth 0.0.1
 * (c) 2014 Sahat Yalkabov <sahat@me.com>
 * License: MIT
 */

angular.module('ngAuth', [])
  .provider('Auth', function() {
    var config = {
      logoutRedirect: '/',
      loginRedirect: '/',
      loginUrl: '/auth/login',
      signupUrl: '/auth/signup',
      providers: {
        facebook: {
          appId: null,
          scope: null,
          redirectUri: null,
          responseType: 'token',
          locale: 'en_US',
          version: 'v2.0',
          status: true,
          xfbml: true,
          authorizationEndpoint: 'https://www.facebook.com/dialog/oauth',
          verificationEndpoint: 'https://graph.facebook.com/oauth/access_token'
        },
        google: {
          clientId: null,
          scope: null,
          redirectUri: null,
          responseType: 'token',
          authorizationEndpoint: 'https://accounts.google.com/o/oauth2/auth',
          verificationEndpoint: 'https://accounts.google.com/o/oauth2/token'
        }
      }
    };

    this.setLogoutRedirect = function(value) {
      config.logoutRedirect = value;
    };

    this.setLoginRedirect = function(value) {
      config.loginRedirect = value;
    };

    this.setLoginUrl = function(value) {
      config.loginUrl = value;
    };

    this.setSignupUrl = function(value) {
      config.signupUrl = value;
    };

    this.setFacebook = function(opts) {
      angular.extend(config.providers.facebook, opts);
    };

    this.setGoogle = function(opts) {
      angular.extend(config.providers.google, opts);
    };

    this.setOauth2 = function(name, opts) {
      config.providers[name] = config.providers[name] || {};
      angular.extend(config.providers[name], opts);
    };

    this.$get = function($http, $location, $rootScope, $alert, $q, $injector, $window, $document) {

      // Facebook
      if (config.providers.facebook.appId) {
        $window.fbAsyncInit = function() {
          FB.init({
            appId: config.providers.facebook.appId,
            status: config.providers.facebook.status,
            xfbml: config.providers.facebook.xfbml,
            version: config.providers.facebook.version
          });
        };

        (function(d, s, id) {
          var js, fjs = d.getElementsByTagName(s)[0];
          if (d.getElementById(id)) {
            return;
          }
          js = d.createElement(s);
          js.id = id;
          js.src = "//connect.facebook.net/" + config.providers.facebook.locale + "/sdk.js";
          fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
      }

      // Google
      if (config.providers.google.clientId) {

      }

      // Local
      var token = $window.localStorage.token;
      var accessToken = $window.localStorage.accessToken;

      if (token) {
        var payload = JSON.parse($window.atob(token.split('.')[1]));
        if (Date.now() > payload.exp) {
          $window.alert('Token has expired');
          delete $window.localStorage.token;
        } else {
          $rootScope.currentUser = payload.prn;
        }
      } else if (accessToken) {
        $rootScope.currentUser = accessToken;

      }

      return {
        authenticate: function(provider) {
          provider = provider.trim().toLowerCase();

          switch (provider) {
            case 'facebook':
              FB.login(function() {
                $window.localStorage.accessToken = FB.getAccessToken();
                $rootScope.currentUser = FB.getUserID();
                $location.path(config.loginRedirect);
              }, { scope: config.providers.facebook.scope });
              break;
            case 'google':
              console.log('google signin');
              break;
            default:
              break;
          }
        },
        login: function(user) {
          return $http.post(config.loginUrl, user).success(function(data) {
            $window.localStorage.token = data.token;
            var token = $window.localStorage.token;
            var payload = JSON.parse($window.atob(token.split('.')[1]));
            $rootScope.currentUser = payload.prn;
            $location.path(config.loginRedirect);
          });
        },
        signup: function(user) {
          return $http.post(config.signupUrl, user).success(function() {
            $location.path(config.loginUrl);
          });
        },
        logout: function() {
          delete $window.localStorage.token;
          delete $window.localStorage.accessToken;
          $rootScope.currentUser = null;
          $location.path(config.logoutRedirect);
        }
      };
    };
  })
  .factory('authInterceptor', function($q, $window, $location) {
    return {
      request: function(config) {
        if ($window.localStorage.token) {
          config.headers.Authorization = 'Bearer ' + $window.localStorage.token;
        }
        return config;
      },
      responseError: function(response) {
        if (response.status === 401 || response.status === 403) {
          $location.path('/login');
        }
        return $q.reject(response);
      }
    }
  })
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
