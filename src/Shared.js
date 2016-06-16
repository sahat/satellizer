class Shared {
    constructor($q, $window, $log, satellizerConfig, satellizerStorage) {
        this.$q = $q;
        this.$window = $window;
        this.$log = $log;
        this.satellizerConfig = satellizerConfig;
        this.satellizerStorage = satellizerStorage;
        const { tokenName, tokenPrefix } = this.satellizerConfig;
        this.prefixedTokenName = tokenPrefix ? [tokenPrefix, tokenName].join('_') : tokenName;
    }
    getToken() {
        return this.satellizerStorage.get(this.prefixedTokenName);
    }
    getPayload() {
        const token = this.satellizerStorage.get(this.prefixedTokenName);
        if (token && token.split('.').length === 3) {
            try {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace('-', '+').replace('_', '/');
                return JSON.parse(decodeURIComponent(window.atob(base64)));
            }
            catch (e) {
            }
        }
    }
    setToken(response) {
        if (!response) {
            return this.$log.warn('Can\'t set token without passing a value');
        }
        let token;
        const accessToken = response && response.access_token;
        if (accessToken) {
            if (angular.isObject(accessToken) && angular.isObject(accessToken.data)) {
                response = accessToken;
            }
            else if (angular.isString(accessToken)) {
                token = accessToken;
            }
        }
        if (!token && response) {
            const tokenRootData = this.satellizerConfig.tokenRoot && this.satellizerConfig.tokenRoot.split('.').reduce(function (o, x) { return o[x]; }, response.data);
            token = tokenRootData ? tokenRootData[this.satellizerConfig.tokenName] : response.data && response.data[this.satellizerConfig.tokenName];
        }
        if (!token) {
            const tokenPath = this.satellizerConfig.tokenRoot ? this.satellizerConfig.tokenRoot + '.' + this.satellizerConfig.tokenName : this.satellizerConfig.tokenName;
            return this.$log.warn('Expecting a token named "' + tokenPath);
        }
        this.satellizerStorage.set(this.prefixedTokenName, token);
    }
    removeToken() {
        this.satellizerStorage.remove(this.prefixedTokenName);
    }
    isAuthenticated() {
        const token = this.satellizerStorage.get(this.prefixedTokenName);
        if (token) {
            if (token.split('.').length === 3) {
                try {
                    const base64Url = token.split('.')[1];
                    const base64 = base64Url.replace('-', '+').replace('_', '/');
                    const exp = JSON.parse(this.$window.atob(base64)).exp;
                    if (exp) {
                        const isExpired = Math.round(new Date().getTime() / 1000) >= exp;
                        if (isExpired) {
                            return false; // FAIL: Expired token
                        }
                        else {
                            return true; // PASS: Non-expired token
                        }
                    }
                }
                catch (e) {
                    return true; // PASS: Non-JWT token that looks like JWT
                }
            }
            return true; // PASS: All other tokens
        }
        return false; // FAIL: No token at all
    }
    logout() {
        this.satellizerStorage.remove(this.prefixedTokenName);
        return this.$q.when();
    }
    setStorageType(type) {
        this.satellizerConfig.storageType = type;
    }
}
export default Shared;
