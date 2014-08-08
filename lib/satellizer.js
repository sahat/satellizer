/**
 * ngAuth 0.0.1
 * (c) 2014 Sahat Yalkabov <sahat@me.com>
 * License: MIT
 */

(function(window, angular, undefined) {
  'use strict';

  angular.module('Satellizer', [])
    .service('Utils', Utils)
    .factory('OAuth2', Oauth2)
    .factory('OAuth1', Oauth1)
    .factory('Popup', Popup)
    .provider('$auth', $auth)
    .config(httpInterceptor)
    .run(onRun);

  var config = {
    logoutRedirect: '/',
    loginRedirect: '/',
    loginUrl: '/auth/login',
    signupUrl: '/auth/signup',
    signupRedirect: '/login',
    loginRoute: '/login',
    signupRoute: '/signup',
    user: 'currentUser'
  };

  var providers = {
    google: {
      url: '/auth/google',
      authorizationEndpoint: 'https://accounts.google.com/o/oauth2/auth',
      redirectUri: window.location.origin,
      scope: 'openid profile email',
      requiredUrlParams: ['scope'],
      optionalUrlParams: ['display'],
      display: 'popup',
      type: 'oauth2',
      popupOptions: {
        width: 452,
        height: 633
      }
    },
    facebook: {
      url: '/auth/facebook',
      authorizationEndpoint: 'https://www.facebook.com/dialog/oauth',
      redirectUri: window.location.origin,
      scope: 'email',
      requiredUrlParams: ['display'],
      display: 'popup',
      type: 'oauth2',
      popupOptions: {
        width: 481,
        height: 269
      }
    },
    linkedin: {
      url: '/auth/linkedin',
      authorizationEndpoint: 'https://www.linkedin.com/uas/oauth2/authorization',
      redirectUri: window.location.origin,
      requiredUrlParams: ['state'],
      state: 'STATE',
      type: 'oauth2'
    },
    twitter: {
      url: '/auth/twitter',
      authorizationEndpoint: 'https://api.twitter.com/oauth/authenticate',
      type: 'oauth1'
    }
  };


  function $auth() {

    this.config = config;

    this.setProvider = function(params) {
      angular.extend(providers[params.name], params);
    };

    this.addProvider = function(params) {
      providers[params.name] = {};
      angular.extend(providers[params.name], params);
    };

    this.$get = function(OAuth1, OAuth2, $http, $location, $rootScope, $q, $window) {

      var $auth = {};

      $auth.authenticate = function(providerName) {
        var deferred = $q.defer();

        var provider = (providers[providerName].type === 'oauth1') ? OAuth1 : OAuth2;

        provider.open(providers[providerName]).then(function(token) {
          var payload = JSON.parse($window.atob(token.split('.')[1]));
          $window.localStorage.jwtToken = token;
          $rootScope[config.user] = payload.user;
          $location.path(config.loginRedirect);
          deferred.resolve();
        });

        return deferred.promise;
      };

      $auth.login = function(user) {
        if (!user) {
          throw new Error('You must provide a user object.');
        }

        var deferred = $q.defer();

        $http.post(config.loginUrl, user)
          .success(function(data) {
            var payload = JSON.parse($window.atob(data.token.split('.')[1]));
            $rootScope[config.user] = payload.user;
            $location.path(config.loginRedirect);
            $window.localStorage.jwtToken = data.token;
            deferred.resolve(payload.user);
          })
          .error(function(error) {
            deferred.reject(error);
          });

        return deferred.promise;
      };

      $auth.signup = function(user) {
        $http.post(config.signupUrl, user).then(function() {
          $location.path(config.signupRedirect);
        });
      };

      $auth.logout = function() {
        delete $rootScope[config.user];
        delete $window.localStorage.jwtToken;
        $location.path(config.logoutRedirect);
      };

      $auth.isAuthenticated = function() {
        return Boolean($rootScope.currentUser);
      };

      return $auth;
    };

  }

  function Popup($q, $interval, $window) {
    var popupWindow = null;
    var polling = null;

    var popup = {};

    popup.open = function(url, options) {
      var deferred = $q.defer();
      var optionsString = popup.stringifyOptions(popup.prepareOptions(options || {}));

      console.log(optionsString)
      popupWindow = $window.open(url, 'ngAuth', optionsString);
      popupWindow.focus();

      this.postMessageHandler(deferred);
      this.pollPopup(deferred);

      return deferred.promise;
    };

    popup.pollPopup = function(deferred) {
      polling = $interval(function() {
        if (popupWindow.closed) {
          $interval.cancel(polling);
          deferred.reject('Popup was closed by the user.');
        }
      }.bind(this), 35);
    };

    popup.postMessageHandler = function(deferred) {
      $window.addEventListener('message', function(event) {
        if (event.origin === $window.location.origin) {
          deferred.resolve(event.data);
        }
      }, false);
    };

    popup.prepareOptions = function(options) {
      var defaults = {
        width: options.width || 500,
        height: options.height || 500,
        left: $window.screen.availWidth / 2 - options.width / 2,
        top: $window.screen.availHeight / 2 - options.height / 2
      };
      return angular.extend(defaults, options);
    };

    popup.stringifyOptions = function(options) {
      var parts = [];
      angular.forEach(options, function(value, key) {
        parts.push(key + '=' + value);
      });
      return parts.join(',');
    };

    return popup;
  }

  function Oauth1($q, $http, Popup) {
    var defaults = {
      url: null,
      name: null,
      popupOptions: null,
      authorizationEndpoint: null
    };

    var oauth1 = {};

    oauth1.tokenRequest = function() {
      return $http.post(defaults.url);
    };

    oauth1.open = function(options) {
      angular.extend(defaults, options);

      var deferred = $q.defer();

      Popup.open(defaults.url).then(function(oauthData) {
        this.exchangeForToken(oauthData).then(function(response) {
          deferred.resolve(response.data);
        });
      });

      return deferred.promise;
    };

    oauth1.exchangeForToken = function(oauthData) {
      return $http.get(defaults.url, { params: oauthData });
    };

    return oauth1;
  }

  function Oauth2($q, $http, Utils, Popup) {
    var defaults = {
      url: null,
      name: null,
      scope: null,
      clientId: null,
      redirectUri: null,
      popupOptions: null,
      requiredUrlParams: null,
      optionalUrlParams: null,
      authorizationEndpoint: null,
      responseType: 'code',
      defaultUrlParams: ['response_type', 'client_id', 'redirect_uri']
    };

    var oauth2 = {};

    oauth2.open = function(options) {
      angular.extend(defaults, options);
      var deferred = $q.defer();
      var url = oauth2.buildUrl();

      Popup.open(url, defaults.popupOptions).then(function(oauthData) {
        oauth2.exchangeForToken(oauthData).then(function(response) {
          deferred.resolve(response.data);
        });
      });

      return deferred.promise;
    };

    oauth2.exchangeForToken = function(oauthData) {
      return $http.post(defaults.url, {
        code: oauthData.code,
        clientId: defaults.clientId,
        redirectUri: defaults.redirectUri
      });
    };

    oauth2.buildUrl = function() {
      var baseUrl = defaults.authorizationEndpoint;
      var qs = oauth2.buildQueryString();
      return [baseUrl, qs].join('?');
    };

    oauth2.buildQueryString = function() {
      var keyValuePairs = [];

      angular.forEach(defaults.defaultUrlParams, function(paramName) {
        var camelizedName = Utils.camelCase(paramName);
        var paramValue = defaults[camelizedName];
        keyValuePairs.push([paramName, encodeURIComponent(paramValue)]);
      });

      angular.forEach(defaults.requiredUrlParams, function(paramName) {
        var camelizedName = Utils.camelCase(paramName);
        var paramValue = defaults[camelizedName];
        keyValuePairs.push([paramName, encodeURIComponent(paramValue)]);
      });

      angular.forEach(defaults.optionalUrlParams, function(paramName) {
        var camelizedName = Utils.camelCase(paramName);
        var paramValue = defaults[camelizedName];
        keyValuePairs.push([paramName, encodeURIComponent(paramValue)]);
      });

      return keyValuePairs.map(function(pair) {
        return pair.join('=');
      }).join('&');
    };

    return oauth2;
  }

  function httpInterceptor($httpProvider) {
    $httpProvider.interceptors.push(function($q, $window, $location) {
      return {
        request: function(config) {
          if ($window.localStorage.jwtToken) {
            config.headers.Authorization = 'Bearer ' + $window.localStorage.jwtToken;
          }
          return config;
        },
        responseError: function(response) {
          if (response.status === 401 || response.status === 403) {
            $location.path('/login');
          }
          return $q.reject(response);
        }
      };
    });
  }

  function onRun($rootScope, $window, $location, Utils) {
    var token = $window.localStorage.jwtToken;
    if (token) {
      var payload = JSON.parse($window.atob(token.split('.')[1]));
      $rootScope.currentUser = payload.user;
    }

    var params = $window.location.search.substring(1);
    var qs = Utils.parseQueryString(params);
    if ($window.opener && $window.opener.location.origin === $window.location.origin) {
      if (qs.oauth_token && qs.oauth_verifier) {
        $window.opener.postMessage({ oauth_token: qs.oauth_token, oauth_verifier: qs.oauth_verifier }, '*');
      } else if (qs.code) {
        $window.opener.postMessage({ code: qs.code }, '*');
      }
//      $window.close();
    }

    $rootScope.$on('$routeChangeStart', function(event, current) {
      if ($rootScope[config.user] &&
        (current.originalPath === '/login' || current.originalPath === '/signup')) {
        $location.path('/');
      }
      if (current.authenticated && !$rootScope[config.user]) {
        $location.path('/login');
      }
    });
  }

  function Utils() {
    this.camelCase = function(name) {
      return name.replace(/([\:\-\_]+(.))/g, function(_, separator, letter, offset) {
        return offset ? letter.toUpperCase() : letter;
      });
    };
    this.parseQueryString = function(keyValue) {
      var obj = { }, key, value;
      angular.forEach((keyValue || '').split('&'), function(keyValue) {
        if (keyValue) {
          value = keyValue.split('=');
          key = decodeURIComponent(value[0]);
          obj[key] = angular.isDefined(value[1]) ? decodeURIComponent(value[1]) : true;
        }
      });
      return obj;
    };
  }


})(window, window.angular);

