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
      loginUrl: '/login',
      signupUrl: '/signup',
      providers: {
        facebook: {
          appId: null,
          scope: null,
          redirectUri: null,
          responseType: 'token',
          locale: 'en_US',
          version: 'v2.0',
          xfbml: true,
          authorizationUrl: 'https://www.facebook.com/dialog/oauth',
          verificationUrl: 'https://graph.facebook.com/oauth/access_token'
        },
        google: {
          clientId: null,
          scope: null,
          redirectUri: null,
          responseType: 'token',
          authorizationUrl: 'https://accounts.google.com/o/oauth2/auth',
          verificationUrl: 'https://accounts.google.com/o/oauth2/token'
        }
      }
    };

    var objectToQueryString = function(obj) {
      var str = [];
      angular.forEach(obj, function(value, key) {
        str.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
      });
      return str.join('&');
    };


    var getParams = function(provider) {
      return {
        response_type: config.providers[provider].responseType,
        client_id: config.providers[provider].clientId,
        redirect_uri: config.providers[provider].redirectUri,
        scope: config.providers[provider].scope,
        display: 'popup'
      }
    };

    var formatPopupOptions = function(options) {
      var pairs = [];
      angular.forEach(options, function(value, key) {
        if (value || value === 0) {
          value = value === true ? 'yes' : value;
          pairs.push(key + '=' + value);
        }
      });
      return pairs.join(',');
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

    this.facebook = function(opts) {
      angular.extend(config.providers.facebook, opts);
    };

    this.google = function(opts) {
      angular.extend(config.providers.google, opts);
    };

    this.oauth2 = function(name, opts) {
      config.providers[name] = config.providers[name] || {};
      angular.extend(config.providers[name], opts);
    };

    this.$get = function($http, $location, $rootScope, $alert, $q, $injector, $window, $document) {

      if (config.providers.facebook.appId) {
        $window.fbAsyncInit = function() {
          FB.init(config.providers.facebook);
        };

        (function(d, s, id){
          var js, fjs = d.getElementsByTagName(s)[0];
          if (d.getElementById(id)) {return;}
          js = d.createElement(s); js.id = id;
          js.src = "//connect.facebook.net/" + config.providers.facebook.locale + "/sdk.js";
          fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
      }

      var _ezfb = {
        $$ready: false,
        init: function(params) {
          _paramsReady.resolve();
        }
      };

      var token = $window.localStorage.token;

      if (token) {
        var payload = JSON.parse($window.atob(token.split('.')[1]));
        if (Date.now() > payload.exp) {
          $window.alert('Token has expired');
          delete $window.localStorage.token;
        } else {
          $rootScope.currentUser = payload.prn;
        }
      }



      return {
        authenticate: function(provider) {
          provider = provider.trim().toLowerCase();

         switch (provider) {
           case 'facebook':
             console.log('loading facebook');
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
