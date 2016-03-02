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

  describe('getFullUrlPath()', function() {

    it('should be defined', function() {
      expect(this.utils.getFullUrlPath).toBeDefined();
    });

    it('should normalize full url from window.location', function() {
      var url1 = this.utils.getFullUrlPath({
        hash: '#/',
        host: 'localhost:3000',
        hostname: 'localhost',
        href: 'http://localhost:3000/#/',
        origin: 'http://localhost:3000',
        pathname: '/',
        port: '3000',
        protocol: 'http:',
        search: ''
      });
      var url2 = this.utils.getFullUrlPath({
        protocol: 'http:',
        hostname: 'google.com',
        port: '',
        pathname: '/test'
      });
      var url3 = this.utils.getFullUrlPath({
        protocol: 'https:',
        hostname: 'google.com',
        port: '',
        pathname: '/test'
      });
      expect(url1).toEqual('http://localhost:3000/');
      expect(url2).toEqual('http://google.com:80/test');
      expect(url3).toEqual('https://google.com:443/test');
    });

    it('should normalize full url from createElement("a")', function() {
      var urlElement = document.createElement('a');
      urlElement.href = 'http://d4507eb5.ngrok.io/#/';

      var url1 = this.utils.getFullUrlPath(urlElement);
      expect(url1).toEqual('http://d4507eb5.ngrok.io:80/');

      urlElement.href = 'https://google.com/test';
      var url2 = this.utils.getFullUrlPath(urlElement);
      expect(url2).toEqual('https://google.com:443/test');

      urlElement.href = 'http://localhost:3000/';
      var url3 = this.utils.getFullUrlPath(urlElement);
      expect(url3).toEqual('http://localhost:3000/');
    });
  });

});

