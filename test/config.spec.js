describe('satellizer.config', function() {

  beforeEach(function() {
    var self = this;
    module('satellizer', function($authProvider) {
      self.$authProvider = $authProvider;
    })
  });

  beforeEach(inject(['satellizer.config', function(config) {
    this.config = config;
  }]));


  it('should set logoutRedirect', function() {
    this.$authProvider.logoutRedirect = '/signout';
    expect(this.config.logoutRedirect).toEqual('/signout');
  });

  it('should set loginRedirect', function() {
    this.$authProvider.loginRedirect = '/signin';
    expect(this.config.loginRedirect).toEqual('/signin');
  });

  it('should set signupRedirect', function() {
    this.$authProvider.signupRedirect = '/newurl';
    expect(this.config.signupRedirect).toEqual('/newurl');
  });

  it('should set loginUrl', function() {
    this.$authProvider.loginUrl = '/api/signin';
    expect(this.config.loginUrl).toEqual('/api/signin');
  });

  it('should set signupUrl', function() {
    this.$authProvider.signupUrl = '/api/signup';
    expect(this.config.signupUrl).toEqual('/api/signup');
  });

  it('should set loginRoute', function() {
    this.$authProvider.loginRoute = '/signin';
    expect(this.config.loginRoute).toEqual('/signin');
  });

  it('should set signupRoute', function() {
    this.$authProvider.signupRoute = '/register';
    expect(this.config.signupRoute).toEqual('/register');
  });

  it('should set tokenName', function() {
    this.$authProvider.tokenName = 'access_token';
    expect(this.config.tokenName).toEqual('access_token');
  });

  it('should set tokenPrefix', function() {
    this.$authProvider.tokenPrefix = 'myApp';
    expect(this.config.tokenPrefix).toEqual('myApp');
  });

  it('should set unlinkUrl', function() {
    this.$authProvider.unlinkUrl = '/disconnect/';
    expect(this.config.unlinkUrl).toEqual('/disconnect/');
  });

  it('should have facebook method', function() {
    expect(this.$authProvider.facebook).toBeDefined();
  });

  it('should have google method', function() {
    expect(this.$authProvider.google).toBeDefined();
  });

  it('should have linkedin method', function() {
    expect(this.$authProvider.linkedin).toBeDefined();
  });

  it('should have twitter method', function() {
    expect(this.$authProvider.twitter).toBeDefined();
  });

  it('should have oauth1', function() {
    expect(this.$authProvider.oauth1).toBeDefined();
  });

  it('should have oauth2 method', function() {
    expect(this.$authProvider.oauth2).toBeDefined();
  });


  it('should update a facebook provider with new params', function() {
    this.$authProvider.facebook({
      scope: 'profile'
    });
    expect(this.config.providers.facebook.scope).toBe('profile');
  });

  it('should update a google provider with new params', function() {
    this.$authProvider.google({
      state: 'secret'
    });
    expect(this.config.providers.google.state).toBe('secret');
  });

  it('should update a github provider with new params', function() {
    this.$authProvider.github({
      scope: 'email'
    });
    expect(this.config.providers.github.scope).toBe('email');
  });

  it('should update a linkedin provider with new params', function() {
    this.$authProvider.linkedin({
      state: 'secret'
    });
    expect(this.config.providers.linkedin.state).toBe('secret');
  });

  it('should update a twitter provider with new params', function() {
    this.$authProvider.twitter({
      url: '/oauth/twitter'
    });
    expect(this.config.providers.twitter.url).toBe('/oauth/twitter');
  });

  it('should add a new oauth2 provider', function() {
    this.$authProvider.oauth2({
      name: 'github',
      url: '/auth/github',
      authorizationEndpoint: 'https://github.com/login/oauth/authorize'
    });
    expect(this.config.providers['github'].name).toBe('github');
  });

  it('should add a new oauth1 provider', function() {
    this.$authProvider.oauth1({
      name: 'goodreads',
      url: '/auth/goodreads'
    });
    expect(this.config.providers['goodreads'].url).toBe('/auth/goodreads');
  });

});

