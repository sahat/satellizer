describe('Configuration', function() {

  var authProvider;

  beforeEach(module('Satellizer', function($authProvider) {
    authProvider = $authProvider;
  }));

  it('$auth factory should be defined', inject(function($auth) {
    expect($auth).toBeDefined();
  }));

  it('should allow overriding logoutRedirect', inject(function($auth) {
    var reset = authProvider.logoutRedirect;
    authProvider.logoutRedirect = '/new_url';
    expect(authProvider.logoutRedirect).toEqual('/new_url');
    authProvider.logoutRedirect = reset;
  }));

  it('should allow overriding loginRedirect', function() {
    var reset = authProvider.loginRedirect;
    authProvider.loginRedirect = '/new_url';
    expect(authProvider.loginRedirect).toEqual('/new_url');
    authProvider.loginRedirect = reset;
  });

  it('should allow overriding loginUrl', function() {
    var reset = authProvider.loginUrl;
    authProvider.loginUrl = '/api/login';
    expect(authProvider.loginUrl).toEqual('/api/login');
    authProvider.loginUrl = reset;
  });

  it('should allow overriding signupUrl', function() {
    var reset = authProvider.signupUrl;
    authProvider.signupUrl = '/api/signup';
    expect(authProvider.signupUrl).toEqual('/api/signup');
    authProvider.signupUrl = reset;
  });

  it('should allow overriding signupRedirect', function() {
    var reset = authProvider.signupRedirect;
    authProvider.signupRedirect = '/new_url';
    expect(authProvider.signupRedirect).toEqual('/new_url');
    authProvider.signupRedirect = reset;
  });

  it('should allow overriding loginRoute', function() {
    var reset = authProvider.loginRoute;
    authProvider.loginRoute = '/sign_in';
    expect(authProvider.loginRoute).toEqual('/sign_in');
    authProvider.loginRoute = reset;
  });

  it('should allow overriding signupRoute', function() {
    var reset = authProvider.signupRoute;
    authProvider.signupRoute = '/register';
    expect(authProvider.signupRoute).toEqual('/register');
    authProvider.signupRoute = reset;
  });

  it('should allow overriding user', function() {
    var reset = authProvider.user;
    authProvider.user = 'user';
    expect(authProvider.user).toEqual('user');
    authProvider.user = reset;
  });

  it('should allow overriding tokenName', function() {
    var reset = authProvider.tokenName;
    authProvider.tokenName = 'access_token';
    expect(authProvider.tokenName).toEqual('access_token');
    authProvider.tokenName = reset;
  });

  it('should allow overriding tokenPrefix', function() {
    var reset = authProvider.tokenPrefix;
    authProvider.tokenPrefix = 'myapp';
    expect(authProvider.tokenPrefix).toEqual('myapp');
    authProvider.tokenPrefix = reset;
  });

  it('should allow overriding unlinkUrl', function() {
    var reset = authProvider.unlinkUrl;
    authProvider.unlinkUrl = '/disconnect/';
    expect(authProvider.unlinkUrl).toEqual('/disconnect/');
    authProvider.unlinkUrl = reset;
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

