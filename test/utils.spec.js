describe('satellizer.utils', function() {

  beforeEach(module('satellizer'));

  beforeEach(inject(['satellizer.utils', '$http', function(utils, $http) {
    this.utils = utils;
    this.$http = $http;
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

  describe('request()', function() {

    it('should be defined', function() {
      expect(this.utils.request).toBeDefined();
    });

    it('should append data for get request', function() {
      spyOn(this.$http, 'get');
      this.utils.request('get', '/my/url', {a: 1}, {});

      expect(this.$http.get).toHaveBeenCalledWith('/my/url?a=1', {});
    });

    it('should proxy to $http for other request method', function() {
      spyOn(this.$http, 'post');
      this.utils.request('post', '/my/url', {a: 1}, {});

      expect(this.$http.post).toHaveBeenCalledWith('/my/url', {a: 1}, {});
    });
  });

});

