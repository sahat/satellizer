describe('Configuration', function() {
  beforeEach(module('ngAuth'));

  it('should have a login function', inject(function($auth) {
    expect(angular.isFunction($auth.login)).toBe(true);
  }));

  it('should have a login function', inject(function($auth) {
    var loginWithoutParams = function() {
      $auth.login();
    };
    expect(loginWithoutParams).toThrow();
  }));


});

