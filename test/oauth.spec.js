describe('satellizer.oauth', function() {

  beforeEach(module('satellizer'));

  beforeEach(inject(['$httpBackend', '$location', '$window', 'satellizer.config', 'satellizer.shared', 'satellizer.oauth',
    function($httpBackend, $location, $window, config, shared, oauth) {
      this.$httpBackend = $httpBackend;
      this.$location = $location;
      this.$window = $window;
      this.config = config;
      this.shared = shared;
      this.oauth = oauth;
    }]));


  describe('unlink()', function() {

    it('should be defined', function() {
      expect(this.oauth.unlink).toBeDefined();
    });

    it('should unlink a provider successfully', function() {
      var result = null;
      var provider = 'google';
      var token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjp7Il9pZCI6IjUzZjYxZTEwNmZjNjFhNmMxM2I1Mjc4ZCIsImVtYWlsIjoic2FoYXRAbWUuY29tIiwiX192IjowfSwiaWF0IjoxNDA4ODIxMDkxNjc2LCJleHAiOjE0MDk0MjU4OTE2NzZ9.0l-ql-ZVjHiILMcMegNb3bNqapt3TZwjHy_ieduioiQ';

      this.$httpBackend.expectGET(this.config.unlinkUrl + provider).respond(200, { token: token });

      this.oauth.unlink(provider).then(function(response) {
        result = response;
      });

      this.$httpBackend.flush();

    });

    it('should unlink a provider and get an error', function() {
      var result = null;
      var provider = 'google';

      this.$httpBackend.expectGET(this.config.unlinkUrl + provider).respond(400);

      this.oauth.unlink(provider).catch(function(response) {
        result = response;
      });

      this.$httpBackend.flush();

      expect(result.status).toEqual(400);
    });

  });

});