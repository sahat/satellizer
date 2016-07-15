import 'angular';
import 'angular-mocks';

import Config from '../src/config';
import AuthProvider from '../src/authProvider';

let config;
let authProvider;

describe('SatellizerConfig', () => {

  beforeEach(() => {
    config = new Config();
    authProvider = new AuthProvider(config);
  });

  it('should set baseUrl', () => {
    authProvider.baseUrl = '/api/v2/';
    expect(authProvider.baseUrl).toEqual('/api/v2/');
  });

  it('should set loginUrl', () => {
    authProvider.loginUrl = '/api/sign_in';
    expect(authProvider.loginUrl).toEqual('/api/sign_in');
  });

  it('should set signupUrl', () => {
    authProvider.signupUrl = '/api/register';
    expect(authProvider.signupUrl).toEqual('/api/register');
  });

  it('should set unlinkUrl', () => {
    authProvider.unlinkUrl = '/disconnect';
    expect(authProvider.unlinkUrl).toEqual('/disconnect');
  });

  it('should set tokenRoot', () => {
    authProvider.tokenRoot = 'deep.nested.object';
    expect(authProvider.tokenRoot).toEqual('deep.nested.object');
  });

  it('should set tokenName', () => {
    authProvider.tokenName = 'access_token';
    expect(authProvider.tokenName).toEqual('access_token');
  });

  it('should set tokenPrefix', () => {
    authProvider.tokenPrefix = 'myApp';
    expect(authProvider.tokenPrefix).toEqual('myApp');
  });

  it('should set tokenHeader', () => {
    authProvider.tokenHeader = 'x-auth-token';
    expect(authProvider.tokenHeader).toEqual('x-auth-token');
  });

  it('should set tokenType', () => {
    authProvider.tokenType = 'TOKEN';
    expect(authProvider.tokenType).toEqual('TOKEN');
  });

  it('should set withCredentials', () => {
    authProvider.withCredentials = false;
    expect(authProvider.withCredentials).toEqual(false);
  });

  it('should set storageType', () => {
    authProvider.storageType = 'sessionStorage';
    expect(authProvider.storageType).toEqual('sessionStorage');
  });

  it('should set httpInterceptor as a boolean', () => {
    authProvider.httpInterceptor = false;
    expect(authProvider.httpInterceptor()).toEqual(false);
  });

  it('should set httpInterceptor as a function', () => {
    authProvider.httpInterceptor = (request) => {
      return request.uri.indexOf('/api/') === 0;
    };
    expect(authProvider.httpInterceptor({ uri: '/somewhere/else' })).toEqual(false);
  });

  it('should set facebook with new params', () => {
    authProvider.facebook({ clientId: '1234' });
    expect(config.providers.facebook.clientId).toBe('1234');
  });

  it('should set google with new params', () => {
    authProvider.google({ state: 'secret' });
    expect(config.providers.google.state).toBe('secret');
  });

  it('should set github with new params', () => {
    authProvider.github({ clientId: '1234' });
    expect(config.providers.github.clientId).toBe('1234');
  });

  it('should set linkedin with new params', () => {
    authProvider.linkedin({ state: 'secret' });
    expect(config.providers.linkedin.state).toBe('secret');
  });

  it('should set twitter with new params', () => {
    authProvider.twitter({ url: '/api/twitter' });
    expect(config.providers.twitter.url).toBe('/api/twitter');
  });

  it('should create new OAuth 2.0 provider', () => {
    authProvider.oauth2({ name: 'instagram', url: '/auth/instagram' });
    expect(config.providers.instagram.name).toBe('instagram');
    expect(config.providers.instagram.url).toBe('/auth/instagram');
  });

  it('should create new OAuth 1.0 provider', () => {
    authProvider.oauth1({ name: 'goodreads', url: '/auth/goodreads' });
    expect(config.providers.goodreads.url).toBe('/auth/goodreads');
  });

});
