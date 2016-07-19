import Popup from '../src/popup';

let interval;
let window;
let popup;

describe('Popup', () => {

  beforeEach(angular.mock.inject(($interval, $window, $q) => {
    interval = $interval;
    window = $window;
    popup = new Popup($interval, $window, $q);
  }));

  it('should be defined', () => {
    expect(popup).toBeDefined();
  });

  it('should stringify popup options', () => {
    const options = { width: 481, height: 269 };
    const stringOptions = popup.stringifyOptions(options);
    expect(stringOptions).toBe('width=481,height=269');
  });

  it('should open a new popup', () => {
    spyOn(window, 'open');
    popup.open('about:blank', 'test', { width: 500, height: 500 });
    interval.flush(300);
    expect(window.open).toHaveBeenCalled();
  });

  it('should poll popup', () => {
    const open = popup.polling();
    interval.flush(300);
    expect(angular.isObject(open)).toBe(true);
  });

  it('should handle the case when popup redirect has occured', () => {
    popup.popup = {
      location: {
        host: document.location.host,
        search: '?code=foo_query',
        hash: '#code=foo_hash'
      }
    };
    const open = popup.polling();
    interval.flush(300);
    expect(angular.isObject(open)).toBe(true);
  });

  it('should handle the case when popup redirect has occured but no parameters are set', () => {
    popup.popup = {
      location: {
        host: document.location.host
      }
    };
    const open = popup.polling();
    let error = null;
    open.catch((err) => {
      error = err;
    });
    interval.flush(300);
    expect(error).toBeDefined();
  });

  it('should handle the case when popup is closed', () => {
    const open = popup.polling();
    let error = null;
    open.catch((err) => {
      error = err;
    });
    interval.flush(300);
    expect(error).toBeDefined();
  });
});

