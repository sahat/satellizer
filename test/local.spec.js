describe('SatellizerLocal', function() {

  beforeEach(module('satellizer'));

  beforeEach(inject(function($httpBackend, $location, $window, SatellizerConfig, SatellizerLocal, SatellizerShared) {
    this.$httpBackend = $httpBackend;
    this.$location = $location;
    this.$window = $window;
    this.config = SatellizerConfig;
    this.local = SatellizerLocal;
    this.shared = SatellizerShared;
    this.token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjp7Il9pZCI6IjUzZjYxZTEwNmZjNjFhNmMxM2I1Mjc4ZCIsImVtYWlsIjoic2FoYXQ_QG1lLmNvbSIsIl9fdiI6MH0sImlhdCI6MTQwODgyMTA5MTY3NiwiZXhwIjoxNDA5NDI1ODkxNjc2fQ.0l-ql-ZVjHiILMcMegNb3bNqapt3TZwjHy_ieduioiQ';
  }));

  describe('login()', function() {

    it('should be defined', function() {
      expect(this.local.login).toBeDefined();
    });

    it('should return a user object on successful login', function() {
      var result = null;
      var user = {
        email: 'foo@gmail.com',
        password: 'bar'
      };

      this.$httpBackend.expectPOST('/auth/login').respond({ token: this.token });

      this.local.login(user).then(function(response) {
        result = response.data.token;
      });

      this.$httpBackend.flush();

      expect(this.shared.isAuthenticated()).toBe(true);
      expect(result).toEqual(this.token);
    });

    it('should fail login with incorrect credentials', function() {
      var result;
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

    it('should create a new user', function() {
      var result;
      var user = {
        email: 'john@email.com',
        password: '1234'
      };

      this.$httpBackend.expectPOST('/auth/signup').respond({ token: this.token });

      this.local.signup(user).then(function(response) {
        result = response.data.token;
      });

      this.$httpBackend.flush();

      expect(result).toEqual(this.token);
    });

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

  });

});

