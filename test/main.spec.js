//= authInterceptor tests
// TODO: create a fake token and store it on localstorage
// TODO: Make sure it is set on HTTP Headers
// TODO: Make a fake 401 response and make sure $location is set to /login

describe('service', function() {
  beforeEach(module('ngAuth'));

  describe('version', function() {
    it('should return current version', inject(function(ngAuth) {
      console.log(ngAuth);
      expect(2+2).toEqual(4);
    }));
  });
});