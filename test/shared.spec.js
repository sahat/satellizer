describe('satellizer.shared', function() {

  beforeEach(module('satellizer'));

  beforeEach(inject(['$q', '$httpBackend', '$location', '$window', 'satellizer.shared', 'satellizer.config',
    function($q, $httpBackend, $location, $window, shared, config) {
      delete config.requestFilter;
      delete config.responseFilter;

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
      expect(this.$window.localStorage[tokenName]).toBeUndefined();
      expect(this.$location.path()).toEqual(this.config.logoutRedirect);
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
      expect(this.shared.isAuthenticated()).toBe(false);
    });


  });

  describe('parseUser()', function() {

    it('should not redirect if loginRedirect is null', function() {
      var deferred = this.$q.defer();
      var response = {
        data: {
          token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJsb…YzMn0.YATZN37JENCQWeNAoN4M7KxJl7OAIJL4ka_fSM_gYkE'
        }
      };
      this.config.tokenName = 'token';
      this.config.loginRedirect = null;

      this.shared.saveToken(response, deferred);

      expect(this.$location.path()).toBe('');
    });

  });

  describe('requestFilter()', function() {

    it('should match urls', function() {
      expect(this.shared.requestFilter).toBeDefined();

      var filter = this.shared.requestFilter;

      expect(filter({ url: 'http://localhost:9876' })).toBe(true);
      expect(filter({ url: 'http://localhost:9876/api' })).toBe(true);
      expect(filter({ url: 'http://localhost:9876/api?url=example.com' })).toBe(true);
      expect(filter({ url: '/api/example.com' })).toBe(true);
      expect(filter({ url: '/api?url=example.com' })).toBe(true);
      expect(filter({ url: '/api?url=www.example.com' })).toBe(true);
      expect(filter({ url: '/api?url=https://example.com' })).toBe(true);

      expect(filter({ url: 'http://example.com/api' })).toBe(false);
      expect(filter({ url: 'https://example.com/api' })).toBe(false);
      expect(filter({ url: 'http://example.com/api?url=http://localhost:9876' })).toBe(false);
      expect(filter({ url: 'https://example.com/api?url=http://localhost:9876' })).toBe(false);

      // TODO: Ensure we get the expected results for scenarios below
      // expect(this.shared.requestFilter({ url: '//localhost:9876/api' })).toBe(true);
      // expect(this.shared.requestFilter({ url: '//www.example.com/api' })).toBe('??');
      // expect(this.shared.requestFilter({ url: 'example.com/api' })).toBe(false);
      // expect(this.shared.requestFilter({ url: '//other.api.com/api?url=example.com' })).toBe(false);
      // expect(this.shared.requestFilter({ url: '//other.api.com/api?url=example.com' })).toBe(false);
      // expect(this.shared.requestFilter({ url: '//other.api.com/api?url=www.example.com' })).toBe(false);
      // expect(this.shared.requestFilter({ url: '//other.api.com/api?url=https://example.com' })).toBe(false);
      // expect(this.shared.requestFilter({ url: '//other.api.com/api?url=//example.com' })).toBe(false);
    });

  });

  describe('responseFilter()', function() {

    it('should match urls', function() {
      expect(this.shared.responseFilter).toBeDefined();

      var filter = this.shared.responseFilter;

      expect(filter({ config: { url: 'http://localhost:9876' } })).toBe(true);
      expect(filter({ config: { url: 'http://localhost:9876/api' } })).toBe(true);
      expect(filter({ config: { url: 'http://localhost:9876/api?url=example.com' } })).toBe(true);
      expect(filter({ config: { url: '/api/example.com' } })).toBe(true);
      expect(filter({ config: { url: '/api?url=example.com' } })).toBe(true);
      expect(filter({ config: { url: '/api?url=www.example.com' } })).toBe(true);
      expect(filter({ config: { url: '/api?url=https://example.com' } })).toBe(true);

      expect(filter({ config: { url: 'http://example.com/api' } })).toBe(false);
      expect(filter({ config: { url: 'https://example.com/api' } })).toBe(false);
      expect(filter({ config: { url: 'http://example.com/api?url=http://localhost:9876' } })).toBe(false);
      expect(filter({ config: { url: 'https://example.com/api?url=http://localhost:9876' } })).toBe(false);

      // TODO: Ensure we get the expected results for scenarios below
      // expect(this.shared.requestFilter({ config: { url: '//localhost:9876/api' } })).toBe(true);
      // expect(this.shared.requestFilter({ config: { url: '//www.example.com/api' } })).toBe('??');
      // expect(this.shared.requestFilter({ config: { url: 'example.com/api' } })).toBe(false);
      // expect(this.shared.requestFilter({ config: { url: '//other.api.com/api?url=example.com' } })).toBe(false);
      // expect(this.shared.requestFilter({ config: { url: '//other.api.com/api?url=example.com' } })).toBe(false);
      // expect(this.shared.requestFilter({ config: { url: '//other.api.com/api?url=www.example.com' } })).toBe(false);
      // expect(this.shared.requestFilter({ config: { url: '//other.api.com/api?url=https://example.com' } })).toBe(false);
      // expect(this.shared.requestFilter({ config: { url: '//other.api.com/api?url=//example.com' } })).toBe(false);
    });

  });

});