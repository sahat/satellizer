import OAuth1 from '../src/oauth1';
import Config from '../src/config';
import Shared from '../src/shared';
import Storage from '../src/storage';
import Popup from '../src/popup';

let httpBackend;
let config;
let storage;
let shared;
let popup;
let oauth1;

describe('OAuth1', () => {

  beforeEach(angular.mock.inject(($q, $http, $window, $interval, $log, $httpBackend) => {
    httpBackend = $httpBackend;
    config = new Config();
    storage = new Storage($window, config);
    shared = new Shared($q, $window, $log, config, storage);
    popup = new Popup($interval, $window, $q);
    oauth1 = new OAuth1($http, $window, config, popup);
  }));

  afterEach(() => {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  describe('init()', () => {

    it('should be defined', () => {
      expect(oauth1.init).toBeDefined();
    });

    it('should work with a web browser', () => {
      let result = null;

      httpBackend.expectPOST('/auth/twitter').respond(200);

      oauth1.init(config.providers.twitter).then((response) => {
        result = response;
      });

      httpBackend.flush();
    });

  });

  describe('getRequestToken()', () => {

    it('should be defined', () => {
      expect(oauth1.getRequestToken).toBeDefined();
    });

    it('should get request token to initiate oauth 1.0 flow', () => {
      let result = null;

      Object.assign(oauth1.defaults, config.providers.twitter);

      httpBackend.expectPOST('/auth/twitter').respond(200, { request_token: 'qwerty' });

      oauth1.getRequestToken().then((response) => {
        result = response.data.request_token;
      });

      httpBackend.flush();

      expect(result).toBe('qwerty');
    });

  });

  describe('exchangeForToken()', () => {

    it('should be defined', () => {
      expect(oauth1.exchangeForToken).toBeDefined();
    });

    it('should exchange oauth_token and oauth_verifier for JWT token', () => {
      Object.assign(oauth1.defaults, config.providers.twitter);

      let result = null;
      const oauthData = {
        oauth_token: 'foo',
        oauth_verifier: 'bar'
      };

      httpBackend.expectPOST('/auth/twitter').respond(200, { token: 'jwt token' });

      oauth1.exchangeForToken(oauthData).then((response) => {
        result = response.data.token;
      });

      httpBackend.flush();

      expect(result).toBe('jwt token');
    });

  });

  describe('buildQueryString()', () => {

    it('should be defined', () => {
      expect(oauth1.buildQueryString).toBeDefined();
    });

    it('should build a query', () => {
      const querystring = oauth1.buildQueryString({ code: 'test1', client_id: 'test2', redirect_uri: 'test3' });
      expect(querystring).toBe('code=test1&client_id=test2&redirect_uri=test3');
    });

  });

});

