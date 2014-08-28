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
    expect(this.$authProvider.logoutRedirect).toEqual('/signout');
  });

  it('should set loginRedirect', function() {
    this.$authProvider.loginRedirect = '/signin';
    expect(this.config.loginRedirect).toEqual('/signin');
    expect(this.$authProvider.loginRedirect).toEqual('/signin');
  });

  it('should set signupRedirect', function() {
    this.$authProvider.signupRedirect = '/newurl';
    expect(this.config.signupRedirect).toEqual('/newurl');
    expect(this.$authProvider.signupRedirect).toEqual('/newurl');
  });

  it('should set loginUrl', function() {
    this.$authProvider.loginUrl = '/api/signin';
    expect(this.config.loginUrl).toEqual('/api/signin');
    expect(this.$authProvider.loginUrl).toEqual('/api/signin');
  });

  it('should set signupUrl', function() {
    this.$authProvider.signupUrl = '/api/signup';
    expect(this.config.signupUrl).toEqual('/api/signup');
    expect(this.$authProvider.signupUrl).toEqual('/api/signup');
  });

  it('should set loginRoute', function() {
    this.$authProvider.loginRoute = '/signin';
    expect(this.config.loginRoute).toEqual('/signin');
    expect(this.$authProvider.loginRoute).toEqual('/signin');
  });

  it('should set signupRoute', function() {
    this.$authProvider.signupRoute = '/register';
    expect(this.config.signupRoute).toEqual('/register');
    expect(this.$authProvider.signupRoute).toEqual('/register');
  });

  it('should set tokenName', function() {
    this.$authProvider.tokenName = 'access_token';
    expect(this.config.tokenName).toEqual('access_token');
    expect(this.$authProvider.tokenName).toEqual('access_token');
  });

  it('should set tokenPrefix', function() {
    this.$authProvider.tokenPrefix = 'myApp';
    expect(this.config.tokenPrefix).toEqual('myApp');
    expect(this.$authProvider.tokenPrefix).toEqual('myApp');
  });

  it('should set unlinkUrl', function() {
    this.$authProvider.unlinkUrl = '/disconnect/';
    expect(this.config.unlinkUrl).toEqual('/disconnect/');
    expect(this.$authProvider.unlinkUrl).toEqual('/disconnect/');
  });

  it('should update facebook with new params', function() {
    this.$authProvider.facebook({ clientId: '1234' });
    expect(this.config.providers.facebook.clientId).toBe('1234');
  });

  it('should update googlewith new params', function() {
    this.$authProvider.google({ state: 'secret' });
    expect(this.config.providers.google.state).toBe('secret');
  });

  it('should update github with new params', function() {
    this.$authProvider.github({ clientId: '1234' });
    expect(this.config.providers.github.clientId).toBe('1234');
  });

  it('should update linkedin with new params', function() {
    this.$authProvider.linkedin({ state: 'secret' });
    expect(this.config.providers.linkedin.state).toBe('secret');
  });

  it('should update twitter with new params', function() {
    this.$authProvider.twitter({ url: '/api/twitter' });
    expect(this.config.providers.twitter.url).toBe('/api/twitter');
  });

  it('should create new oauth2 provider', function() {
    this.$authProvider.oauth2({ name: 'instagram', url: '/auth/instagram' });
    expect(this.config.providers['instagram'].name).toBe('instagram');
    expect(this.config.providers['instagram'].url).toBe('/auth/instagram');
  });

  it('should add a new oauth1 provider', function() {
    this.$authProvider.oauth1({ name: 'goodreads', url: '/auth/goodreads' });
    expect(this.config.providers['goodreads'].url).toBe('/auth/goodreads');
  });

});

