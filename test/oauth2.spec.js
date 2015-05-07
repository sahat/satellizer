describe('satellizer.oauth2', function() {

  beforeEach(module('satellizer'));

  beforeEach(inject(['$httpBackend', '$interval', 'satellizer.Oauth2', function($httpBackend, $interval, Oauth2) {
    this.$httpBackend = $httpBackend;
    this.$interval = $interval;
    this.oauth2 = new Oauth2();
  }]));

  describe('open()', function() {

    it('should be defined', function() {
      expect(this.oauth2.open).toBeDefined();
    });

    it('should start the oauth 2.0 flow', function() {
      //this.oauth2.open();
    });

  });

  describe('exchangeForToken()', function() {

    it('should be defined', function() {
      //expect(this.oauth2.exchangeForToken).toBeDefined();
    });

    it('should exchange code for token', function() {
      //this.oauth2.open().pollPopup();
      //this.oauth2.exchangeForToken('code=foo');
    });

  });

  describe('buildQueryString()', function() {

    it('should be defined', function() {
      //expect(this.oauth2.buildQueryString).toBeDefined();
    });

    it('should URI-encode state value', function() {
      //this.oauth2.open({defaultUrlParams: ['state'], state: 'foo+bar'}).pollPopup();
      //expect(this.oauth2.buildQueryString()).toBe('state=foo%2Bbar');
    });

  });

});

