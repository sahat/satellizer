describe('SatellizerPopup', function() {

  beforeEach(module('satellizer'));

  beforeEach(inject(['$q', '$window', '$interval', 'SatellizerPopup', function($q, $window, $interval, popup) {
    this.$q = $q;
    this.$window = $window;
    this.$interval = $interval;
    this.popup = popup;
  }]));

  it('should be defined', function() {
    expect(this.popup).toBeDefined();
  });

  it('should add left and top offset options', function() {
    var options = { width: 481, height: 269 };
    var preparedOptions = this.popup.prepareOptions(options);
    expect(preparedOptions.left).toBeDefined();
    expect(preparedOptions.top).toBeDefined();
  });

  it('should stringify popup options', function() {
    var options = { width: 481, height: 269 };
    var stringOptions = this.popup.stringifyOptions(options);
    expect(stringOptions).toBe('width=481,height=269');
  });

  it('should open a new popup', function() {
    var open = this.popup.open();
    this.$interval.flush(300);
    expect(angular.isObject(open)).toBe(true);
  });

  it('should poll popup', function() {
    var open = this.popup.pollPopup();
    this.$interval.flush(300);
    expect(angular.isObject(open)).toBe(true);
  });

  it('should handle the case when popup redirect has occured', function() {
    this.popup.popupWindow = {
      location: {
        host: document.location.host,
        search: '?code=foo_query',
        hash: '#code=foo_hash'
      }
    };
    var open = this.popup.pollPopup();
    this.$interval.flush(300);
    expect(angular.isObject(open)).toBe(true);
  });

  it('should handle the case when popup redirect has occured but no parameters are set', function() {
    this.popup.popupWindow = {
      location: {
        host: document.location.host
      }
    };
    var open = this.popup.pollPopup();
    var error;
    open.catch(function (err) {
      error = err;
    });
    this.$interval.flush(300);
    expect(error).toBeDefined();
  });

  it('should handle the case when popup is closed', function() {
    var open = this.popup.pollPopup();
    var error;
    open.catch(function (err) {
      error = err;
    });
    this.$interval.flush(300);
    expect(error).toBeDefined();
  });
});

