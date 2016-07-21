import { IHttp } from '../core/http';

export default class HttpWrapper implements IHttp {
  constructor(private $http: angular.IHttpService) {
  }

  get(url: string, data: any, config?: any): ng.IHttpPromise<any> {
    return this.$http.get(url, config);
  }

  post(url: string, data: any, config?: any): ng.IHttpPromise<any> {
    return this.$http.post(url, data, config);
  }
}

HttpWrapper.$inject = ['$http'];
