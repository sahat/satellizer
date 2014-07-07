describe('service', function() {
  beforeEach(module('ngAuth'));


  describe('version', function() {
    it('should return current version', inject(function(ngAuth) {
      console.log(ngAuth);
      expect(2+2).toEqual(4);
    }));
  });
});