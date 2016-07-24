import Config from '../src/config';
import Storage from '../src/storage';
import Shared from '../src/shared';
import Popup from '../src/popup';
import OAuth1 from '../src/oauth1';
import OAuth2 from '../src/oauth2';
import OAuth from '../src/oauth';
import Local from '../src/local';
import AuthProvider from '../src/authProvider';

let window;
let http;
let httpBackend;
let config;
let authProvider;
let storage;
let shared;
let popup;
let oauth1;
let oauth2;
let oauth;
let local;
let auth;
const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjp7Il9pZCI6IjUzZTU3ZDZiY2MzNmMxNTgwNzU4NDJkZCIsImVtYWlsIjoiZm9vQGJhci5jb20iLCJfX3YiOjB9LCJpYXQiOjE0MDc1NDg3ODI5NzMsImV4cCI6MTQwODE1MzU4Mjk3M30.1Ak6mij5kfkSi6d_wtPOx4yK7pS7ZFSiwbkL7AJbnYs';

describe('AuthProvider', () => {

  beforeEach(() => {
    config = new Config();
    authProvider = new AuthProvider(config);
  });

  beforeEach(angular.mock.inject(($q, $http, $window, $interval, $log, $timeout, $httpBackend) => {
    window = $window;
    http = $http;
    httpBackend = $httpBackend;
    storage = new Storage($window, config);
    shared = new Shared($q, $window, $log, config, storage);
    popup = new Popup($interval, $window, $q);
    oauth1 = new OAuth1($http, $window, config, popup);
    oauth2 = new OAuth2($http, $window, $timeout, $q, config, popup, storage);
    oauth = new OAuth($http, $window, $timeout, $q, config, popup, storage, shared, oauth1, oauth2);
    local = new Local($http, config, shared);
    auth = authProvider.$get(shared, local, oauth);
  }));

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

  describe('$auth service', () => {

    it('should be defined', () => {
      expect(auth).toBeDefined();
    });

    describe('authenticate()', () => {

      it('should be defined', () => {
        expect(auth.authenticate).toBeDefined();
      });

      it('should authenticate', () => {
        spyOn(oauth, 'authenticate');
        auth.authenticate('facebook');
        expect(oauth.authenticate).toHaveBeenCalled();
      });

    });

    describe('isAuthenticated()', () => {

      it('should be defined', () => {
        expect(auth.isAuthenticated).toBeDefined();
      });

      it('should check if user is authenticated', () => {
        const storageType = config.storageType;
        const tokenName = [config.tokenPrefix, config.tokenName].join('_');
        window[storageType][tokenName] = token;
        expect(auth.isAuthenticated()).toBe(true);
      });

    });

    describe('getToken()', () => {

      it('should be defined', () => {
        expect(auth.getToken).toBeDefined();
      });

      it('should get token', () => {
        const storageType = config.storageType;
        const tokenName = [config.tokenPrefix, config.tokenName].join('_');
        window[storageType][tokenName] = token;
        expect(auth.getToken()).toEqual(window[storageType][tokenName]);
      });

    });

    describe('setToken()', () => {

      it('should be defined', () => {
        expect(auth.setToken).toBeDefined();
      });

      it('should set token', () => {
        const response = {
          data: {
            token: token
          }
        };
        auth.setToken(response);
        expect(token).toEqual(auth.getToken());
      });

    });

    describe('removeToken()', () => {

      it('should be defined', () => {
        expect(auth.removeToken).toBeDefined();
      });

      it('should remove token', () => {
        const storageType = config.storageType;
        const tokenName = [config.tokenPrefix, config.tokenName].join('_');
        window[storageType][tokenName] = token;
        auth.removeToken();
        expect(window.localStorage[tokenName]).toBeUndefined();
      });

    });

    describe('getPayload()', () => {

      it('should be defined', () => {
        expect(auth.getPayload).toBeDefined();
      });

      it('should get a JWT payload', () => {
        const storageType = config.storageType;
        const tokenName = [config.tokenPrefix, config.tokenName].join('_');
        window[storageType][tokenName] = token;
        const payload = auth.getPayload();
        expect(payload).toBeDefined();
        expect(angular.isObject(payload)).toBe(true);
      });

    });

    describe('link()', () => {

      it('should be defined', () => {
        expect(auth.link).toBeDefined();
      });

      it('should link third-party provider', () => {
        spyOn(oauth, 'authenticate');
        auth.link('facebook');
        expect(oauth.authenticate).toHaveBeenCalled();
      });

    });

    describe('unlink()', () => {

      it('should be defined', () => {
        expect(auth.unlink).toBeDefined();
      });

      it('should unlink third-party provider', () => {
        let result = null;

        httpBackend.expectPOST('/auth/unlink/').respond(200);

        auth.unlink('facebook').then((response) => {
          result = response.status;
        });

        httpBackend.flush();

        expect(result).toBe(200);
      });

    });

    describe('logout()', () => {

      it('should be defined', () => {
        expect(auth.logout).toBeDefined();
      });

      it('should log out a user', () => {
        const storageType = config.storageType;
        const tokenName = [config.tokenPrefix, config.tokenName].join('_');
        auth.logout();
        expect([storageType][tokenName]).toBeUndefined();
      });

    });

    describe('login()', () => {

      it('should be defined', () => {
        expect(auth.login).toBeDefined();
      });

      it('should be able to call login', function () {
        spyOn(local, 'login');
        const user = { email: 'foo@bar.com', password: '1234' };
        auth.login(user);
        expect(local.login).toHaveBeenCalled();
      });

      describe('signup()', () => {

        it('should be able to call signup', () => {
          spyOn(local, 'signup');
          const user = { email: 'foo@bar.com', password: '1234' };
          auth.signup(user);
          expect(local.signup).toHaveBeenCalled();
        });

      });

      describe('setStorageType()', () => {

        it('should be defined', () => {
          expect(auth.setStorageType).toBeDefined();
        });

        it('should set storage type', () => {
          auth.setStorageType('sessionStorage');
          expect(config.storageType).toBe('sessionStorage');
        });

      });

    });

  });

});
