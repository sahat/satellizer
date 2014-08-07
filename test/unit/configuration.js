describe('Configuration', function() {

  var auth;
  var authProvider;

  beforeEach(module('Satellizer'));

  beforeEach(inject(function($auth) {
    auth = $auth;
  }));

  beforeEach(function() {
    angular.module('Satellizer').config(function($authProvider) {
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

});

