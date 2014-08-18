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

  it('should have facebook method', function() {
    expect(authProvider.facebook).toBeDefined();
  });

  it('should have google method', function() {
    expect(authProvider.google).toBeDefined();
  });

  it('should have linkedin method', function() {
    expect(authProvider.linkedin).toBeDefined();
  });

  it('should have twitter method', function() {
    expect(authProvider.twitter).toBeDefined();
  });

  it('should have oauth1', function() {
    expect(authProvider.oauth1).toBeDefined();
  });

  it('should have oauth2 method', function() {
    expect(authProvider.oauth2).toBeDefined();
  });

  it('should update a facebook provider with new params', function() {
    authProvider.facebook({
      scope: 'profile'
    });
    expect(authProvider.providers.facebook.scope).toBe('profile');
  });

  it('should update a google provider with new params', function() {
    authProvider.google({
      state: 'secret'
    });
    expect(authProvider.providers.google.state).toBe('secret');
  });

  it('should update a linkedin provider with new params', function() {
    authProvider.linkedin({
      state: 'secret'
    });
    expect(authProvider.providers.linkedin.state).toBe('secret');
  });

  it('should update a twitter provider with new params', function() {
    authProvider.twitter({
      url: '/oauth/twitter'
    });
    expect(authProvider.providers.twitter.url).toBe('/oauth/twitter');
  });

  it('should add a new oauth2 provider', function() {
    authProvider.oauth2({
      name: 'github',
      url: '/auth/github',
      authorizationEndpoint: 'https://github.com/login/oauth/authorize'
    });
    expect(angular.isObject(authProvider.providers['github'])).toBe(true);
    expect(authProvider.providers['github'].name).toBe('github');
  });

  it('should add a new oauth1 provider', function() {
    authProvider.oauth1({
      name: 'goodreads',
      url: '/auth/goodreads',
    });
    expect(angular.isObject(authProvider.providers['goodreads'])).toBe(true);
    expect(authProvider.providers['goodreads'].url).toBe('/auth/goodreads');
  });

});

