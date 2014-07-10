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
          authorizationUrl: 'test1',
          verificationUrl: 'test2'
        }
      }
    };
    return {
      provider: function(name, options) {
        console.log(name, config.providers);

        config.providers[name] =  config.providers[name] || {};

        angular.extend(config.providers[name], options);
        console.log(config);
      },
      $get: function($http, $location, $rootScope, $alert, $q, $window) {

        function authenticate(provider) {
          getTokenByPopup(provider).then(function(params) {
            Token.verifyAsync(params.access_token).then(function(data) {
              $rootScope.$apply(function() {
                $window.localStorage.facebook.accessToken = params.access_token;
              });
            }, function() {
              alert("Failed to verify token.")
            });

          }, function() {
            // Failure getting token from popup.
            alert("Failed to get token from popup.");
          });
        }

        function getTokenByPopup(provider) {

          var popupOptions = {
            name: 'AuthPopup',
            openParams: {
              width: 650,
              height: 300,
              resizable: true,
              scrollbars: true,
              status: true
            }
          };
          var deferred = $q.defer();
          var url = config.providers[provider].authorizationEndpoint;
          var resolved = false;

          var formatPopupOptions = function(options) {
            var pairs = [];
            angular.forEach(options, function(value, key) {
              if (value || value === 0) {
                value = (value === true) ? 'yes' : value;
                pairs.push(key + '=' + value);
              }
            });
            return pairs.join(',');
          };

          var popup = window.open(url, popupOptions.name, formatPopupOptions(popupOptions.openParams));

          // TODO: binding occurs for each reauthentication, leading to leaks for long-running apps.

          angular.element($window).bind('message', function(event) {
            // Use JQuery originalEvent if present
            event = event.originalEvent || event;
            if (event.source == popup && event.origin == window.location.origin) {
              $rootScope.$apply(function() {
                if (event.data.access_token) {
                  deferred.resolve(event.data)
                } else {
                  deferred.reject(event.data)
                }
              })
            }
          });

          // TODO: reject deferred if the popup was closed without a message being delivered + maybe offer a timeout

          return deferred.promise;
        }

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

        function login(user) {
          return $http.post(config.loginUrl, user).success(function(data) {
            $window.localStorage.token = data.token;
            var token = $window.localStorage.token;
            var payload = JSON.parse($window.atob(token.split('.')[1]));
            $rootScope.currentUser = payload.prn;
            $location.path(config.loginRedirect);
          });
        }

        function signup(user) {
          return $http.post(config.signupUrl, user).success(function() {
            $location.path(config.loginUrl);
          });
        }

        function logout() {
          delete $window.localStorage.token;
          $rootScope.currentUser = null;
          $location.path(config.logoutRedirect);
        }

        return {
          authenticate: authenticate,
          login: login,
          signup: signup,
          logout: logout
        };
      }
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
