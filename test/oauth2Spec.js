describe('OAuth 2.0 Login', function() {

  var auth;
  var httpBackend;

  beforeEach(module('Satellizer'));

  beforeEach(inject(function($auth, $httpBackend) {
    auth = $auth;
    httpBackend = $httpBackend;
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

  it('should throw an error if provider name does not exist', function() {
    var authenticate = function() {
      auth.authenticate('asdfqwerty');
    };
    expect(authenticate).toThrow();
  });

//  it('should sign in with facebook', function() {
//    var authenticate = function() {
//
//    };
//    console.log(auth.authenticate('facebook'))
//    expect(authenticate).toBe(true);
//  });



});

