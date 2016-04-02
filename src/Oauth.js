import url from 'url';

class OAuth {
  constructor($http, SatellizerConfig, SatellizerShared, SatellizerOAuth1) {
    this.$http = $http;
    this.config = SatellizerConfig;
    this.shared = SatellizerShared;
    // this.oauth1 = SatellizerOAuth1;
    // this.oauth2 = SatellizerOAuth2;
  }

  authenticate(name, data) {
    return new Promise((resolve, reject) => {
      const provider = this.config.providers[name];
      const oauth = provider.oauthType === '1.0' ? this.oauth1() : this.oauth2();

      oauth.open(provider, data).then((response) => {
        if (provider.url) {
          this.shared.setToken(response, false);
        }
        resolve(response);
      }).catch(error => reject(new Error(error)));
    });
  }

  unlink(provider, options = {}) {
    options.url = options.url ? options.url : url.resolve(this.config.baseUrl, this.config.unlinkUrl);
    options.data = { provider: provider } || options.data;
    options.method = options.method || 'POST';
    options.withCredentials = options.withCredentials || this.config.withCredentials;

    return this.$http(options);
  }
}

export default OAuth;
