describe('$auth', function() {

  beforeEach(module('satellizer'));

  beforeEach(inject(['$window', '$location', '$httpBackend', '$auth', function($window, $location, $httpBackend, $auth) {
    this.$auth = $auth;
    this.$window = $window;
    this.$location = $location;
    this.$httpBackend = $httpBackend;
  }]));

  it('should be defined', function() {
    expect(this.$auth).toBeDefined();
  });

  describe('authenticate()', function() {

    it('should be defined', function() {
      expect(this.$auth.authenticate).toBeDefined();
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

  describe('isAuthenticated()', function() {

    beforeEach(function() {
      localStorage.clear();
    });

    it('should be defined', function() {
      expect(this.$auth.isAuthenticated).toBeDefined();
    });

//    it('should return false', function() {
//      expect(this.$auth.isAuthenticated()).toBe(true);
//    });

  });

  describe('updateToken()', function() {

    it('should be defined', function() {
      expect(this.$auth.updateToken).toBeDefined();
    });

    it('should set new token in local storage', function() {
      this.$auth.updateToken('foo');
      expect(this.$window.localStorage['satellizer_token']).toBe('foo');
    });

  });

  describe('logout()', function() {

    it('should log out a user', function() {
      this.$auth.logout();
      expect(this.$window.localStorage['satellizer_token']).toBeUndefined();
      expect(this.$location.path()).toEqual('/');
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

  });

  describe('signup()', function() {

    it('should be able to call signup', function() {
      var user = {
        email: 'foo@bar.com',
        password: '1234'
      };

      this.$httpBackend.expectPOST('/auth/signup').respond(200);

      this.$auth.signup(user);

      this.$httpBackend.flush();

      expect(angular.isFunction(this.$auth.signup)).toBe(true);
      expect(this.$location.path()).toEqual('/login');
    });

  });

});

