describe('satellizer.shared', function() {

  beforeEach(module('satellizer'));

  beforeEach(inject(['$httpBackend', '$location', '$window', 'satellizer.shared', 'satellizer.config',
    function($httpBackend, $location, $window, shared, config) {
      this.$httpBackend = $httpBackend;
      this.$location = $location;
      this.$window = $window;
      this.shared = shared;
      this.config = config;
    }]));


  describe('logout()', function() {

    it('should be defined', function() {
      expect(this.shared.logout).toBeDefined();
    });

    it('should log out a user', function() {
      var token = [this.config.tokenPrefix, this.config.tokenName].join('_');
      this.shared.logout();
      expect(this.$window.localStorage[token]).toBeUndefined();
      expect(this.$location.path()).toEqual(this.config.logoutRedirect);
    });

  });

  describe('isAuthenticated()', function() {

    it('should be defined', function() {
      expect(this.shared.isAuthenticated).toBeDefined();
      expect(angular.isFunction(this.shared.isAuthenticated)).toBe(true);
    });

  });

});