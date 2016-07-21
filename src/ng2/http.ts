import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { IHttp } from '../core/http';

export default class HttpWrapper implements IHttp {
  constructor(private http: Http) {}

  get(url: string, data: any, config?: any): Observable<Response> {
    return this.http.get(url, config);
  }

  post(url: string, data: any, config?: any): Observable<Response>  {
    return this.http.post(url, data, config);
  }
}
