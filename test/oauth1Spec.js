describe('OAuth 1.0 Login', function() {

  var $auth, Oauth1, $httpBackend, $interval;

  beforeEach(module('Satellizer'));

  beforeEach(inject(function(_$auth_, _Oauth1_, _$httpBackend_, _$interval_) {
    $auth = _$auth_;
    Oauth1 = _Oauth1_;
    $httpBackend = _$httpBackend_;
    $interval = _$interval_;
  }));

  it('should have open function', function() {
    expect(Oauth1.open).toBeDefined();
    expect(angular.isFunction(Oauth1.open)).toBe(true);
  });

  it('should start the oauth1 flow', function() {
    Oauth1.open();
    expect(Oauth1.open).toBeDefined();
  });

  it('should exchange oauth for token', function() {
    var oauthData = 'oauth_token=hNDG4EmuJWPhqwJPrb0296aQaRKxInJ655Sop391BQ&oauth_verifier=SXkKIEPedLTGFwtDnU5kq1rhBPryIetlHSXcaQYLPc';


    Oauth1.open({
      url: '/auth/twitter',
      authorizationEndpoint: 'https://api.twitter.com/oauth/authenticate',
      type: 'oauth1'
    });

    Oauth1.exchangeForToken(oauthData);

    expect(Oauth1.exchangeForToken).toBeDefined()
  });
});

