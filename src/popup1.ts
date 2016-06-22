import { parse as queryParse, stringify } from 'querystring';
import { parse as urlParse } from 'url';

interface IPopup {
  open(url: string, name: string, popupOptions: { width: number, height: number }, redirectUri: string): Function|Promise<any>;
}

export default class Popup implements IPopup {
  static $inject = ['$interval', '$window'];
  
  private popup: any;
  private url: string;
  private defaults: { redirectUri: string };
  
  constructor(private $interval: angular.IIntervalService,
              private $window: angular.IWindowService) {
    this.popup = null;
    this.url = 'about:blank'; // TODO remove
    this.defaults = {
      redirectUri: null
    };
  }

  open(url: string, name: string, popupOptions: { width: number, height: number }, redirectUri: string) {
    this.url = url; // TODO remove

    const width = popupOptions.width || 500;
    const height = popupOptions.height || 500;

    const options = stringify({
      width: width,
      height: height,
      top: this.$window.screenY + ((this.$window.outerHeight - height) / 2.5),
      left: this.$window.screenX + ((this.$window.outerWidth - width) / 2)
    }, ',');

    const popupName = this.$window['cordova'] || this.$window.navigator.userAgent.includes('CriOS') ? '_blank' : name;

    this.popup = this.$window.open(this.url, popupName, options);

    if (this.popup && this.popup.focus) {
      this.popup.focus();
    }

    if (this.$window['cordova']) {
      return this.eventListener(this.defaults.redirectUri); // TODO pass redirect uri
    } else {
      return this.polling(redirectUri);
    }
  }

  polling(redirectUri) {
    return new Promise((resolve, reject) => {
      const redirectUriObject = urlParse(redirectUri);

      const polling = this.$interval(() => {
        if (!this.popup || this.popup.closed || this.popup.closed === undefined) {
          this.$interval.cancel(polling);
          reject(new Error('The popup window was closed'));
        }

        try {
          const popupUrl = this.popup.location.host + this.popup.location.pathname;

          if (popupUrl === redirectUriObject.host + redirectUriObject.pathname) {
            if (this.popup.location.search || this.popup.location.hash) {
              const query = queryParse(this.popup.location.search.substring(1).replace(/\/$/, ''));
              const hash = queryParse(this.popup.location.hash.substring(1).replace(/[\/$]/, ''));
              const params = Object.assign({}, query, hash);

              if (params.error) {
                reject(new Error(params.error));
              } else {
                resolve(params);
              }
            } else {
              reject(new Error(
                'OAuth redirect has occurred but no query or hash parameters were found. ' +
                'They were either not set during the redirect, or were removed—typically by a ' +
                'routing library—before Satellizer could read it.'
              ));
            }

            this.$interval.cancel(polling);
            this.popup.close();
          }
        } catch (error) {
          // Ignore DOMException: Blocked a frame with origin from accessing a cross-origin frame.
          // A hack to get around same-origin security policy errors in IE.
        }
      }, 500);
    });
  }

  eventListener(redirectUri) {
    return new Promise((resolve, reject) => {
      this.popup.addEventListener('loadstart', (event) => {
        if (!event.url.includes(redirectUri)) {
          return;
        }

        const url = urlParse(event.url);

        if (url.search || url.hash) {
          const query = queryParse(url.search.substring(1).replace(/\/$/, ''));
          const hash = queryParse(url.hash.substring(1).replace(/[\/$]/, ''));
          const params = Object.assign({}, query, hash);

          if (params.error) {
            reject(new Error(params.error));
          } else {
            resolve(params);
          }

          this.popup.close();
        }
      });

      this.popup.addEventListener('loaderror', function() {
        reject(new Error('Authorization failed'));
      });
    });
  }
}
