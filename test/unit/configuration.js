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

  it('should have a config object', inject(function($auth) {
    expect(auth).toBeDefined();
  }));

  it('should have a setProvider property', inject(function($auth) {
    expect(authProvider.setProvider).toBeDefined();
  }));

});

