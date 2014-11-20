angular.module('satellizer')
  .provider('$auth', ['satellizer.config', function(config) {
    Object.defineProperties(this, {
      logoutRedirect: {
        get: function() { return config.logoutRedirect; },
        set: function(value) { config.logoutRedirect = value; }
      },
      loginRedirect: {
        set: function(value) { config.loginRedirect = value; },
        get: function() { return config.loginRedirect; }
      },
      signupRedirect: {
        get: function() { return config.signupRedirect; },
        set: function(value) { config.signupRedirect = value; }
      },
      loginOnSignup: {
        get: function() { return config.loginOnSignup; },
        set: function(value) { config.loginOnSignup = value; }
      },
      immediateRedirect: {
        get: function() { return config.immediateRedirect; },
        set: function(value) { config.immediateRedirect = value; }
      },
      loginUrl: {
        get: function() { return config.loginUrl; },
        set: function(value) { config.loginUrl = value; }
      },
      signupUrl: {
        get: function() { return config.signupUrl; },
        set: function(value) { config.signupUrl = value; }
      },
      loginRoute: {
        get: function() { return config.loginRoute; },
        set: function(value) { config.loginRoute = value; }
      },
      signupRoute: {
        get: function() { return config.signupRoute; },
        set: function(value) { config.signupRoute = value; }
      },
      tokenName: {
        get: function() { return config.tokenName; },
        set: function(value) { config.tokenName = value; }
      },
      tokenPrefix: {
        get: function() { return config.tokenPrefix; },
        set: function(value) { config.tokenPrefix = value; }
      },
      unlinkUrl: {
        get: function() { return config.unlinkUrl; },
        set: function(value) { config.unlinkUrl = value; }
      },
      authHeader: {
        get: function() { return config.authHeader; },
        set: function(value) { config.authHeader = value; }
      }
    });

    angular.forEach(Object.keys(config.providers), function(provider) {
      this[provider] = function(params) {
        return angular.extend(config.providers[provider], params);
      };
    }, this);

    var oauth = function(params) {
      config.providers[params.name] = config.providers[params.name] || {};
      angular.extend(config.providers[params.name], params);
    };

    this.oauth1 = function(params) {
      oauth(params);
      config.providers[params.name].type = '1.0';
    };

    this.oauth2 = function(params) {
      oauth(params);
      config.providers[params.name].type = '2.0';
    };

    this.$get = [
      '$q',
      'satellizer.shared',
      'satellizer.local',
      'satellizer.oauth',
      function($q, shared, local, oauth) {
        var $auth = {};

        $auth.authenticate = function(name, userData, immediate) {
          return oauth.authenticate(name, false, userData, immediate);
        };

        $auth.login = function(user) {
          return local.login(user);
        };

        $auth.signup = function(user) {
          return local.signup(user);
        };

        $auth.logout = function() {
          return shared.logout();
        };

        $auth.isAuthenticated = function() {
          return shared.isAuthenticated();
        };

        $auth.link = function(name, userData, immediate) {
          return oauth.authenticate(name, true, userData, immediate);
        };

        $auth.unlink = function(provider) {
          return oauth.unlink(provider);
        };

        $auth.getToken = function() {
          return shared.getToken();
        };

        $auth.setToken = function(token, isLinking) {
          shared.setToken({ access_token: token }, isLinking);
        };

        $auth.getPayload = function() {
          return shared.getPayload();
        };

        return $auth;
      }];

  }]);
