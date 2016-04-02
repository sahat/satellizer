import qs from 'qs';
import url from 'url';

class Popup {
  constructor($interval, $window, SatellizerConfig) {
    this.$interval = $interval;
    this.$window = $window;
    this.config = SatellizerConfig;

    this.popup = null;
    this.url = 'about:blank';
  }

  open(url, name, { width=500, height=500 }, redirectUri) {
    return new Promise((resolve, reject) => { // todo remove redundant
      this.url = url; // todo remove

      const options = qs.stringify({
        width: width,
        height: height,
        top: this.$window.screenY + ((this.$window.outerHeight - height) / 2.5),
        left: this.$window.screenX + ((this.$window.outerWidth - width) / 2)
      }, ',');

      const name = this.$window.cordova || this.$window.navigator.userAgent.includes('CriOS') ? '_blank' : name;

      this.popup = this.$window.open(this.url, name, options);

      if (this.popup && this.popup.focus) {
        this.popup.focus();
      }

      if (this.$window.cordova) {
        return this.eventListener(defaults.redirectUri); // todo pass redirect uri
      } else {
        return this.polling(redirectUri);
      }
    });
  }

  polling(redirectUri) {
    return new Promise((resolve, reject) => {
      const redirectUri = url.parse(redirectUri);

      const polling = this.$interval(() => {
        if (!this.popup || this.popup.closed || !this.popup.closed) {
          this.$interval.cancel(polling);
          reject(new Error('The popup window was closed'));
        }

        try {
          const popupUrl = this.popup.location.host + this.popup.location.pathname;

          if (popupUrl === redirectUri.host + redirectUri.pathname) {
            if (this.popup.location.search || this.popup.location.hash) {
              const query = qs.parse(this.popup.location.search.substring(1).replace(/\/$/, ''));
              const hash = qs.parse(this.popup.location.hash.substring(1).replace(/[\/$]/, ''));
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
      }, 20);
    });
  }

  eventListener(redirectUri) {
    return new Promise((resolve, reject) => {
      this.popup.addEventListener('loadstart', (event) => {
        if (!event.url.includes(redirectUri)) {
          return;
        }

        const url = url.parse(event.url);

        if (url.search || url.hash) {
          const query = qs.parse(url.search.substring(1).replace(/\/$/, ''));
          const hash = qs.parse(url.hash.substring(1).replace(/[\/$]/, ''));
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
