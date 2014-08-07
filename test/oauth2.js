describe('OAuth 2.0 Login', function() {

  var auth;

  beforeEach(module('Satellizer'));

  beforeEach(inject(function($auth) {
    auth = $auth;
  }));

  it('authenticate should be defined', function() {
    expect(auth.authenticate).toBeDefined();
    expect(angular.isFunction(auth.authenticate)).toBe(true);
  });

  it('should throw an error without provider name', function() {
    var authNoParams = function() {
      auth.authenticate();
    };
    expect(authNoParams).toThrow();
  });


});

