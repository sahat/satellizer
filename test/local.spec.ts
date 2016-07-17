import Local from '../src/local';
import Shared from '../src/shared';
import Storage from '../src/storage';
import Config from '../src/config';

let httpBackend;
let location;
let window;
let config;
let storage;
let shared;
let local;

describe('Local', () => {

  beforeEach(angular.mock.inject(($q, $http, $window, $log, $httpBackend, $location) => {
    httpBackend = $httpBackend;
    location = $location;
    window = $window;
    config = new Config();
    storage = new Storage($window, config);
    shared = new Shared($q, $window, $log, config, storage);
    local = new Local($http, config, shared);
  }));

  afterEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  describe('login()', () => {

    it('should be defined', () => {
      expect(local.login).toBeDefined();
    });

    it('should return a user object on successful login', () => {
      let result = null;
      const user = { email: 'john@email.com', password: 'password' };
      const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjp7Il9pZCI6IjUzZjYxZTEwNmZjNjFhNmMxM2I1Mjc4ZCIsImVtYWlsIjoic2FoYXQ_QG1lLmNvbSIsIl9fdiI6MH0sImlhdCI6MTQwODgyMTA5MTY3NiwiZXhwIjoxNDA5NDI1ODkxNjc2fQ.0l-ql-ZVjHiILMcMegNb3bNqapt3TZwjHy_ieduioiQ';

      httpBackend.expectPOST(config.loginUrl).respond({ token: token });

      local.login(user).then((response) => {
        result = response.data.token;
      });

      httpBackend.flush();

      expect(shared.isAuthenticated()).toBe(true);
      expect(result).toEqual(token);
    });

    it('should fail login with incorrect credentials', () => {
      let result = null;
      const user = { email: 'foo@bar.com', password: 'invalid' };

      httpBackend.expectPOST(config.loginUrl).respond(401, 'Wrong email or password');

      local.login(user).catch((response) => {
        result = response.data;
      });

      httpBackend.flush();

      expect(shared.isAuthenticated()).toBe(false);
      expect(result).toEqual('Wrong email or password');
    });

  });

  describe('signup()', () => {

    it('should have a signup function', () => {
      expect(local.signup).toBeDefined();
      expect(angular.isFunction(local.signup)).toBe(true);
    });

    it('should create a new user', () => {
      let result = null;
      const user = { email: 'john@email.com', password: '1234' };
      const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjp7Il9pZCI6IjUzZjYxZTEwNmZjNjFhNmMxM2I1Mjc4ZCIsImVtYWlsIjoic2FoYXQ_QG1lLmNvbSIsIl9fdiI6MH0sImlhdCI6MTQwODgyMTA5MTY3NiwiZXhwIjoxNDA5NDI1ODkxNjc2fQ.0l-ql-ZVjHiILMcMegNb3bNqapt3TZwjHy_ieduioiQ';

      httpBackend.expectPOST(config.signupUrl).respond({ token: token });

      local.signup(user).then((response) => {
        result = response.data.token;
      });

      httpBackend.flush();

      expect(result).toEqual(token);
    });

    it('should be able to handle signup errors', () => {
      let result = null;
      const user = { email: 'foo@bar.com', password: '1234' };

      httpBackend.expectPOST(config.signupUrl).respond(400);

      local.signup(user).catch(() => {
        result = false;
      });

      httpBackend.flush();

      expect(result).toBe(false);
    });

  });

});
