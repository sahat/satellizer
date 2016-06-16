import url from 'url';
class OAuth {
    constructor($http, SatellizerConfig, SatellizerShared, SatellizerOAuth1, SatellizerOAuth2) {
        this.$http = $http;
        this.config = SatellizerConfig;
        this.shared = SatellizerShared;
        this.oauth1 = SatellizerOAuth1;
        this.oauth2 = SatellizerOAuth2;
    }
    authenticate(name, data) {
        return new Promise((resolve, reject) => {
            const provider = this.config.providers[name];
            const oauth = provider.oauthType === '1.0' ? this.oauth1() : this.oauth2();
            return oauth.init(provider, data)
                .then((response) => {
                if (provider.url) {
                    this.shared.setToken(response, false);
                }
                resolve(response);
            })
                .catch((error) => {
                reject(error);
            });
        });
    }
    unlink(provider, httpOptions) {
        httpOptions.url = httpOptions.url ? httpOptions.url : url.resolve(this.config.baseUrl, this.config.unlinkUrl);
        httpOptions.data = { provider } || httpOptions.data;
        httpOptions.method = httpOptions.method || 'POST';
        httpOptions.withCredentials = httpOptions.withCredentials || this.config.withCredentials;
        return this.$http(httpOptions);
    }
}
export default OAuth;
//# sourceMappingURL=OAuth.js.map