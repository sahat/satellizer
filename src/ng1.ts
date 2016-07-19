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
  .provider('$auth', ['SatellizerConfig', (SatellizerConfig) => new AuthProvider(SatellizerConfig)])
  .constant('SatellizerConfig', Config.getConstant)
  .service('SatellizerShared', Shared)
  .service('SatellizerLocal', Local)
  .service('SatellizerPopup', Popup)
  .service('SatellizerOAuth', OAuth)
  .service('SatellizerOAuth2', OAuth2)
  .service('SatellizerOAuth1', OAuth1)
  .service('SatellizerStorage', Storage)
  .service('SatellizerInterceptor', Interceptor)
  .config(['$httpProvider', ($httpProvider) => new HttpProviderConfig($httpProvider)]);

export default 'satellizer';

