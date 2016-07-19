export default class Config {
  static get getConstant() {
    return new Config();
  }

  baseUrl = '/';
  loginUrl = '/auth/login';
  signupUrl = '/auth/signup';
  unlinkUrl = '/auth/unlink/';
  tokenName = 'token';
  tokenPrefix = 'satellizer';
  tokenHeader = 'Authorization';
  tokenType = 'Bearer';
  storageType = 'localStorage';
  tokenRoot = null;
  withCredentials = false;
  providers = {
    facebook: {
      name: 'facebook',
      url: '/auth/facebook',
      authorizationEndpoint: 'https://www.facebook.com/v2.5/dialog/oauth',
      redirectUri: window.location.origin + '/',
      requiredUrlParams: ['display', 'scope'],
      scope: ['email'],
      scopeDelimiter: ',',
      display: 'popup',
      oauthType: '2.0',
      popupOptions: { width: 580, height: 400 }
    },
    google: {
      name: 'google',
      url: '/auth/google',
      authorizationEndpoint: 'https://accounts.google.com/o/oauth2/auth',
      redirectUri: window.location.origin,
      requiredUrlParams: ['scope'],
      optionalUrlParams: ['display', 'state'],
      scope: ['profile', 'email'],
      scopePrefix: 'openid',
      scopeDelimiter: ' ',
      display: 'popup',
      oauthType: '2.0',
      popupOptions: { width: 452, height: 633 },
      state: () => encodeURIComponent(Math.random().toString(36).substr(2))
    },
    github: {
      name: 'github',
      url: '/auth/github',
      authorizationEndpoint: 'https://github.com/login/oauth/authorize',
      redirectUri: window.location.origin,
      optionalUrlParams: ['scope'],
      scope: ['user:email'],
      scopeDelimiter: ' ',
      oauthType: '2.0',
      popupOptions: { width: 1020, height: 618 }
    },
    instagram: {
      name: 'instagram',
      url: '/auth/instagram',
      authorizationEndpoint: 'https://api.instagram.com/oauth/authorize',
      redirectUri: window.location.origin,
      requiredUrlParams: ['scope'],
      scope: ['basic'],
      scopeDelimiter: '+',
      oauthType: '2.0'
    },
    linkedin: {
      name: 'linkedin',
      url: '/auth/linkedin',
      authorizationEndpoint: 'https://www.linkedin.com/uas/oauth2/authorization',
      redirectUri: window.location.origin,
      requiredUrlParams: ['state'],
      scope: ['r_emailaddress'],
      scopeDelimiter: ' ',
      state: 'STATE',
      oauthType: '2.0',
      popupOptions: { width: 527, height: 582 }
    },
    twitter: {
      name: 'twitter',
      url: '/auth/twitter',
      authorizationEndpoint: 'https://api.twitter.com/oauth/authenticate',
      redirectUri: window.location.origin,
      oauthType: '1.0',
      popupOptions: { width: 495, height: 645 }
    },
    twitch: {
      name: 'twitch',
      url: '/auth/twitch',
      authorizationEndpoint: 'https://api.twitch.tv/kraken/oauth2/authorize',
      redirectUri: window.location.origin,
      requiredUrlParams: ['scope'],
      scope: ['user_read'],
      scopeDelimiter: ' ',
      display: 'popup',
      oauthType: '2.0',
      popupOptions: { width: 500, height: 560 }
    },
    live: {
      name: 'live',
      url: '/auth/live',
      authorizationEndpoint: 'https://login.live.com/oauth20_authorize.srf',
      redirectUri: window.location.origin,
      requiredUrlParams: ['display', 'scope'],
      scope: ['wl.emails'],
      scopeDelimiter: ' ',
      display: 'popup',
      oauthType: '2.0',
      popupOptions: { width: 500, height: 560 }
    },
    yahoo: {
      name: 'yahoo',
      url: '/auth/yahoo',
      authorizationEndpoint: 'https://api.login.yahoo.com/oauth2/request_auth',
      redirectUri: window.location.origin,
      scope: [],
      scopeDelimiter: ',',
      oauthType: '2.0',
      popupOptions: { width: 559, height: 519 }
    },
    bitbucket: {
      name: 'bitbucket',
      url: '/auth/bitbucket',
      authorizationEndpoint: 'https://bitbucket.org/site/oauth2/authorize',
      redirectUri: window.location.origin + '/',
      requiredUrlParams: ['scope'],
      scope: ['email'],
      scopeDelimiter: ' ',
      oauthType: '2.0',
      popupOptions: { width: 1028, height: 529 }
    }
  };
  httpInterceptor: any = (): boolean => true;
};
