/**
 * ngAuth 0.0.1
 * (c) 2014 Sahat Yalkabov <sahat@me.com>
 * License: MIT
 */

(function(window, angular, undefined) {
  'use strict';

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

  angular.module('Satellizer', []).provider('$auth', function() {

    this.config = config;

    // Configure an existing provider by supplying additional information
    // such as scope, clientId, redirectUri.
    this.setProvider = function(params) {
      if (!params.name) {
        throw new Error('You did not set a provider\'s name.');
      }

      if (!providers[params.name]) {
        throw new Error('Provider ' + params.name + ' is not found. Are you trying to add a custom provider? Use addProvider() instead.');
      }

      angular.extend(providers[params.name], params);
    };

    // Add a custom provider by supplying everything that setProvider
    // requires plus additional information like authorizationEndpoint
    // and requiredParameters.
    this.addProvider = function(params) {
      if (!params.name) {
        throw new Error('You did not set a provider\'s name.');
      }

      if (providers[params.name]) {
        throw new Error('Provider ' + params.name + ' already exists. Use setProvider() instead.');
      }

      providers[params.name] = {};
      angular.extend(providers[params.name], params);
    };

    this.$get = function($interval, $http, $location, $rootScope, $q, $window) {

      // **Popup** constructor. The *popup* property refers to the `window`
      // object of the browser popup and the *polling* property is an interval
      // object assigned by the `Popup.prototype.pollPopup` method.
      var Popup = function() {
        this.popup = null;
        this.polling = null;
      };

      // Opens the popup with the optional `options` object to specify width and
      // height of a popup. An event listener is then added to the parent window
      // to wait for the `message` event from the popup. Meanwhile popup is
      // polled to detect when popup is abruptly closed by the user. Returns
      // promise that is either **rejected** in the `pollPopup` or **resolved**
      // in the `postMessageHandler`.
      Popup.prototype.open = function(url, options) {
        var deferred = $q.defer();
        var optionsString = stringifyOptions(prepareOptions(options || { }));

        this.popup = $window.open(url, 'ngAuth', optionsString);
        this.popup.focus();

        this.postMessageHandler(deferred);
        this.pollPopup(deferred);

        return deferred.promise;
      };

      // Polls the popup every 35 milliseconds. If popup is closed by the user
      // intervall polling is cancelled and promise is rejected.
      Popup.prototype.pollPopup = function(deferred) {
        this.polling = $interval(function() {
          if (this.popup.closed) {
            $interval.cancel(this.polling);
            deferred.reject('Popup was closed by the user.');
          }
        }.bind(this), 35);
      };

      // Listens for the *message* event that contains an `authorization_code`
      // string.
      Popup.prototype.postMessageHandler = function(deferred) {
        $window.addEventListener('message', function(event) {
          if (event.origin === $window.location.origin) {
            deferred.resolve(event.data);
          }
        }, false);
      };

      function prepareOptions(options) {
        var width = options.width || 500;
        var height = options.height || 500;
        return angular.extend({
          left: ((window.screen.width / 2) - (width / 2)),
          top: ((window.screen.height / 2) - (height / 2)),
          width: width,
          height: height
        }, options);
      }

      function stringifyOptions(options) {
        var optionsStrings = [];
        for (var key in options) {
          if (options.hasOwnProperty(key)) {
            var value;
            switch (options[key]) {
              case true:
                value = '1';
                break;
              case false:
                value = '0';
                break;
              default:
                value = options[key];
            }
            optionsStrings.push(
                key + '=' + value
            );
          }
        }
        return optionsStrings.join(',');
      }

      /**
       * OAuth 1.0
       */
      var OAuth1 = function(config) {
        angular.extend(this, config);
        this.name = config.name;
        this.url = config.url;
        this.authorizationEndpoint = config.authorizationEndpoint;
        this.popupOptions = config.popupOptions;
      };

      OAuth1.prototype.tokenRequest = function() {
        return $http.post(this.url);
      };

      OAuth1.prototype.open = function() {
        var deferred = $q.defer();

        var popup = new Popup();
        popup.open(this.url).then(function(oauthData) {
          this.exchangeForToken(oauthData).then(function(response) {
            deferred.resolve(response.data);
          });
        }.bind(this));

        return deferred.promise;
      };

      OAuth1.prototype.exchangeForToken = function(oauthData) {
        return $http.get(this.url, { params: oauthData });
      };

      /**
       * OAuth 2.0
       */
      var OAuth2 = function(config) {
        angular.extend(this, config);
        this.name = config.name;
        this.clientId = config.clientId;
        this.scope = config.scope;
        this.authorizationEndpoint = config.authorizationEndpoint;
        this.redirectUri = config.redirectUri;
        this.responseType = 'code';
        this.defaultUrlParams = ['response_type', 'client_id', 'redirect_uri'];
        this.requiredUrlParams = config.requiredUrlParams;
        this.optionalUrlParams = config.optionalUrlParams;
        this.popupOptions = config.popupOptions;
      };

      OAuth2.prototype.open = function() {
        var deferred = $q.defer();
        var url = this.buildUrl();
        var popup = new Popup();

        popup.open(url, this.popupOptions).then(function(oauthData) {
          this.exchangeForToken(oauthData).then(function(response) {
            deferred.resolve(response.data);
          });
        }.bind(this));

        return deferred.promise;
      };

      OAuth2.prototype.exchangeForToken = function(oauthData) {
        return $http.post(this.url, {
          code: oauthData.code,
          clientId: this.clientId,
          redirectUri: this.redirectUri
        });
      };

      OAuth2.prototype.buildUrl = function() {
        var baseUrl = this.authorizationEndpoint;
        var qs = this.buildQueryString();
        return [baseUrl, qs].join('?');
      };

      OAuth2.prototype.buildQueryString = function() {
        var obj = this;
        var keyValuePairs = [];

        angular.forEach(this.defaultUrlParams, function(paramName) {
          var camelizedName = camelCase(paramName);
          var paramValue = obj[camelizedName];
          keyValuePairs.push([paramName, encodeURIComponent(paramValue)]);
        });

        angular.forEach(this.requiredUrlParams, function(paramName) {
          var camelizedName = camelCase(paramName);
          var paramValue = obj[camelizedName];
          keyValuePairs.push([paramName, encodeURIComponent(paramValue)]);
        });

        angular.forEach(this.optionalUrlParams, function(paramName) {
          var camelizedName = camelCase(paramName);
          var paramValue = obj[camelizedName];
          keyValuePairs.push([paramName, encodeURIComponent(paramValue)]);
        });

        return keyValuePairs.map(function(pair) {
          return pair.join('=');
        }).join('&');
      };

      return {
        authenticate: function(providerName) {
          if (!providerName) {
            throw new Error('Expecting a provider name');
          }

          var deferred = $q.defer();
          var provider;

          if (providers[providerName].type === 'oauth1') {
            provider = new OAuth1(providers[providerName]);
          } else {
            provider = new OAuth2(providers[providerName]);
          }


          provider.open().then(function(token) {
            var payload = JSON.parse($window.atob(token.split('.')[1]));
            $window.localStorage.jwtToken = token;
            $rootScope[config.user] = payload.user;
            $location.path(config.loginRedirect);
            deferred.resolve();
          });

          return deferred.promise;
        },

        login: function(user) {
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
        },
        signup: function(user) {
          $http.post(config.signupUrl, user).then(function() {
            $location.path(config.signupRedirect);
          });
        },
        logout: function() {
          delete $rootScope[config.user];
          delete $window.localStorage.jwtToken;
          $location.path(config.logoutRedirect);
        },
        isAuthenticated: function() {
          return Boolean($rootScope.currentUser);
        }
      };
    };

  })
    .factory('authInterceptor', function($q, $window, $location) {
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
    })
    .config(function($httpProvider) {
      $httpProvider.interceptors.push('authInterceptor');
    })
    .run(function($rootScope, $window, $location) {
      var token = $window.localStorage.jwtToken;
      if (token) {
        var payload = JSON.parse($window.atob(token.split('.')[1]));
        $rootScope.currentUser = payload.user;
      }

      var params = $window.location.search.substring(1);
      var qs = parseQueryString(params);
      if ($window.opener && $window.opener.location.origin === $window.location.origin) {
        if (qs.oauth_token && qs.oauth_verifier) {
          $window.opener.postMessage({ oauth_token: qs.oauth_token, oauth_verifier: qs.oauth_verifier }, '*');
        } else if (qs.code) {
          $window.opener.postMessage({ code: qs.code }, '*');
        }
        $window.close();
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
    });

  function parseQueryString(keyValue) {
    var obj = { }, key, value;
    angular.forEach((keyValue || '').split('&'), function(keyValue) {
      if (keyValue) {
        value = keyValue.split('=');
        key = decodeURIComponent(value[0]);
        obj[key] = angular.isDefined(value[1]) ? decodeURIComponent(value[1]) : true;
      }
    });
    return obj;
  }

  function camelCase(name) {
    return name.replace(/([\:\-\_]+(.))/g, function(_, separator, letter, offset) {
      return offset ? letter.toUpperCase() : letter;
    });
  }
})(window, window.angular);

