import Config from './config';
import Shared from './shared';
import OAuth1 from './oauth1';
import OAuth2 from './oauth2';
export default class OAuth {
    private $http;
    private SatellizerConfig;
    private SatellizerShared;
    private SatellizerOAuth1;
    private SatellizerOAuth2;
    static $inject: string[];
    constructor($http: angular.IHttpService, SatellizerConfig: Config, SatellizerShared: Shared, SatellizerOAuth1: OAuth1, SatellizerOAuth2: OAuth2);
    authenticate(name: string, userData: any): Promise<any>;
    unlink(provider: string, httpOptions?: any): angular.IHttpPromise<any>;
}
