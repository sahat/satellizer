describe('satellizer.oauth1', function() {

  beforeEach(module('satellizer'));

  beforeEach(inject(['$httpBackend', '$interval', 'satellizer.Oauth1', function($httpBackend, $interval, Oauth1) {
    this.$httpBackend = $httpBackend;
    this.$interval = $interval;
    this.oauth1 = new Oauth1();
  }]));

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

  });

});

