describe('OAuth 1.0 Login', function() {

  var Utils;

  beforeEach(module('Satellizer'));

  beforeEach(inject(function(_Utils_) {
    Utils = _Utils_;
  }));

  it('should have parseQueryString method', function() {
    expect(Utils.parseQueryString).toBeDefined();
  });

  it('should parse a querystring', function() {
    var qs = 'hello=world&foo=bar';
    var obj = Utils.parseQueryString(qs);
    expect(obj).toEqual({
      hello: 'world',
      foo: 'bar'
    });
  });

});

