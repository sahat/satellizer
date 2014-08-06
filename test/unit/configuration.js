describe('Configuration', function() {

  var auth;
  var authProvider;

  beforeEach(module('ngAuth'));

  beforeEach(inject(function($auth) {
    auth = $auth;
  }));

  beforeEach(function() {
    angular.module('ngAuth').config(function($authProvider) {
      authProvider = $authProvider;
    });
  });

  it('should have a config object', function() {
    expect(auth).toBeDefined();
  });

  it('should have setProvider method', function() {
    expect(authProvider.setProvider).toBeDefined();
  });

  it('should have addProvider method', function() {
    expect(authProvider.addProvider).toBeDefined();
  });

  it('should have logoutRedirect method', function() {
    expect(authProvider.logoutRedirect).toBeDefined();
    expect(angular.isFunction(authProvider.logoutRedirect)).toBe(true);
  });

  it('logoutRedirect should throw an error with no params', function() {
    expect(authProvider.logoutRedirect).toThrow();
  });

  it('logoutRedirect should only accept a string', function() {
    var logout = function() {
      authProvider.logoutRedirect(1234);
    };
    expect(logout).toThrow();
  });




});

