export interface IOAuth2Options {
  name: string;
  url: string;
  clientId: string;
  authorizationEndpoint: string;
  redirectUri: string;
  scope: string[];
  scopePrefix: string;
  scopeDelimiter: string;
  state?: string|(() => string);
  requiredUrlParams: string[];
  defaultUrlParams: string[];
  responseType: string;
  responseParams: {
    code: string,
    clientId: string,
    redirectUri: string
  };
  oauthType: string;
  popupOptions: { width: number, height: number };
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
  popupOptions: { width: number, height: number };
}
