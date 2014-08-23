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

  it('should have a $auth object', function() {
    expect(auth).toBeDefined();
  });

  it('should allow overriding logoutRedirect', function() {
    authProvider.logoutRedirect = '/new_url';
    expect(authProvider.logoutRedirect).toEqual('/new_url');
    authProvider.logoutRedirect = '/';
  });

  it('should allow overriding loginRedirect', function() {
    authProvider.loginRedirect = '/new_url';
    expect(authProvider.loginRedirect).toEqual('/new_url');
    authProvider.loginRedirect = '/login';
  });

  it('should allow overriding loginUrl', function() {
    authProvider.loginUrl = '/api/login';
    expect(authProvider.loginUrl).toEqual('/api/login');
    authProvider.loginUrl = '/auth/login';
  });

  it('should allow overriding signupUrl', function() {
    authProvider.signupUrl = '/api/signup';
    expect(authProvider.signupUrl).toEqual('/api/signup');
    authProvider.signupUrl = '/auth/signup';
  });

  it('should allow overriding signupRedirect', function() {
    authProvider.signupRedirect = '/new_url';
    expect(authProvider.signupRedirect).toEqual('/new_url');
    authProvider.signupRedirect = '/login';
  });

  it('should allow overriding loginRoute', function() {
    authProvider.loginRoute = '/sign_in';
    expect(authProvider.loginRoute).toEqual('/sign_in');
    authProvider.loginRoute = '/login';
  });

  it('should allow overriding signupRoute', function() {
    authProvider.signupRoute = '/register';
    expect(authProvider.signupRoute).toEqual('/register');
    authProvider.signupRoute = '/signup';

  });

  it('should allow overriding user', function() {
    authProvider.user = 'user';
    expect(authProvider.user).toEqual('user');
  });

  it('should allow overriding tokenName', function() {
    authProvider.tokenName = 'satellizer_jwt';
    expect(authProvider.tokenName).toEqual('satellizer_jwt');
  });

  it('should allow overriding unlinkUrl', function() {
    authProvider.unlinkUrl = '/disconnect/';
    expect(authProvider.unlinkUrl).toEqual('/disconnect/');
    authProvider.unlinkUrl = '/auth/unlink/';
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

  it('should update a github provider with new params', function() {
    authProvider.github({
      scope: 'email'
    });
    expect(authProvider.providers.github.scope).toBe('email');
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
      url: '/auth/goodreads'
    });
    expect(angular.isObject(authProvider.providers['goodreads'])).toBe(true);
    expect(authProvider.providers['goodreads'].url).toBe('/auth/goodreads');
  });

});

