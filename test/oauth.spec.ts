import OAuth from '../src/oauth';
import OAuth1 from '../src/oauth1';
import OAuth2 from '../src/oauth2';
import Config from '../src/config';
import Shared from '../src/shared';
import Storage from '../src/storage';
import Popup from '../src/popup';

let httpBackend;
let config;
let storage;
let shared;
let popup;
let oauth;
let oauth1;
let oauth2;

describe('OAuth', () => {

  beforeEach(angular.mock.inject(($q, $http, $window, $interval, $log, $httpBackend, $timeout) => {
    httpBackend = $httpBackend;
    config = new Config();
    storage = new Storage($window, config);
    shared = new Shared($q, $window, $log, config, storage);
    popup = new Popup($interval, $window, $q);
    oauth1 = new OAuth1($http, $window, config, popup);
    oauth2 = new OAuth2($http, $window, $timeout, $q, config, popup, storage);
    oauth = new OAuth($http, $window, $timeout, $q, config, popup, storage, shared, oauth1, oauth2);
  }));

  afterEach(() => {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  describe('unlink()', () => {

    it('should be defined', () => {
      expect(oauth.unlink).toBeDefined();
    });

    it('should unlink a provider successfully', () => {
      let result = null;

      httpBackend.expectPOST(config.unlinkUrl).respond(200);

      oauth.unlink('google').then((response) => {
        result = response.status;
      });

      httpBackend.flush();

      expect(result).toBe(200);
    });

    it('should unlink a provider and get an error', () => {
      let result = null;

      httpBackend.expectPOST(config.unlinkUrl).respond(400);

      oauth.unlink('facebook').catch((response) => {
        result = response.status;
      });

      httpBackend.flush();

      expect(result).toEqual(400);
    });

  });

});
