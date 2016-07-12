import Config from './config';
import Popup from './popup';
import { IOAuth1Options } from './oauth1';
export interface IOAuth1 {
    init(options: any, data: any): angular.IPromise<any>;
}
export interface IOAuth1Options {
    name: string;
    url: string;
    authorizationEndpoint: string;
    redirectUri: string;
    scope: string[];
    scopePrefix: string;
    scopeDelimiter: string;
    requiredUrlParams: string[];
    defaultUrlParams: string[];
    oauthType: string;
    popupOptions: {
        width: number;
        height: number;
    };
}
export default class OAuth1 implements IOAuth1 {
    private $http;
    private $window;
    private SatellizerConfig;
    private SatellizerPopup;
    static $inject: string[];
    private defaults;
    constructor($http: angular.IHttpService, $window: angular.IWindowService, SatellizerConfig: Config, SatellizerPopup: Popup);
    init(options: IOAuth1Options, userData: any): angular.IHttpPromise<any>;
    getRequestToken(): angular.IHttpPromise<any>;
    exchangeForToken(oauth: any, userData: any): angular.IHttpPromise<any>;
    buildQueryString(obj: any): string;
}
