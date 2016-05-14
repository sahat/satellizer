import Config from './Config';
import Auth from './Auth';
import Shared from './Shared';
import Local from './Local';
import Popup from './Popup';
import OAuth from './OAuth';
import OAuth2 from './OAuth2';
import OAuth1 from './OAuth1';
import Storage from './Storage';
import Interceptor from './Interceptor';
import HttpProviderConfig from './HttpProviderConfig';

angular.module('satellizer', [])
  .provider('$auth', Auth)
  .constant('SatellizerConfig', Config)
  .service('SatellizerShared', Shared)
  .service('SatellizerLocal', Local)
  .service('SatellizerPopup', Popup)
  .service('SatellizerOAuth', OAuth)
  .service('SatellizerOAuth2', OAuth2)
  .service('SatellizerOAuth1', OAuth1)
  .service('SatellizerStorage', Storage)
  .service('SatellizerInterceptor', Interceptor)
  .config('$httpProvider', HttpProviderConfig);

export default 'satellizer';
