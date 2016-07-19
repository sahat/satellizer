import OAuth2 from '../src/oauth2';
import Config from '../src/config';
import Shared from '../src/shared';
import Storage from '../src/storage';
import Popup from '../src/popup';

let q;
let window;
let http;
let timeout;
let httpBackend;
let config;
let storage;
let shared;
let popup;
let oauth2;

describe('OAuth2', () => {

  beforeEach(angular.mock.inject(($q, $http, $window, $interval, $log, $timeout, $httpBackend) => {
    q = $q;
    http = $http;
    window = $window;
    timeout = $timeout;
    httpBackend = $httpBackend;
    config = new Config();
    storage = new Storage($window, config);
    shared = new Shared($q, $window, $log, config, storage);
    popup = new Popup($interval, $window, $q);
    oauth2 = new OAuth2($http, $window, $timeout, $q, config, popup, storage);
  }));

  afterEach(() => {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  describe('init()', () => {

    it('should be defined', () => {
      expect(oauth2.init).toBeDefined();
    });

    it('should open a popup window', () => {
      spyOn(window, 'open');
      oauth2.init(config.providers.github);

      timeout.flush();
      timeout.verifyNoPendingTasks();

      expect(window.open).toHaveBeenCalled();
    });

    it('should propagate promise rejections', () => {
      let result = null;
      const p = Promise.reject(new Error('The popup window was closed'));
      spyOn(popup, 'polling').and.returnValue(p);

      oauth2.init(config.providers.github).catch((err) => {
        result = err.message;
        expect(result).toEqual('The popup window was closed');
      });

      timeout.flush();
      timeout.verifyNoPendingTasks();

      expect(popup.polling).toHaveBeenCalled();
    });

  });

  describe('exchangeForToken()', () => {

    it('should be defined', () => {
      expect(oauth2.exchangeForToken).toBeDefined();
    });

    it('should exchange code for token', () => {
      let result = null;

      httpBackend.expectPOST('/').respond(200, { token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9' });

      oauth2.exchangeForToken({ code: '1234567890' }).then((response) => {
        result = response.data.token;
      });

      httpBackend.flush();

      expect('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9');
    });

    it('should exchange code for token with custom responseParams', () => {
      let result = null;
      const deferred = q.defer();
      spyOn(http, 'post').and.returnValue(deferred.promise);

      oauth2.defaults.clientId = 'asdf1234';
      oauth2.defaults.redirectUri = 'http://localhost/callback';
      oauth2.defaults.responseParams = {
        code: 'code',
        clientId: 'client_id',
        redirectUri: 'redirect_uri'
      };

      oauth2.exchangeForToken({ code: '1234567890' }).then((response) => {
        result = response.data.token;
      });

      expect(http.post).toHaveBeenCalledWith(
        '/',
        { code: '1234567890', client_id: 'asdf1234', redirect_uri: 'http://localhost/callback' },
        { withCredentials: false }
      );
    });

  });

  xdescribe('buildQueryString()', () => {
    it('should be defined', () => {
      expect(oauth2.buildQueryString).toBeDefined();
    });

    it('should URI-encode state value', () => {
      oauth2.open({ defaultUrlParams: ['state'], state: 'foo+bar' }).then(() => {
        expect(oauth2.buildQueryString()).toContain('state=foo%2Bbar');
      });

      timeout.flush();
      timeout.verifyNoPendingTasks();
    });

    it('should use scopePrefix if provided', () => {
      oauth2.open(config.providers.google)
        .then(() => {
          expect(oauth2.buildQueryString()).toContain('scope=openid profile email');
        });
      timeout.flush();
      timeout.verifyNoPendingTasks();
    });

    it('should remove redirect_uri if param redirectUrl is null', () => {
      const tempProvider = angular.copy(config.providers.google);
      tempProvider.redirectUri = null;
      oauth2.open(tempProvider)
        .then(() => {
          expect(oauth2.buildQueryString()).not.toContain('redirect_uri=');
        });
      this.$timeout.flush();
      this.$timeout.verifyNoPendingTasks();
    });

  });

  describe('camelCase()', () => {

    it('should be defined', () => {
      expect(OAuth2.camelCase).toBeDefined();
    });

    it('should return camelized string', () => {
      expect(OAuth2.camelCase('redirect_uri')).toEqual('redirectUri');
    });

  });

});

