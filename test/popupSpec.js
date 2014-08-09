describe('Configuration', function() {

  beforeEach(module('Satellizer'));

  it('Popup should be defined', inject(function(Popup) {
    expect(Popup).toBeDefined();
  }));

  it('should add left and top offset options', inject(function(Popup) {
    var options = { width: 481, height: 269 };
    var preparedOptions = Popup.prepareOptions(options);
    expect(preparedOptions.left).toBeDefined();
    expect(preparedOptions.top).toBeDefined();
  }));

  it('should stringify popup options', inject(function(Popup) {
    var options = { width: 481, height: 269 };
    var stringOptions = Popup.stringifyOptions(options);
    expect(stringOptions).toBe('width=481,height=269');
  }));



  it('should open a new popup', inject(function(Popup) {
    var open = Popup.open('https://www.facebook.com/dialog/oauth');
    expect(angular.isObject(open)).toBe(true);
  }));
});

