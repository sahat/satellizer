import { joinUrl, getFullUrlPath, parseQueryString } from '../src/utils';

describe('Utils', function () {

  describe('parseQueryString()', () => {

    it('should be defined', () => {
      expect(parseQueryString).toBeDefined();
    });

    it('should parse a query string', () => {
      const querystring = 'hello=world&foo=bar';
      expect(parseQueryString(querystring)).toEqual({ hello: 'world', foo: 'bar' });
    });

  });

  describe('joinUrl()', () => {

    it('should be defined', () => {
      expect(joinUrl).toBeDefined();
    });

    it('should merge baseUrl with relative url', () => {
      const baseUrl = 'http://localhost:3000';
      const urlPath = '/auth/facebook';
      expect(joinUrl(baseUrl, urlPath)).toEqual('http://localhost:3000/auth/facebook');
    });

  });

  describe('getFullUrlPath()', () => {

    it('should be defined', () => {
      expect(getFullUrlPath).toBeDefined();
    });

    it('should normalize full url from window.location', () => {
      const url1 = getFullUrlPath({
        hash: '#/',
        host: 'localhost:3000',
        hostname: 'localhost',
        href: 'http://localhost:3000/#/',
        origin: 'http://localhost:3000',
        pathname: '/',
        port: '3000',
        protocol: 'http:',
        search: ''
      });
      const url2 = getFullUrlPath({
        protocol: 'http:',
        hostname: 'google.com',
        port: '',
        pathname: '/test'
      });
      const url3 = getFullUrlPath({
        protocol: 'https:',
        hostname: 'google.com',
        port: '',
        pathname: '/test'
      });
      expect(url1).toEqual('http://localhost:3000/');
      expect(url2).toEqual('http://google.com:80/test');
      expect(url3).toEqual('https://google.com:443/test');
    });

    it('should normalize full url from createElement("a")', function () {
      const urlElement = document.createElement('a');

      urlElement.href = 'http://d4507eb5.ngrok.io/#/';
      const url1 = getFullUrlPath(urlElement);

      urlElement.href = 'https://google.com/test';
      const url2 = getFullUrlPath(urlElement);

      urlElement.href = 'http://localhost:3000/';
      const url3 = getFullUrlPath(urlElement);

      expect(url1).toEqual('http://d4507eb5.ngrok.io:80/');
      expect(url2).toEqual('https://google.com:443/test');
      expect(url3).toEqual('http://localhost:3000/');
    });

  });

});

