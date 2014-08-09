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

  it('should open a new popup', inject(function(Popup) {
    var oauthData = null;
    var url = 'https://www.facebook.com/dialog/oauth';
    var open = function() {
      Popup.open(url).then(function(data) {
        oauthData = data;
        console.log(oauthData)
      });
    };
    expect(open).toBeDefined();
  }));




});

