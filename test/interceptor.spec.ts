import Config from '../src/config';
import Shared from '../src/shared';
import Storage from '../src/storage';
import Interceptor from '../src/interceptor';

let config;
let storage;
let shared;
let interceptor;

describe('Interceptor', () => {
  beforeEach(angular.mock.inject(($q, $window) => {
    config = new Config();
    storage = new Storage($window, config);
    shared = new Shared($q, $window, config, storage);
  }));

  describe('request()', () => {
    beforeEach(() => {
      interceptor = new Interceptor(config, shared, storage);
    });

    it('should be defined', () => {
      expect(interceptor.request).toBeDefined();
    });

    describe('not logged in', () => {
      it('should call httpInterceptor', () =>{
        spyOn(config, 'httpInterceptor');

        const fakeOptions = {};

        interceptor.request(fakeOptions);

        expect(config.httpInterceptor).not.toHaveBeenCalled();
      });
    });

    describe('logged in', () => {
      beforeEach(() => {
        shared.isAuthenticated = () => true;
        interceptor = new Interceptor(config, shared, storage);
      });

      it('should call httpInterceptor', () =>{
        spyOn(config, 'httpInterceptor');

        const fakeOptions = {
          url: 'https://github.com/gabrielperales'
        };

        interceptor.request(fakeOptions);

        expect(config.httpInterceptor).toHaveBeenCalled();
        expect(config.httpInterceptor).toHaveBeenCalledWith(fakeOptions);
      });
    });
  });
});
