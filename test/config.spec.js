describe('SatellizerConfig', function() {

  beforeEach(function() {
    var self = this;
    module('satellizer', function($authProvider) {
      self.$authProvider = $authProvider;
    });
  });

  beforeEach(inject(function(SatellizerConfig, SatellizerShared) {
    this.config = SatellizerConfig;
    this.shared = SatellizerShared;
  }));

  it('should set httpInterceptor', function() {
    this.$authProvider.httpInterceptor = function() { return false; };
    expect(this.config.httpInterceptor()).toEqual(false);
    expect(this.$authProvider.httpInterceptor()).toEqual(false);
    this.$authProvider.httpInterceptor = function() { return true; };
  });

  it('should be able to use an httpInterceptor strategy function', function() {
    this.$authProvider.httpInterceptor = function(request) {
        return request.uri.indexOf('/api/') === 0;
    };
    expect(this.config.httpInterceptor({uri: '/api/endpoint'})).toEqual(true);
    expect(this.$authProvider.httpInterceptor({uri: '/somewhere/else'})).toEqual(false);
    this.$authProvider.httpInterceptor = true;
  });

  it('should set withCredentials', function() {
    this.$authProvider.withCredentials = false;
    expect(this.config.withCredentials).toEqual(false);
    expect(this.$authProvider.withCredentials).toEqual(false);
    this.$authProvider.withCredentials = true;
  });

  it('should set authHeader', function() {
    this.$authProvider.authHeader = 'x-auth-token';
    expect(this.config.authHeader).toEqual('x-auth-token');
    expect(this.$authProvider.authHeader).toEqual('x-auth-token');
    this.$authProvider.authHeader = 'Authorization';
  });

  it('should set loginUrl', function() {
    this.$authProvider.loginUrl = '/api/signin';
    expect(this.config.loginUrl).toEqual('/api/signin');
    expect(this.$authProvider.loginUrl).toEqual('/api/signin');
    this.$authProvider.loginUrl = '/auth/login';
  });

  it('should set signupUrl', function() {
    this.$authProvider.signupUrl = '/api/register';
    expect(this.config.signupUrl).toEqual('/api/register');
    expect(this.$authProvider.signupUrl).toEqual('/api/register');
    this.$authProvider.signupUrl = '/auth/signup';
  });

  it('should set tokenRoot', function() {
    this.$authProvider.tokenRoot = 'foo.bar.baz';
    expect(this.config.tokenRoot).toEqual('foo.bar.baz');
    expect(this.$authProvider.tokenRoot).toEqual('foo.bar.baz');
    this.$authProvider.tokenRoot = null;
  });

  it('should set tokenName', function() {
    this.$authProvider.tokenName = 'access_token';
    expect(this.config.tokenName).toEqual('access_token');
    expect(this.$authProvider.tokenName).toEqual('access_token');
    this.$authProvider.tokenName = 'token';
  });

  it('should set tokenPrefix', function() {
    this.$authProvider.tokenPrefix = 'myApp';
    expect(this.config.tokenPrefix).toEqual('myApp');
    expect(this.$authProvider.tokenPrefix).toEqual('myApp');
    this.$authProvider.tokenPrefix = 'satellizer';
  });

  it('should work without tokenPrefix', function() {
    this.$authProvider.tokenPrefix = null;
    expect(this.config.tokenPrefix).toBe(null);
    expect(this.$authProvider.tokenPrefix).toBe(null);
    this.$authProvider.tokenPrefix = 'satellizer';
  });

  it('should set unlinkUrl', function() {
    this.$authProvider.unlinkUrl = '/disconnect';
    expect(this.config.unlinkUrl).toEqual('/disconnect');
    expect(this.$authProvider.unlinkUrl).toEqual('/disconnect');
    this.$authProvider.unlinkUrl = '/auth/unlink';
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

  it('should set storageType', function() {
    this.$authProvider.storageType = 'sessionStorage';
    expect(this.config.storageType).toEqual('sessionStorage');
    expect(this.$authProvider.storageType).toEqual('sessionStorage');
    this.$authProvider.storageType = 'localStorage';
  });

});

