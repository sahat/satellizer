describe('satellizer.local', function() {

  beforeEach(module('satellizer'));

  beforeEach(inject(['$httpBackend', '$location', '$window', 'satellizer.config', 'satellizer.local',
    function($httpBackend, $location, $window, config, local) {
      this.$httpBackend = $httpBackend;
      this.$location = $location;
      this.$window = $window;
      this.config = config;
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

    it('should redirect to the redirect parameter on successful login', function() {
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
          access_token: token
        }
      };

      this.$httpBackend.expectPOST('/auth/login').respond(response);

      this.local.login(user, redirect);

      this.$httpBackend.flush();

      expect(this.$location.path()).toBe(redirect);
    });

    it('should fail login with incorrect credentials', function() {
      var result = null;
      var user = {
        email: 'foo@bar.com',
        password: 'invalid'
      };

      this.$httpBackend.expectPOST(this.config.loginUrl).respond(401, 'Wrong email or password');

      this.local.login(user).catch(function(response) {
        result = response.data;
      });

      this.$httpBackend.flush();

      expect(result).toEqual('Wrong email or password');
    });

  });



  describe('signup()', function() {

    it('should have a signup function', function() {
      expect(this.local.signup).toBeDefined();
      expect(angular.isFunction(this.local.signup)).toBe(true);
    });
    //
    //it('should create a new user', function() {
    //  var user = {
    //    email: 'john@email.com',
    //    password: '1234'
    //  };
    //
    //  this.$httpBackend.expectPOST(this.config.signupUrl).respond(200);
    //
    //  this.local.signup(user);
    //
    //  this.$httpBackend.flush();
    //
    //  expect(this.$location.path()).toEqual(this.config.signupRedirect);
    //});

    it('should be able to handle signup errors', function() {
      var user = {
        email: 'foo@bar.com',
        password: '1234'
      };
      var rejected = false;

      this.$httpBackend.expectPOST(this.config.signupUrl).respond(400);

      this.local.signup(user).catch(function() {
        rejected = true;
      });

      this.$httpBackend.flush();

      expect(rejected).toBe(true);
    });

    it('should not redirect after signup if signupRedirect is false', function() {
      this.config.loginOnSignup = false
      this.config.signupRedirect = false
      var user = {
        email: 'foo@bar.com',
        password: '1234'
      };
      spyOn(this.$location, 'path');

      this.$httpBackend.expectPOST(this.config.signupUrl).respond(200);

      this.local.signup(user);

      this.$httpBackend.flush();

      expect(this.$location.path).not.toHaveBeenCalled();
    });

  });





});

