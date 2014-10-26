describe('$http', function() {

  beforeEach(function() {
    var self = this;
    module('satellizer', function($authProvider) {
      self.$authProvider = $authProvider;
    });
  });

  beforeEach(inject([
    '$http',
    '$httpBackend',
    '$window',
    'satellizer.config',
    'satellizer.local',
    'satellizer.shared',
    function($http, $httpBackend, $window, config, local, shared) {
      var mockResponse = {};

      this.$http = $http;
      this.$httpBackend = $httpBackend;
      this.$window = $window;
      this.config = config;
      this.local = local;
      this.shared = shared;

      $window.localStorage.clear();

      mockResponse[this.config.tokenName] = 'ABCDEFG123456';
      $httpBackend.expectPOST(this.config.loginUrl).respond(mockResponse);
    }]));

  it('should handle the default Authorization header', function() {
    var self = this;

    this.local.login()
    this.$httpBackend.flush()

    this.$httpBackend.expectGET('/some/arbitrary/endpoint', function(headers) {
      var token = headers[self.config.authHeader];
      expect(token).toBeDefined();
      expect(token).toMatch(/Bearer\s+\w+/);
      return headers;
    }).respond(200);

    this.$http.get('/some/arbitrary/endpoint');
    this.$httpBackend.flush();
  });

  it('should handle a custom header', function() {
    var self = this;
    this.$authProvider.authHeader = 'x-new-header';

    this.local.login()
    this.$httpBackend.flush()

    this.$httpBackend.expectGET('/some/arbitrary/endpoint', function(headers) {
      var token = headers[self.config.authHeader];
      expect(token).toBeDefined();
      expect(token).not.toMatch(/Bearer\s+\w+/);
      return headers;
    }).respond(200);

    this.$http.get('/some/arbitrary/endpoint');
    this.$httpBackend.flush();
  });

  afterEach(function() {
    this.shared.logout();
    this.$authProvider.authHeader = 'Authorization';
  });

});
