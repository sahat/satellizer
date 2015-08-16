describe('SatellizerOauth', function() {

  beforeEach(module('satellizer'));

  beforeEach(inject(function($httpBackend, $location, $window, SatellizerConfig, SatellizerShared, SatellizerOauth) {
    this.$httpBackend = $httpBackend;
    this.$location = $location;
    this.$window = $window;
    this.config = SatellizerConfig;
    this.shared = SatellizerShared;
    this.oauth = SatellizerOauth;
  }));

  describe('unlink()', function() {

    it('should be defined', function() {
      expect(this.oauth.unlink).toBeDefined();
    });

    it('should unlink a provider successfully', function() {
      var result;
      var provider = 'google';

      this.$httpBackend.expectPOST('/auth/unlink').respond(200);

      this.oauth.unlink(provider).then(function(response) {
        result = response;
      });

      this.$httpBackend.flush();

    });

    it('should unlink a provider and get an error', function() {
      var result;
      var provider = 'google';

      this.$httpBackend.expectPOST('/auth/unlink').respond(400);

      this.oauth.unlink(provider).catch(function(response) {
        result = response;
      });

      this.$httpBackend.flush();

      expect(result.status).toEqual(400);
    });

  });

});