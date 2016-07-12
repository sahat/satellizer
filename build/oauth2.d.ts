import Config from './config';
import Popup from './popup';
import Storage from './storage';
export interface IOAuth2Options {
    name: string;
    url: string;
    clientId: string;
    authorizationEndpoint: string;
    redirectUri: string;
    scope: string[];
    scopePrefix: string;
    scopeDelimiter: string;
    state?: string | (() => string);
    requiredUrlParams: string[];
    defaultUrlParams: string[];
    responseType: string;
    responseParams: {
        code: string;
        clientId: string;
        redirectUri: string;
    };
    oauthType: string;
    popupOptions: {
        width: number;
        height: number;
    };
}
export default class OAuth2 {
    private $http;
    private $window;
    private $timeout;
    private SatellizerConfig;
    private SatellizerPopup;
    private SatellizerStorage;
    static $inject: string[];
    static camelCase(name: any): string;
    private defaults;
    constructor($http: angular.IHttpService, $window: angular.IWindowService, $timeout: angular.ITimeoutService, SatellizerConfig: Config, SatellizerPopup: Popup, SatellizerStorage: Storage);
    init(options: IOAuth2Options, userData: any): Promise<any>;
    exchangeForToken(oauthData: {
        code?;
        state?;
    }, userData: any): angular.IHttpPromise<any>;
    buildQueryString(): string;
}
