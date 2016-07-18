import Interceptor from './interceptor';

export default class HttpProviderConfig {
  static $inject = ['$httpProvider'];

  constructor(private $httpProvider: angular.IHttpProvider) {
    $httpProvider.interceptors.push(Interceptor.Factory);
  }
}
