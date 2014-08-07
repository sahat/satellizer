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
    var authenticate = function() {
      auth.authenticate();
    };
    expect(authenticate).toThrow();
  });

  it('should have addProvider method', function() {
    expect(authProvider.addProvider).toBeDefined();
  });

});

