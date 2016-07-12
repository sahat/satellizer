export function joinUrl (baseUrl, url) {
  if (/^(?:[a-z]+:)?\/\//i.test(url)) {
    return url;
  }
  let joined = [baseUrl, url].join('/');
  let normalize = function (str) {
    return str
      .replace(/[\/]+/g, '/')
      .replace(/\/\?/g, '?')
      .replace(/\/\#/g, '#')
      .replace(/\:\//g, '://');
  };
  return normalize(joined);
}

export function getFullUrlPath (location) {
  const isHttps = location.protocol === 'https:';
  return location.protocol + '//' + location.hostname +
    ':' + (location.port || (isHttps ? '443' : '80')) +
    (/^\//.test(location.pathname) ? location.pathname : '/' + location.pathname);
}

export function parseQueryString (str) {
  let obj = {};
  let key;
  let value;
  angular.forEach((str || '').split('&'), function(keyValue) {
    if (keyValue) {
      value = keyValue.split('=');
      key = decodeURIComponent(value[0]);
      obj[key] = angular.isDefined(value[1]) ? decodeURIComponent(value[1]) : true;
    }
  });
  return obj;
}
