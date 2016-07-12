export default class Config {
    static getConstant: Config;
    baseUrl: string;
    loginUrl: string;
    signupUrl: string;
    unlinkUrl: string;
    tokenName: string;
    tokenPrefix: string;
    tokenHeader: string;
    tokenType: string;
    storageType: string;
    tokenRoot: any;
    withCredentials: boolean;
    providers: {
        facebook: {
            name: string;
            url: string;
            authorizationEndpoint: string;
            redirectUri: string;
            requiredUrlParams: string[];
            scope: string[];
            scopeDelimiter: string;
            display: string;
            oauthType: string;
            popupOptions: {
                width: number;
                height: number;
            };
        };
        google: {
            name: string;
            url: string;
            authorizationEndpoint: string;
            redirectUri: string;
            requiredUrlParams: string[];
            optionalUrlParams: string[];
            scope: string[];
            scopePrefix: string;
            scopeDelimiter: string;
            display: string;
            oauthType: string;
            popupOptions: {
                width: number;
                height: number;
            };
            state: () => void;
        };
        github: {
            name: string;
            url: string;
            authorizationEndpoint: string;
            redirectUri: string;
            optionalUrlParams: string[];
            scope: string[];
            scopeDelimiter: string;
            oauthType: string;
            popupOptions: {
                width: number;
                height: number;
            };
        };
        instagram: {
            name: string;
            url: string;
            authorizationEndpoint: string;
            redirectUri: string;
            requiredUrlParams: string[];
            scope: string[];
            scopeDelimiter: string;
            oauthType: string;
        };
        linkedin: {
            name: string;
            url: string;
            authorizationEndpoint: string;
            redirectUri: string;
            requiredUrlParams: string[];
            scope: string[];
            scopeDelimiter: string;
            state: string;
            oauthType: string;
            popupOptions: {
                width: number;
                height: number;
            };
        };
        twitter: {
            name: string;
            url: string;
            authorizationEndpoint: string;
            redirectUri: string;
            oauthType: string;
            popupOptions: {
                width: number;
                height: number;
            };
        };
        twitch: {
            name: string;
            url: string;
            authorizationEndpoint: string;
            redirectUri: string;
            requiredUrlParams: string[];
            scope: string[];
            scopeDelimiter: string;
            display: string;
            oauthType: string;
            popupOptions: {
                width: number;
                height: number;
            };
        };
        live: {
            name: string;
            url: string;
            authorizationEndpoint: string;
            redirectUri: string;
            requiredUrlParams: string[];
            scope: string[];
            scopeDelimiter: string;
            display: string;
            oauthType: string;
            popupOptions: {
                width: number;
                height: number;
            };
        };
        yahoo: {
            name: string;
            url: string;
            authorizationEndpoint: string;
            redirectUri: string;
            scope: any[];
            scopeDelimiter: string;
            oauthType: string;
            popupOptions: {
                width: number;
                height: number;
            };
        };
        bitbucket: {
            name: string;
            url: string;
            authorizationEndpoint: string;
            redirectUri: string;
            requiredUrlParams: string[];
            scope: string[];
            scopeDelimiter: string;
            oauthType: string;
            popupOptions: {
                width: number;
                height: number;
            };
        };
    };
    httpInterceptor: any;
}
