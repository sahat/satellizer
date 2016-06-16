import { resolve } from 'url';
class Local {
    constructor($http, satellizerConfig, satellizerShared) {
        this.$http = $http;
        this.satellizerConfig = satellizerConfig;
        this.satellizerShared = satellizerShared;
    }
    login(user, options = {}) {
        options.url = options.url ? options.url : resolve(this.satellizerConfig.baseUrl, this.satellizerConfig.loginUrl);
        options.data = user || options.data;
        options.method = options.method || 'POST';
        options.withCredentials = options.withCredentials || this.satellizerConfig.withCredentials;
        return this.$http(options).then((response) => {
            this.satellizerShared.setToken(response);
            return response;
        });
    }
    signup(user, options = {}) {
        options = options || {};
        options.url = options.url ? options.url : resolve(this.satellizerConfig.baseUrl, this.satellizerConfig.signupUrl);
        options.data = user || options.data;
        options.method = options.method || 'POST';
        options.withCredentials = options.withCredentials || this.satellizerConfig.withCredentials;
        return this.$http(options);
    }
}
export default Local;
