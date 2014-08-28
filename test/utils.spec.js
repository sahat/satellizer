describe('satellizer.utils', function() {

  beforeEach(module('satellizer'));

  beforeEach(inject(['satellizer.utils', function(utils) {
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

});

