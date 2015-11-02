describe('SatellizerOauth1', function() {

  beforeEach(module('satellizer'));

  beforeEach(inject(function($httpBackend, $interval, SatellizerOauth1, SatellizerConfig) {
    this.$httpBackend = $httpBackend;
    this.$interval = $interval;
    this.oauth1 = new SatellizerOauth1();
    this.config = SatellizerConfig;
  }));

  describe('open()', function() {

    it('should be defined', function() {
      expect(this.oauth1.open).toBeDefined();
    });

    it('should start the oauth 1.0 flow', function() {
      this.oauth1.open();
    });

  });

  describe('exchangeForToken()', function() {

    it('should be defined', function() {
      expect(this.oauth1.exchangeForToken).toBeDefined();
    });

    it('should exchange oauth_token and oauth_verifier for token', function() {
      this.oauth1.open({
        url: '/auth/twitter',
        authorizationEndpoint: 'https://api.twitter.com/oauth/authenticate'
      });

      var oauthData = {
        oauth_token: 'foo',
        oauth_verifier: 'bar'
      };

      this.oauth1.exchangeForToken(oauthData);
    });

    it('should work with cordova flag', function() {
      this.config.cordova = true;
      var result;

      this.$httpBackend.expectPOST('/auth/twitter').respond(200);

      this.oauth1.open({
        url: '/auth/twitter',
        authorizationEndpoint: 'https://api.twitter.com/oauth/authenticate',
        popupOptions: {}
      }).then(function(response) {
        result = response;
      });

      this.$httpBackend.flush();
      this.config.cordova = false;
    });

    it('should work with a web browser', function() {
      var result;

      this.$httpBackend.expectPOST('/auth/twitter').respond(200);

      this.oauth1.open({
        url: '/auth/twitter',
        authorizationEndpoint: 'https://api.twitter.com/oauth/authenticate'
      }).then(function(response) {
        result = response;
      });

      this.$httpBackend.flush();
    });

  });

  describe('buildQueryString()', function() {

    it('should be defined', function() {
      expect(this.oauth1.buildQueryString).toBeDefined();
    });

    it('should build a query', function() {
      var qs = this.oauth1.buildQueryString({ code: 'test1', client_id: 'test2', redirect_uri: 'test3' });
      expect(qs).toBe('code=test1&client_id=test2&redirect_uri=test3');
    });

  });

});

