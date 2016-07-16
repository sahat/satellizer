import Shared from '../src/shared';
import Storage from '../src/storage';
import Config from '../src/config';

let window;
let config;
let storage;
let shared;

describe('Shared', () => {

  beforeEach(angular.mock.inject(($q, $window, $log) => {
    window = $window;
    config = new Config();
    storage = new Storage($window, config);
    shared = new Shared($q, $window, $log, config, storage);
  }));

  afterEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  describe('logout()', () => {

    it('should be defined', () => {
      expect(shared.logout).toBeDefined();
    });

    it('should log out a user', () => {
      const storageType = config.storageType;
      const tokenName = [config.tokenPrefix, config.tokenName].join('_');
      window[storageType][tokenName] = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';
      shared.logout();
      expect(window[storageType][tokenName]).toBeFalsy();
    });

  });

  describe('getToken()', () => {

    it('should be defined', () => {
      expect(shared.getToken).toBeDefined();
    });

    it('should get a token from Local Storage', () => {
      const storageType = config.storageType;
      const tokenName = [config.tokenPrefix, config.tokenName].join('_');
      window[storageType][tokenName] = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';
      expect(shared.getToken()).toEqual(window[storageType][tokenName]);
    });

  });

  describe('getPayload()', () => {

    it('should be defined', () => {
      expect(shared.getPayload).toBeDefined();
    });

    it('should get a JWT payload', () => {
      const storageType = config.storageType;
      const tokenName = [config.tokenPrefix, config.tokenName].join('_');
      window[storageType][tokenName] = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEyMzQ1Njc4OTAsIm5hbWUiOiJKb2huIERvZSJ9.kRkUHzvZMWXjgB4zkO3d6P1imkdp0ogebLuxnTCiYUU';
      const payload = shared.getPayload();
      expect(angular.isObject(payload)).toBe(true);
      expect(payload.name).toEqual('John Doe');
    });

    it('should get a JWT payload with non-english characters', () => {
      const storageType = config.storageType;
      const tokenName = [config.tokenPrefix, config.tokenName].join('_');
      window[storageType][tokenName] = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEyMzQ1Njc4OTAsIm5hbWUiOiJSb2LDqXJ0w6AgVGjDqcO0In0.sgREDWs78UYxIMDfa9cwYqvDgco3i_Ap4MUwmprZWN0';
      const payload = shared.getPayload();
      expect(angular.isObject(payload)).toBe(true);
      expect(payload.name).toEqual('Robértà Théô');
    });

    it('should return undefined if not a valid JWT', () => {
      const storageType = config.storageType;
      const tokenName = [config.tokenPrefix, config.tokenName].join('_');
      window[storageType][tokenName] = 'f0af717251950dbd4d73154fdf0a474a5c5119adad999683f5b450c460726aa';
      const payload = shared.getPayload();
      expect(payload).toBeUndefined();
    });

    it('should return undefined if token looks like JWT but is not valid', function () {
      const storageType = config.storageType;
      const tokenName = [config.tokenPrefix, config.tokenName].join('_');
      window[storageType][tokenName] = 'f0af717251950dbd4.d73154fdf0a474a5c5119ada.d999683f5b450c460726aa';
      const payload = shared.getPayload();
      expect(payload).toBeUndefined();
    });

  });

  describe('isAuthenticated()', () => {

    it('should be defined', () => {
      expect(shared.isAuthenticated).toBeDefined();
      expect(angular.isFunction(shared.isAuthenticated)).toBe(true);
    });

    it('should handle expired token', () => {
      const storageType = config.storageType;
      const tokenName = [config.tokenPrefix, config.tokenName].join('_');
      window[storageType][tokenName] = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiaWF0IjoxNDQ1NDEzODU5LCJleHAiOjE0NDU0MTM4NjR9.FWflFgVTYu4riXLDzOAx9xy1x-qYyzwi09oN_pmoLcg';
      expect(shared.isAuthenticated()).toBe(false);
    });

    it('should work with non-JWT token', () => {
      const storageType = config.storageType;
      const tokenName = [config.tokenPrefix, config.tokenName].join('_');
      window[storageType][tokenName] = 'foo.bar.baz';
      expect(shared.isAuthenticated()).toBe(true);
    });

  });

  describe('setToken()', () => {

    it('should gracefully return without a response param', () => {
      const storageType = config.storageType;
      const tokenName = [config.tokenPrefix, config.tokenName].join('_');
      shared.setToken();
      expect(window[storageType][tokenName]).toBeUndefined();
    });

    it('should set the token when tokenRoot is provided', () => {
      const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJsb…YzMn0.YATZN37JENCQWeNAoN4M7KxJl7OAIJL4ka_fSM_gYkE';
      const response = {
        data: {
          foo: {
            bar: {
              token: token
            }
          }
        }
      };
      config.tokenRoot = 'foo.bar';
      shared.setToken(response);
      expect(token).toEqual(shared.getToken());
    });

    it('should set string access_token', () => {
      const storageType = config.storageType;
      const tokenName = [config.tokenPrefix, config.tokenName].join('_');
      const response = { access_token: 'test' };
      shared.setToken(response);
      expect(window[storageType][tokenName]).toBe('test');
    });

    it('should set object access_token', () => {
      const storageType = config.storageType;
      const tokenName = [config.tokenPrefix, config.tokenName].join('_');
      const response = {
        access_token: {
          data: {
            token: 'access_token_object_test'
          }
        }
      };
      shared.setToken(response);
      expect(window[storageType][tokenName]).toBe('access_token_object_test');
    });

    it('should gracefully return if no token is passed in', () => {
      const storageType = config.storageType;
      const tokenName = [config.tokenPrefix, config.tokenName].join('_');
      delete window[storageType][tokenName];
      const response = {
        access_token: {
          data: {}
        }
      };
      shared.setToken(response);
      expect(window[storageType][tokenName]).toBeUndefined();
    });

  });

  describe('removeToken()', () => {

    it('should be defined', () => {
      expect(shared.removeToken).toBeDefined();
    });

    it('should remove a token', () => {
      const storageType = config.storageType;
      const tokenName = [config.tokenPrefix, config.tokenName].join('_');
      window[storageType][tokenName] = 'f0af717251950dbd4d73154fdf0a474a5c5119adad999683f5b450c460726aa';
      shared.removeToken();
      expect(window[storageType][tokenName]).toBeUndefined();
    });

  });

  describe('setStorageType()', () => {

    it('should be defined', () => {
      expect(shared.setStorageType).toBeDefined();
    });

    it('should be able to set storage type to session storage', () => {
      shared.setStorageType('sessionStorage');
      expect(config.storageType).toBe('sessionStorage');
    });

  });

});
