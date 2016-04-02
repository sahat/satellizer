import url from 'url';

class Local {
  constructor($http, SatellizerConfig, SatellizerShared) {
    this.$http = $http;
    this.config = SatellizerConfig;
    this.shared = SatellizerShared;
  }

  login(user, options = {}) {
    options.url = options.url ? options.url : url.resolve(this.config.baseUrl, this.config.loginUrl);
    options.data = user || options.data;
    options.method = options.method || 'POST';
    options.withCredentials = options.withCredentials || this.config.withCredentials;

    return this.$http(options).then((response) => {
      this.shared.setToken(response);
      return response;
    });
  }

  signup(user, options = {}) {
    options = options || {};
    options.url = options.url ? options.url : url.resolve(this.config.baseUrl, this.config.signupUrl);
    options.data = user || options.data;
    options.method = options.method || 'POST';
    options.withCredentials = options.withCredentials || this.config.withCredentials;

    return this.$http(options);
  }
}

export default Local;
