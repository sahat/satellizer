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
    'SatellizerConfig',
    'SatellizerLocal',
    'SatellizerShared',
    function($http, $httpBackend, $window, config, local, shared) {
      var mockResponse = {};

      this.$http = $http;
      this.$httpBackend = $httpBackend;
      this.$window = $window;
      this.config = config;
      this.local = local;
      this.shared = shared;

      $window.localStorage.clear();

      mockResponse[this.config.tokenName] = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjp7Il9pZCI6IjUzZTU3ZDZiY2MzNmMxNTgwNzU4NDJkZCIsImVtYWlsIjoiZm9vQGJhci5jb20iLCJfX3YiOjB9LCJpYXQiOjE0MDc1NDg3ODI5NzMsImV4cCI6MTQwODE1MzU4Mjk3M30.1Ak6mij5kfkSi6d_wtPOx4yK7pS7ZFSiwbkL7AJbnYs';
      $httpBackend.expectPOST(this.config.loginUrl).respond(mockResponse);
    }]));

  it('should handle the default Authorization header', function() {
    var self = this;

    this.local.login();
    this.$httpBackend.flush();

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
    this.$authProvider.authHeader = 'x-access-token';

    this.local.login();
    this.$httpBackend.flush();

    this.$httpBackend.expectGET('/some/arbitrary/endpoint', function(headers) {
      var token = headers[self.config.authHeader];
      expect(self.config.authHeader).toBe('x-access-token');
      expect(token).toBeDefined();
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
