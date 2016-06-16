export default class HttpProviderConfig {
    constructor($httpProvider) {
        this.$httpProvider = $httpProvider;
        $httpProvider.interceptors.push('satellizerInterceptor');
    }
}
HttpProviderConfig.$inject = ['$httpProvider'];
