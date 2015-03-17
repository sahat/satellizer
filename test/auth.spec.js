describe('$auth', function() {

  beforeEach(module('satellizer'));

  beforeEach(inject(['$window', '$location', '$httpBackend', '$auth', 'satellizer.config', function($window, $location, $httpBackend, $auth, config) {
    this.$auth = $auth;
    this.$window = $window;
    this.$location = $location;
    this.$httpBackend = $httpBackend;
    this.config = config;
  }]));

  it('should be defined', function() {
    expect(this.$auth).toBeDefined();
  });

  describe('authenticate()', function() {

    it('should be defined', function() {
      expect(this.$auth.authenticate).toBeDefined();
    });

  });

  describe('isAuthenticated()', function() {

    it('should be defined', function() {
      expect(this.$auth.isAuthenticated).toBeDefined();
    });

  });

  describe('getToken()', function() {

    it('should be defined', function() {
      expect(this.$auth.getToken).toBeDefined();
    });

  });

  describe('setToken()', function() {

    it('should be defined', function() {
      var token = 'foo';
      expect(this.$auth.setToken).toBeDefined();
    });

  });

  describe('removeToken()', function() {

    it('should be defined', function() {
      expect(this.$auth.removeToken).toBeDefined();
    });

  });

  describe('getPayload()', function() {

    it('should be defined', function() {
      expect(this.$auth.getPayload).toBeDefined();
    });

  });

  describe('link()', function() {

    it('should be defined', function() {
      expect(this.$auth.link).toBeDefined();
    });

    it('should link third-party provider', function() {
      this.$auth.link('facebook');
    });

  });

  describe('unlink()', function() {

    it('should be defined', function() {
      expect(this.$auth.unlink).toBeDefined();
    });

    it('should unlink third-party provider', function() {
      this.$auth.unlink('facebook');
    });

  });

  describe('logout()', function() {

    it('should log out a user', function() {
      this.$auth.logout();
      expect(this.$window.localStorage['satellizer_token']).toBeUndefined();
      expect(this.$location.path()).toEqual('/');
    });

    it('should clear URL params and hash after being redirected', function() {
      this.$location.search('test', '123');
      this.$location.hash('hash');
      this.$auth.logout();
      expect(this.$location.url()).toEqual('/');
    });

    it('should redirect to the given URL', function() {
      var redirect = '/new/path';
      this.$auth.logout(redirect);
      expect(this.$location.url()).toEqual(redirect);
    });

  });

  describe('login()', function() {

    it('should be able to handle login errors',function() {
      var user = {
        email: 'foo@bar.com',
        password: '1234'
      };
      var rejected = false;

      this.$httpBackend.expectPOST('/auth/login').respond(404);

      this.$auth.login(user).then(angular.noop, function() {
        rejected = true;
      });

      this.$httpBackend.flush();

      expect(rejected).toBe(true);
    });

    it('should be able to call login', function() {
      var token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjp7Il9pZCI6IjUzZTU3ZDZiY2MzNmMxNTgwNzU4NDJkZCIsImVtYWlsIjoiZm9vQGJhci5jb20iLCJfX3YiOjB9LCJpYXQiOjE0MDc1NDg3ODI5NzMsImV4cCI6MTQwODE1MzU4Mjk3M30.1Ak6mij5kfkSi6d_wtPOx4yK7pS7ZFSiwbkL7AJbnYs';
      var user = { email: 'foo@bar.com', password: '1234' };

//    $httpBackend.expectPOST('/auth/login').respond({ token: token });
//
//    $auth.login(user);
//
//    $httpBackend.flush();

//    expect(angular.isFunction($auth.login)).toBe(true);
    });

    it('should be able to call loign with a redirect parameter', function() {
      var token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjp7Il9pZCI6IjUzZjYxZTEwNmZjNjFhNmMxM2I1Mjc4ZCIsImVtYWlsIjoic2FoYXQ_QG1lLmNvbSIsIl9fdiI6MH0sImlhdCI6MTQwODgyMTA5MTY3NiwiZXhwIjoxNDA5NDI1ODkxNjc2fQ.0l-ql-ZVjHiILMcMegNb3bNqapt3TZwjHy_ieduioiQ';
      var user = {
        email: 'sahat?@me.com',
        password: '1234'
      };
      var redirect = '/new/path';
      this.config.tokenRoot = 'tokenRoot';
      this.config.loginUrl = '/auth/login';
      var response = {
        tokenRoot: {
          token: token
        }
      };

      this.$httpBackend.expectPOST('/auth/login').respond(response);

      this.$auth.login(user, redirect);

      this.$httpBackend.flush();

      expect(this.$location.path()).toBe(redirect);
    });
  });

  describe('signup()', function() {

    it('should be able to call signup and auto login by default', function() {
      var user = {
        email: 'foo@bar.com',
        password: '1234'
      };

      var token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjp7Il9pZCI6IjUzZTU3ZDZiY2MzNmMxNTgwNzU4NDJkZCIsImVtYWlsIjoiZm9vQGJhci5jb20iLCJfX3YiOjB9LCJpYXQiOjE0MDc1NDg3ODI5NzMsImV4cCI6MTQwODE1MzU4Mjk3M30.1Ak6mij5kfkSi6d_wtPOx4yK7pS7ZFSiwbkL7AJbnYs';

      this.$httpBackend.expectPOST('/auth/signup').respond({token: token});

      this.$auth.signup(user);

      this.$httpBackend.flush();

      expect(angular.isFunction(this.$auth.signup)).toBe(true);
      expect(this.$location.path()).toEqual('/');
    });

    it('should be able to call signup and redirect to login', function() {
      var user = {
        email: 'foo@bar.com',
        password: '1234'
      };

      this.config.loginOnSignup = false;

      this.$httpBackend.expectPOST('/auth/signup').respond(200);

      this.$auth.signup(user);

      this.$httpBackend.flush();

      expect(angular.isFunction(this.$auth.signup)).toBe(true);
      expect(this.$location.path()).toEqual('/login');
    });

  });

});

