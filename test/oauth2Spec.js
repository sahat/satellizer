describe('OAuth 2.0 Login', function() {
  var $auth, $httpBackend, Oauth2;

  beforeEach(module('Satellizer'));

  beforeEach(inject(function(_$auth_, _$httpBackend_, _Oauth2_) {
    $auth = _$auth_;
    $httpBackend = _$httpBackend_;
    Oauth2 = _Oauth2_;
  }));

  it('authenticate should be defined', function() {
    expect($auth.authenticate).toBeDefined();
    expect(angular.isFunction($auth.authenticate)).toBe(true);
  });

  it('should throw an error without provider name', function() {
    var authenticate = function() {
      $auth.authenticate();
    };
    expect(authenticate).toThrow();
  });

  it('should throw an error if provider name does not exist', function() {
    var authenticate = function() {
      $auth.authenticate('asdfqwerty');
    };
    expect(authenticate).toThrow();
  });

  it('should call open method', function() {
    Oauth2.open({
      url: '/auth/facebook',
      authorizationEndpoint: 'https://www.facebook.com/dialog/oauth',
      redirectUri: window.location.origin + '/',
      scope: 'email',
      requiredUrlParams: ['display'],
      display: 'popup',
      type: 'oauth2',

    });
    expect(Oauth2.open).toBeDefined();
  });



});

