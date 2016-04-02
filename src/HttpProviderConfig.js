class HttpProviderConfig {
  constructor($httpProvider) {
    $httpProvider.interceptors.push('SatellizerInterceptor')
  }
}

export default HttpProviderConfig;
