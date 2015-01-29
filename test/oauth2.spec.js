describe('satellizer.oauth2', function() {

  beforeEach(module('satellizer'));

  beforeEach(inject(['$httpBackend', '$interval', '$http', 'satellizer.Oauth2', function($httpBackend, $interval, $http, Oauth2) {
    this.$httpBackend = $httpBackend;
    this.$interval = $interval;
    this.$http = $http;
    this.oauth2 = new Oauth2();
  }]));

  describe('open()', function() {

    it('should be defined', function() {
      expect(this.oauth2.open).toBeDefined();
    });

    it('should start the oauth 2.0 flow', function() {
      this.oauth2.open();
    });

  });

  describe('exchangeForToken()', function() {

    it('should be defined', function() {
      expect(this.oauth2.exchangeForToken).toBeDefined();
    });

    it('should exchange code for token', function() {
      this.oauth2.open();
      this.oauth2.exchangeForToken('code=foo');
    });

    it('should post to url for exchange', function() {
      this.oauth2.open({
        url: '/auth/oauth2'
      });

      spyOn(this.$http, 'post');

      this.oauth2.exchangeForToken({a: 1});

      expect(this.$http.post).toHaveBeenCalledWith('/auth/oauth2', jasmine.any(Object), {withCredentials: true});
    });

    it('respect exchangeTokenMethod option', function() {
      this.oauth2.open({
        url: '/auth/oauth2',
        exchangeTokenMethod: 'patch'
      });

      spyOn(this.$http, 'patch');

      this.oauth2.exchangeForToken({a: 1});

      expect(this.$http.patch).toHaveBeenCalledWith('/auth/oauth2', jasmine.any(Object), {withCredentials: true});
    });

  });

});

