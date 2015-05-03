describe('satellizer.config', function() {

  beforeEach(function() {
    var self = this;
    module('satellizer', function($authProvider) {
      self.$authProvider = $authProvider;
    });
  });

  beforeEach(inject(['satellizer.config', function(config) {
    this.config = config;
  }]));

  it('should set httpInterceptor', function() {
    this.$authProvider.httpInterceptor = false;
    expect(this.config.httpInterceptor).toEqual(false);
    expect(this.$authProvider.httpInterceptor).toEqual(false);

    this.$authProvider.httpInterceptor = true;
  });

  it('should set withCredentials', function() {
    this.$authProvider.withCredentials = false;
    expect(this.config.withCredentials).toEqual(false);
    expect(this.$authProvider.withCredentials).toEqual(false);

    this.$authProvider.withCredentials = true;
  });

  it('should set unlinkMethod', function() {
    this.$authProvider.unlinkMethod = 'post';
    expect(this.config.unlinkMethod).toEqual('post');
    expect(this.$authProvider.unlinkMethod).toEqual('post');

    this.$authProvider.unlinkMethod = 'get';
  });

  it('should set httpInterceptor', function() {
    this.$authProvider.httpInterceptor = false;
    expect(this.config.httpInterceptor).toEqual(false);
    expect(this.$authProvider.httpInterceptor).toEqual(false);

    this.$authProvider.httpInterceptor = true;
  });

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

  it('should set authHeader', function() {
    var configDefault = this.$authProvider.authHeader;

    this.$authProvider.authHeader = 'x-new-header';
    expect(this.config.authHeader).toEqual('x-new-header');
    expect(this.$authProvider.authHeader).toEqual('x-new-header');

    this.$authProvider.authHeader = configDefault;
  });

  it('should get loginOnSignup', function() {
    this.$authProvider.loginOnSignup = true;
    expect(this.config.loginOnSignup).toEqual(true);
    expect(this.$authProvider.loginOnSignup).toEqual(true);
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

  it('should set tokenRoot', function() {
    this.$authProvider.tokenRoot = 'tokenRoot';
    expect(this.config.tokenRoot).toEqual('tokenRoot');
    expect(this.$authProvider.tokenRoot).toEqual('tokenRoot');
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

  it('should update google with new params', function() {
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

  it('should set platform', function() {
    this.$authProvider.platform = 'mobile';
    expect(this.config.platform).toEqual('mobile');
    expect(this.$authProvider.platform).toEqual('mobile');
  });

  it('should set authToken', function() {
    this.$authProvider.authToken = 'TOKEN';
    expect(this.config.authToken).toEqual('TOKEN');
    expect(this.$authProvider.authToken).toEqual('TOKEN');

    this.$authProvider.authToken = 'Bearer';
  });

  it('should set baseUrl', function() {
    this.$authProvider.baseUrl = '/api/v2/';
    expect(this.config.baseUrl).toEqual('/api/v2/');
    expect(this.$authProvider.baseUrl).toEqual('/api/v2/');

    this.$authProvider.baseUrl = '/';
  });

  it('should set storage', function() {
    this.$authProvider.storage = 'sessionStorage';
    expect(this.config.storage).toEqual('sessionStorage');
    expect(this.$authProvider.storage).toEqual('sessionStorage');

    this.$authProvider.storage = 'localStorage';
  });

});

