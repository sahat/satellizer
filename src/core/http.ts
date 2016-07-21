export interface IHttp {
  get (url: string, config?: any): any;
  post(url: string, data: any, config?: any): any;
}
