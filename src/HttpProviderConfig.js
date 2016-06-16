class HttpProviderConfig {
    constructor($httpProvider) {
        $httpProvider.interceptors.push('SatellizerInterceptor');
    }
}
export default HttpProviderConfig;
//# sourceMappingURL=HttpProviderConfig.js.map