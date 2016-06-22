import Config from './config';
import AuthProvider from './authProvider';
import Shared from './shared';
import Local from './local';
import Popup from './popup';
import OAuth from './oauth';
import OAuth2 from './oauth2';
import OAuth1 from './oauth1';
import Storage from './storage';
import Interceptor from './interceptor';
import HttpProviderConfig from './httpProviderConfig';

angular.module('satellizer', [])
  .provider('$auth', ['satellizerConfig', (satellizerConfig) => new AuthProvider(satellizerConfig)])
  .constant('satellizerConfig', Config.getConstant)
  .service('satellizerShared', Shared)
  .service('satellizerLocal', Local)
  .service('satellizerPopup', Popup)
  .service('satellizerOAuth', OAuth)
  .service('satellizerOAuth2', OAuth2)
  .service('satellizerOAuth1', OAuth1)
  .service('satellizerStorage', Storage)
  .service('satellizerInterceptor', Interceptor)
  .config(($httpProvider) => new HttpProviderConfig($httpProvider));

export default 'satellizer';

