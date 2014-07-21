/**
 * ngAuth 0.0.1
 * (c) 2014 Sahat Yalkabov <sahat@me.com>
 * License: MIT
 */

// TODO: Enable CORS, separate server from client, Gulp server runner
// TODO: Provider return object, underscore private functions < 10loc
// TODO: Modular, enable/disable facebook or twitter or local auth
// TODO: directive for login buttons that interact with provider

angular.module('ngAuth', [])
  .provider('Auth', function() {

    var config = this.config = {
      logoutRedirect: '/',
      loginRedirect: '/',
      loginUrl: '/auth/login',
      signupUrl: '/auth/signup',
      signupRedirect: '/login',
      providers: {
        facebook: {
          url: '/auth/facebook',
          appId: null,
          scope: null,
          responseType: 'token',
          locale: 'en_US',
          version: 'v2.0'
        },
        google: {
          clientId: null,
          scope: null,
          redirectUri: null,
          responseType: 'token'
        },
        linkedin: {
          clientId: null,
          scope: null,
          redirectUri: null,
          responseType: 'token'
        }
      }
    };

    function loadLinkedinSdk() {
      (function() {
        var e = document.createElement('script');
        e.type = 'text/javascript';
        e.src = 'http://platform.linkedin.com/in.js?async=true';
        e.onload = function() {
          IN.init({
            api_key: '75z17ew9n8c2pm',
            authorize: true
          });
        };
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(e, s);
      })();
    }

    function loadFacebookSdk($document, $window) {
      if (!$document[0].getElementById('fb-root')) {
        $document.find('body').append('<div id="fb-root"></div>');
      }

      $window.fbAsyncInit = function() {
        FB.init(config.providers.facebook);
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

    function loadGooglePlusSdk() {
      (function() {
        var po = document.createElement('script');
        po.type = 'text/javascript';
        po.async = true;
        po.src = 'https://apis.google.com/js/client:plusone.js';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(po, s);
      })();
    }

    return {
      facebook: function(params) {
        angular.extend(config.providers.facebook, params);
      },

      google: function(params) {
        angular.extend(config.providers.google, params);
      },

      linkedin: function(params) {
        angular.extend(config.providers.linkedin, params);
      },

      oauth2: function(params) {
        var provider = params.name;
        config.providers[provider] = config.providers[provider] || {};
        angular.extend(config.providers[provider], params);
      },

      $get: function($http, $location, $rootScope, $alert, $q, $injector, $window, $document) {

        var token = $window.localStorage.token;
        if (token) {
          var payload = JSON.parse($window.atob(token.split('.')[1]));
          $rootScope.currentUser = payload.user;
        }

        if (config.providers.linkedin.clientId) {
          loadLinkedinSdk();
        }

        if (config.providers.facebook.appId) {
          loadFacebookSdk($document, $window);
        }

        if (config.providers.google.clientId) {
          loadGooglePlusSdk();
        }

        function logout() {
          delete $window.localStorage.token;
          $rootScope.currentUser = null;
          $location.path(config.logoutRedirect);
        }

        function login(user) {
          return $http.post(config.loginUrl, user).success(function(data) {
            $window.localStorage.token = data.token;
            var token = $window.localStorage.token;
            var payload = JSON.parse($window.atob(token.split('.')[1]));
            $rootScope.currentUser = payload.user;
            $location.path(config.loginRedirect);
          });
        }

        function signup(user) {
          return $http.post(config.signupUrl, user).success(function() {
            $location.path(config.signupRedirect);
          });
        }

        function loggedIn() {
          // TODO: return login status
        }

        function user() {
          // TODO: move rootscope to here
          // TODO: make a property
        }

        function loginOauth(provider) {
          provider = provider.trim().toLowerCase();

          switch (provider) {
            case 'facebook':
              var scope = config.providers.facebook.scope.join(',');
              FB.login(function(response) {
                FB.api('/me', function(profile) {
                  var data = {
                    signedRequest: response.authResponse.signedRequest,
                    profile: profile
                  };
                  $http.post(config.providers.facebook.url, data).success(function(token) {
                    var payload = JSON.parse($window.atob(token.split('.')[1]));
                    $window.localStorage.token = token;
                    $rootScope.currentUser = payload.user;
                    $location.path(config.loginRedirect);
                  });
                });
              }, { scope: scope });
              break;
            case 'google':
              gapi.auth.authorize({
                client_id: config.providers.google.clientId,
                scope: config.providers.google.scope,
                immediate: false
              }, function(accessToken) {
                gapi.client.load('plus', 'v1', function() {
                  var request = gapi.client.plus.people.get({
                    userId: 'me'
                  });
                  request.execute(function(response) {
                    var data = {
                      accessToken: accessToken,
                      profile: response
                    };
                    $http.post(config.providers.google.url, data).success(function(token) {
                      var payload = JSON.parse($window.atob(token.split('.')[1]));
                      $window.localStorage.token = token;
                      $rootScope.currentUser = payload.user;
                      $location.path(config.loginRedirect);
                    });
                  });
                });
              });
              console.log('google signin');
              break;
            case 'linkedin':
              console.log('sign in with linkedin');
              IN.UI.Authorize().place();
              IN.Event.on(IN, 'auth', function() {
                console.log('Logged in...');
                var data = {
                  signedRequest: response.authResponse.signedRequest,
                  profile: profile
                };
                $http.post(config.providers.facebook.url, data).success(function(token) {
                  var payload = JSON.parse($window.atob(token.split('.')[1]));
                  $window.localStorage.token = token;
                  $rootScope.currentUser = payload.user;
                  $location.path(config.loginRedirect);
                });
              });
              break;
            default:
              break;
          }
        }

        return {
          loginOauth: loginOauth,
          login: login,
          signup: signup,
          logout: logout,
          loggedIn: loggedIn,
          user: user
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
  })
  .run(function($rootScope, $location) {
    $rootScope.$on('$routeChangeStart', function(event, current, previous) {
      if ($rootScope.currentUser &&
        (current.originalPath === '/login' || current.originalPath === '/signup')) {
        $location.path('/');
      }
      if (current.authenticated && !$rootScope.currentUser) {
        $location.path('/login');
      }
    });
  });
