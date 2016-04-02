import Auth from './Auth';
import Config from './Config';
import Popup from './Popup';
import Shared from './Shared';
import Storage from './Storage';
import Interceptor from './Interceptor';
import HttpProviderConfig from './HttpProviderConfig';
import OAuth from './OAuth';
import OAuth1 from './OAuth1';
import OAuth2 from './OAuth2';
import Local from './Local';

angular.module('satellizer', [])
  .constant('SatellizerConfig', Config)
  .provider('$auth', Auth)
  .service('SatellizerShared', Shared)
  .service('SatellizerLocal', Local)
  .service('SatellizerPopup', Popup)
  .service('SatellizerOAuth', OAuth)
  .service('SatellizerOAuth2', OAuth2)
  .service('SatellizerOAuth1', OAuth1)
  .service('SatellizerStorage', Storage)
  // .service('SatellizerInterceptor', Interceptor)
  // .config('$httpProvider', HttpProviderConfig);

export default 'satellizer';

// angular.module('ui.router.util').factory('$templateFactory', ['ng1UIRouter', () => new TemplateFactory()]);
// angular.module('ui.router.router', ['ui.router.util']);

// angular.module('satellizer.config').constant('config', config);

