describe('Utils Service', function() {

  beforeEach(module('satellizer'));

  beforeEach(inject(['satellizer.utils', function(utils) {
    this.utils = utils;
  }]));

  it('should have parseQueryString method', function() {
    expect(this.utils.parseQueryString).toBeDefined();
  });

  it('should parse a querystring', function() {
    var qs = 'hello=world&foo=bar';
    var obj = this.utils.parseQueryString(qs);
    expect(obj).toEqual({
      hello: 'world',
      foo: 'bar'
    });
  });

});

