describe('OAuth 2.0 Login', function() {

  var auth;
  var httpBackend;
  var oauth2;

  beforeEach(module('Satellizer'));

  beforeEach(inject(function($auth, $httpBackend, Oauth2) {
    auth = $auth;
    httpBackend = $httpBackend;
    oauth2 = Oauth2;
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

  it('should call open method', function() {
    oauth2.open({
      url: '/auth/facebook',
      authorizationEndpoint: 'https://www.facebook.com/dialog/oauth',
      redirectUri: window.location.origin + '/',
      scope: 'email',
      requiredUrlParams: ['display'],
      display: 'popup',
      type: 'oauth2',

    });
    expect(oauth2.open).toBeDefined();
  });



});

