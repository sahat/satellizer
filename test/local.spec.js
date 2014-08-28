describe('satellizer.local', function() {

  beforeEach(module('satellizer'));

  beforeEach(inject(['$httpBackend', '$location', '$window', 'satellizer.local',
    function($httpBackend, $location, $window, local) {
      this.$httpBackend = $httpBackend;
      this.$location = $location;
      this.$window = $window;
      this.local = local;
    }]));


  describe('login()', function() {

    it('should be defined', function() {
      expect(this.local.login).toBeDefined();
    });

//    it('should return a user object on successful login', function() {
//      var result = null;
//      var token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjp7Il9pZCI6IjUzZjYxZTEwNmZjNjFhNmMxM2I1Mjc4ZCIsImVtYWlsIjoic2FoYXQ_QG1lLmNvbSIsIl9fdiI6MH0sImlhdCI6MTQwODgyMTA5MTY3NiwiZXhwIjoxNDA5NDI1ODkxNjc2fQ.0l-ql-ZVjHiILMcMegNb3bNqapt3TZwjHy_ieduioiQ';
//      var user = {
//        email: 'sahat?@me.com',
//        password: '1234'
//      };
//
//      this.$httpBackend.expectPOST('/auth/login').respond({ token: token });
//
//      this.local.login(user).then(function(response) {
//        result = response;
//      });
//
//      this.$httpBackend.flush();
//
//      expect(this.local.isAuthenticated()).toBe(true);
//      expect(result).toEqual({
//        __v: 0,
//        _id: '53f61e106fc61a6c13b5278d',
//        email: user.email
//      });
//    });

    it('should fail login with incorrect credentials', function() {
      var result = null;
      var user = {
        email: 'foo@bar.com',
        password: 'invalid'
      };

      this.$httpBackend.expectPOST('/auth/login').respond(401, 'Wrong email or password');

      this.local.login(user).catch(function(response) {
        result = response.data;
      });

      this.$httpBackend.flush();

      expect(result).toEqual('Wrong email or password');
    });

  });

  describe('logout()', function() {

    it('should have a logout function', function() {
      expect(this.local.logout).toBeDefined();
      expect(angular.isFunction(this.local.logout)).toBe(true);
    });

    it('should log out a user', function() {
      this.local.logout();
      expect(this.$window.localStorage['satellizer_token']).toBeUndefined();
      expect(this.$location.path()).toEqual('/');
    });

  });

  describe('signup()', function() {

    it('should have a signup function', function() {
      expect(this.local.signup).toBeDefined();
      expect(angular.isFunction(this.local.signup)).toBe(true);
    });

    it('should create a new user', function() {
      var user = {
        email: 'john@email.com',
        password: '1234'
      };

      this.$httpBackend.expectPOST('/auth/signup').respond(200);

      this.local.signup(user);

      this.$httpBackend.flush();

      expect(this.$location.path()).toEqual('/login');
    });

    it('should be able to handle signup errors', function() {
      var user = {
        email: 'foo@bar.com',
        password: '1234'
      };
      var rejected = false;

      this.$httpBackend.expectPOST('/auth/signup').respond(400);

      this.local.signup(user).catch(function() {
        rejected = true;
      });

      this.$httpBackend.flush();

      expect(rejected).toBe(true);
    });

  });

  describe('unlink()', function() {

    it('should unlink a provider successfully', function() {
      var result = null;
      var provider = 'google';
      var token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjp7Il9pZCI6IjUzZjYxZTEwNmZjNjFhNmMxM2I1Mjc4ZCIsImVtYWlsIjoic2FoYXRAbWUuY29tIiwiX192IjowfSwiaWF0IjoxNDA4ODIxMDkxNjc2LCJleHAiOjE0MDk0MjU4OTE2NzZ9.0l-ql-ZVjHiILMcMegNb3bNqapt3TZwjHy_ieduioiQ';

      this.$httpBackend.expectGET('/auth/unlink/google').respond(200, { token: token });

      this.local.unlink(provider).then(function(response) {
        result = response;
      });

      this.$httpBackend.flush();

      expect(this.local.unlink()).toBeDefined();
    });

    it('should unlink a provider and get an error', function() {
      var result = null;
      var provider = 'google';

      this.$httpBackend.expectGET('/auth/unlink/google').respond(400);

      this.local.unlink(provider).catch(function(response) {
        result = response;
      });

      this.$httpBackend.flush();

      expect(result.status).toEqual(400);
    });

  });

  describe('isAuthenticated()', function() {

    it('should be defined', function() {
      expect(this.local.isAuthenticated).toBeDefined();
      expect(angular.isFunction(this.local.isAuthenticated)).toBe(true);
    });

  });

});

