export default class Interceptor {
    constructor($q, satellizerConfig, satellizerShared, satellizerStorage) {
        this.$q = $q;
        this.satellizerConfig = satellizerConfig;
        this.satellizerShared = satellizerShared;
        this.satellizerStorage = satellizerStorage;
        this.request = (request) => {
            if (request.skipAuthorization) {
                return request;
            }
            if (this.satellizerShared.isAuthenticated() && this.satellizerConfig.httpInterceptor(request)) {
                const tokenName = this.satellizerConfig.tokenPrefix ?
                    [this.satellizerConfig.tokenPrefix, this.satellizerConfig.tokenName].join('_') : this.satellizerConfig.tokenName;
                let token = this.satellizerStorage.get(tokenName);
                if (this.satellizerConfig.authHeader && this.satellizerConfig.authToken) {
                    token = this.satellizerConfig.authToken + ' ' + token;
                }
                request.headers[this.satellizerConfig.authHeader] = token;
            }
            return request;
        };
        this.responseError = (response) => {
            return this.$q.reject(response);
        };
    }
}
Interceptor.$inject = ['$q', 'satellizerConfig', 'satellizerShared', 'satellizerStorage'];
