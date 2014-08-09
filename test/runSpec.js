describe('Run block', function() {
  beforeEach(module('Satellizer'));

  it('should have a run function', inject(function(RunBlock) {
    expect(angular.isFunction(RunBlock.run)).toBe(true);
  }));

  it('should postMessage on oauth_verifier and oauth_token', inject(function($window, $location, $document, RunBlock) {
    $window.opener = {
      location: { origin: $window.location.origin },
      postMessage: function() {
        return this;
      }
    };
    $location.search({ oauth_token: 1234, oauth_verifier: 5678 });
    RunBlock.run();
    expect($location.search()).toEqual({ oauth_token: 1234, oauth_verifier: 5678 });
  }));



});