import { resolve } from 'url';
export default class OAuth {
    constructor($http, satellizerConfig, satellizerShared, satellizerOAuth1, satellizerOAuth2) {
        this.$http = $http;
        this.satellizerConfig = satellizerConfig;
        this.satellizerShared = satellizerShared;
        this.satellizerOAuth1 = satellizerOAuth1;
        this.satellizerOAuth2 = satellizerOAuth2;
    }
    authenticate(name, data) {
        return new Promise((resolve, reject) => {
            const provider = this.satellizerConfig.providers[name];
            const initialize = provider.oauthType === '1.0' ? this.satellizerOAuth1.init(provider, data) : this.satellizerOAuth2.init(provider, data);
            return initialize.then((response) => {
                if (provider.url) {
                    this.satellizerShared.setToken(response);
                }
                resolve(response);
            }).catch((error) => {
                reject(error);
            });
        });
    }
    unlink(provider, httpOptions) {
        httpOptions.url = httpOptions.url ? httpOptions.url : resolve(this.satellizerConfig.baseUrl, this.satellizerConfig.unlinkUrl);
        httpOptions.data = { provider } || httpOptions.data;
        httpOptions.method = httpOptions.method || 'POST';
        httpOptions.withCredentials = httpOptions.withCredentials || this.satellizerConfig.withCredentials;
        return this.$http(httpOptions);
    }
}
