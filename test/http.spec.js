describe('$http', function() {

  beforeEach(function() {
    var _this = this;
    module('satellizer', function($authProvider) {
      _this.$authProvider = $authProvider;
    });
  });

  beforeEach(inject([
    '$httpBackend',
    '$auth',
    'satellizer.config',
    'satellizer.local',
    function($httpBackend, $auth, config, local) {
      var mockResponse = {};

      this.$httpBackend = $httpBackend;
      this.$auth = $auth;
      this.config = config;
      this.local = local;

      mockResponse[this.config.tokenName] = 'ABCDEFG123456';
      $httpBackend.expectPOST(this.config.loginUrl).respond(mockResponse);
    }]));

  it('should handle the default Authorization header', function() {
    var self = this;
    this.$authProvider.authHeader = 'Authorization';
    this.local.login()
      .then(function(response) {
        return response.config.headers;
      })
      .then(function(headers) {
        var token = headers[self.config.authHeader];
        expect(token).toBeDefined();
        expect(token).toMatch(/Bearer\s+\w+/);
      });

    this.$httpBackend.flush();
  });

  it('should handle a custom header', function() {
    var _this = this;
    this.$authProvider.authHeader = 'x-new-header';
    this.local.login()
      .then(function(response) {
        return response.config.headers;
      })
      .then(function(headers) {
        var token = headers[_this.config.authHeader];
        expect(token).toBeDefined();
        expect(token).not.toMatch(/Bearer\s+\w+/);
      });

    this.$httpBackend.flush();

    this.$authProvider.authHeader = 'Authorization';
  });

});
