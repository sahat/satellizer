describe('SatellizerShared', function() {

  beforeEach(module('satellizer'));

  beforeEach(inject(['$q', '$httpBackend', '$location', '$window', 'SatellizerShared', 'SatellizerConfig',
    function($q, $httpBackend, $location, $window, shared, config) {

      this.$q = $q;
      this.$httpBackend = $httpBackend;
      this.$location = $location;
      this.$window = $window;
      this.shared = shared;
      this.config = config;
    }]));

  describe('logout()', function() {

    it('should be defined', function() {
      expect(this.shared.logout).toBeDefined();
    });

    it('should log out a user', function() {
      var tokenName = [this.config.tokenPrefix, this.config.tokenName].join('_');
      this.shared.logout();
      expect(this.$window.localStorage[tokenName]).toBeFalsy();
    });

  });

  describe('getToken()', function() {

    it('should be defined', function() {
      expect(this.shared.getToken).toBeDefined();
    });

    it('should get a token from Local Storage', function() {
      var tokenName = [this.config.tokenPrefix, this.config.tokenName].join('_');
      this.$window.localStorage[tokenName] = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEyMzQ1Njc4OTAsIm5hbWUiOiJKb2huIERvZSJ9.kRkUHzvZMWXjgB4zkO3d6P1imkdp0ogebLuxnTCiYUU';
      var token = this.shared.getToken();
      expect(token).toEqual(this.$window.localStorage[tokenName]);
    });

  });

  describe('getPayload()', function() {

    it('should be defined', function() {
      expect(this.shared.getPayload).toBeDefined();
    });

    it('should get a JWT payload', function() {
      var tokenName = [this.config.tokenPrefix, this.config.tokenName].join('_');
      localStorage.setItem(tokenName, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEyMzQ1Njc4OTAsIm5hbWUiOiJKb2huIERvZSJ9.kRkUHzvZMWXjgB4zkO3d6P1imkdp0ogebLuxnTCiYUU');
      var payload = this.shared.getPayload();
      expect(angular.isObject(payload)).toBe(true);
      expect(payload.name).toEqual('John Doe');
    });

    it('should get a JWT payload with non-english characters', function() {
      var tokenName = [this.config.tokenPrefix, this.config.tokenName].join('_');
      localStorage.setItem(tokenName, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEyMzQ1Njc4OTAsIm5hbWUiOiJSb2LDqXJ0w6AgVGjDqcO0In0.sgREDWs78UYxIMDfa9cwYqvDgco3i_Ap4MUwmprZWN0');
      var payload = this.shared.getPayload();
      expect(angular.isObject(payload)).toBe(true);
      expect(payload.name).toEqual('Robértà Théô');
    });

    it('should return undefined if not a valid JWT', function() {
      var tokenName = [this.config.tokenPrefix, this.config.tokenName].join('_');
      localStorage.setItem(tokenName, 'f0af717251950dbd4d73154fdf0a474a5c5119adad999683f5b450c460726aa');
      var payload = this.shared.getPayload();
      expect(payload).toBeUndefined();
    });

  });

  describe('isAuthenticated()', function() {

    it('should be defined', function() {
      expect(this.shared.isAuthenticated).toBeDefined();
      expect(angular.isFunction(this.shared.isAuthenticated)).toBe(true);
    });

    it('test coverage', function() {
      var tokenName = [this.config.tokenPrefix, this.config.tokenName].join('_');
      localStorage.setItem(tokenName, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEyMzQ1Njc4OTAsIm5hbWUiOiJKb2huIERvZSJ9.kRkUHzvZMWXjgB4zkO3d6P1imkdp0ogebLuxnTCiYUU');
      expect(this.shared.isAuthenticated()).toBe(true);
    });


  });

  describe('setToken()', function() {

    it('should throw error if no token is provided', function() {
      var response = { data: {} };
      expect(function() {
        this.shared.setToken(response);
      }).toThrow();
    });

    it('should set the token when tokenRoot is provided', function() {
      this.config.tokenRoot = 'foo.bar';
      var token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJsb…YzMn0.YATZN37JENCQWeNAoN4M7KxJl7OAIJL4ka_fSM_gYkE'

      var response = {
        data: {
          foo: {
            bar: {
              token: token
            }
          }
        }
      };
      this.shared.setToken(response);

      expect(token).toEqual(this.shared.getToken());
    });

  });

  describe('removeToken()', function() {

    it('should remove a token', function() {
      var tokenName = [this.config.tokenPrefix, this.config.tokenName].join('_');
      localStorage.setItem(tokenName, 'f0af717251950dbd4d73154fdf0a474a5c5119adad999683f5b450c460726aa');
      expect(this.$window.localStorage[tokenName]).toBeDefined();

      this.shared.removeToken();
      expect(this.$window.localStorage[tokenName]).toBeUndefined();
    });

  });

});
