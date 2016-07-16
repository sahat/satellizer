import Config from '../src/config';
import Storage from '../src/storage';

let config;
let storage;

describe('Storage', () => {

  beforeEach(angular.mock.inject(($q) => {
    config = new Config();
    storage = new Storage($q, config);
  }));

  it('should save token to local storage', () => {
    storage.set('token', 'foo');
    expect(storage.get('token')).toEqual('foo');
  });

  it('should remove token to local storage', () => {
    storage.remove('token');
    expect(storage.get('token')).toBeUndefined();
  });

  it('should save token to session storage', () => {
    config.storageType = 'sessionStorage';
    storage.set('token', 'foo');
    expect(storage.get('token')).toEqual('foo');
  });

  it('should remove token to session storage', () => {
    config.storageType = 'sessionStorage';
    storage.remove('token');
    expect(storage.get('token')).toBeUndefined();
  });

});
