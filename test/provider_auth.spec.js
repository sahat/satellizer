describe('satellizer.provider_auth', function() {

  beforeEach(module('satellizer'));

  beforeEach(inject(['$q', '$timeout','$httpBackend', '$location', '$window', 'satellizer.config', 'satellizer.shared', 'satellizer.provider_auth',
    function($q, $timeout, $httpBackend, $location, $window, config, shared, providerAuth) {
      this.$q = $q;
      this.$httpBackend = $httpBackend;
      this.$location = $location;
      this.$window = $window;
      this.config = config;
      this.shared = shared;
      this.$timeout = $timeout;
      this.providerAuth = providerAuth;
    }]));

  describe('definitions', function() {
    it('should define addStrategy()', function() {
      expect(this.providerAuth.addStrategy).toBeDefined();
    });

    it('should define resolveToStrategy()', function() {
      expect(this.providerAuth.resolveToStrategy).toBeDefined();
    });

    it('should define authenticate()', function() {
      expect(this.providerAuth.authenticate).toBeDefined();
    });
  });

  describe('implementation', function() {

    beforeEach(function() {
      var $q = this.$q;
      this.mockStrategy = new function() {
        var mock = {};

        mock.id = 'mock';

        mock.open = function(options, userData) {
          return $q.when({data: {tokenRoot: { access_token: 'foo' }}});
        };

        mock.applies = function(provider_config) {
          return provider_config.type === mock.id;
        };
        return mock;
      };

      this.anotherMockStrategy = new function() {
        var mock = {};

        mock.id = 'another';

        mock.open = function(options, userData) {
          return $q.when({data: {tokenRoot: { access_token: 'bar' }}});
        };
        mock.applies = function(provider_config) {
          return provider_config.type === mock.id;
        };
        return mock;
      };

      this.config.providers = {
        mockProvider: {
          type: 'mock'
        },
        anotherMockProvider: {
          type: 'another'
        },
        noGoProvider: {
          type: 'unknown'
        }
      };

      this.providerAuth.addStrategy(this.mockStrategy);
      this.providerAuth.addStrategy(this.anotherMockStrategy);
    });


    describe('resolveToStrategy()', function() {
      beforeEach(function() {
        spyOn(this.providerAuth, 'resolveToStrategy').andCallThrough();
      });

      it('should resolve correctly, given legit config', function() {
        expect(
          this.providerAuth.resolveToStrategy(this.config.providers['mockProvider']).id
        ).toEqual('mock')
      });

      it('should resolve correctly, given unknown config', function() {
        expect(
          this.providerAuth.resolveToStrategy({type: 'unknown'})
        ).toBeNull();
      });
    });

    describe('authenticate()', function() {
      beforeEach(function() {
        spyOn(this.providerAuth, 'resolveToStrategy').andCallThrough();
        this.providerAuth.authenticate('mockProvider', false, {});
      });

      it('should call resolveToStrategy()', function() {
        expect(this.providerAuth.resolveToStrategy).toHaveBeenCalled();
      });

      it('should make a check with applies()', function() {
        spyOn(this.mockStrategy, 'applies').andCallThrough();
        this.providerAuth.resolveToStrategy(this.config.providers.mockProvider);
        expect(this.mockStrategy.applies).toHaveBeenCalled();
      });

      it('should deliver token, given legit config', function() {
        var holder = {
          assertToken: function(response) {
            expect(response.data.tokenRoot.access_token).toBe('foo')
          }
        };
        spyOn(holder, 'assertToken').andCallThrough();

        this.providerAuth.authenticate('mockProvider', false, {}).then(holder.assertToken);
        this.$timeout.flush();

        expect(holder.assertToken).toHaveBeenCalled();
      });

      it('should fail, given unknown config', function() {
        var holder = {
          handleError: function(response) {
            expect(response).toMatch(/Failed to resolve/);
          }
        };
        spyOn(holder, 'handleError').andCallThrough();

        this.providerAuth.authenticate('noGoProvider', false, {}).catch(holder.handleError);
        this.$timeout.flush();

        expect(holder.handleError).toHaveBeenCalled();
      });
    });
  });



});