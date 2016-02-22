describe('SatellizerUtils', function() {

  beforeEach(function() {
    var self = this;
    module('satellizer', function($authProvider) {
      self.$authProvider = $authProvider;
    });
  });


  beforeEach(inject(['SatellizerUtils', function(utils) {
    this.utils = utils;
  }]));

  describe('parseQueryString()', function() {

    it('should be defined', function() {
      expect(this.utils.parseQueryString).toBeDefined();
    });

    it('should parse a query string', function() {
      var qs = 'hello=world&foo=bar';
      var obj = this.utils.parseQueryString(qs);

      expect(obj).toEqual({ hello: 'world', foo: 'bar' });
    });
  });

  describe('camelCase()', function() {

    it('should be defined', function() {
      expect(this.utils.camelCase).toBeDefined();
    });

    it('should return camelized string', function() {
      var str = 'redirect_uri';
      expect(this.utils.camelCase(str)).toEqual('redirectUri');
    });
  });

  describe('joinUrl()', function() {

    it('should be defined', function() {
      expect(this.utils.joinUrl).toBeDefined();
    });

    it('should merge baseUrl with relative url', function() {
      var baseUrl = 'http://localhost:3000';
      var url = '/auth/facebook';
      expect(this.utils.joinUrl(baseUrl, url)).toEqual('http://localhost:3000/auth/facebook');
      this.$authProvider.baseUrl = null;
    });
  });

});

