describe('Configuration', function() {

  var Popup, $q, $interval, $window;

  beforeEach(module('Satellizer'));

  beforeEach(inject(function(_Popup_, _$interval_, _$q_) {
    Popup = _Popup_;
    $interval = _$interval_;
    $q = _$q_;
  }));


  it('Popup should be defined', function() {
    expect(Popup).toBeDefined();
  });

  it('should add left and top offset options', function() {
    var options = { width: 481, height: 269 };
    var preparedOptions = Popup.prepareOptions(options);
    expect(preparedOptions.left).toBeDefined();
    expect(preparedOptions.top).toBeDefined();
  });

  it('should stringify popup options', function() {
    var options = { width: 481, height: 269 };
    var stringOptions = Popup.stringifyOptions(options);
    expect(stringOptions).toBe('width=481,height=269');
  });

  it('should open a new popup', function() {
    var open = Popup.open();
    $interval.flush(300);
    window.postMessage('testing', '*');
    expect(angular.isObject(open)).toBe(true);
  });

  it('should postMessage to window', function() {
    var open = Popup.open();
    expect(angular.isObject(open)).toBe(true);
  });
});

