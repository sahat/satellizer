import Config from './Config';
import AuthProvider from './AuthProvider';
import Shared from './Shared';
import Local from './Local';
import Popup from './Popup';
import OAuth from './OAuth';
import OAuth2 from './OAuth2';
import OAuth1 from './OAuth1';
import Storage from './Storage';
angular.module('satellizer', [])
    .provider('$auth', ['satellizerConfig', (satellizerConfig) => new AuthProvider(satellizerConfig)])
    .constant('satellizerConfig', Config.getConstant)
    .service('satellizerShared', ['$q', '$window', '$log', 'satellizerConfig', 'satellizerStorage', Shared])
    .service('satellizerLocal', ['$http', 'satellizerConfig', 'satellizerShared', Local])
    .service('satellizerPopup', ['$interval', '$window', Popup])
    .service('satellizerOAuth', ['$http', 'satellizerConfig', 'satellizerShared', 'satellizerOAuth1', 'satellizerOAuth2', OAuth])
    .service('satellizerOAuth2', ['$http', '$window', '$timeout', 'satellizerConfig', 'satellizerPopup', 'satellizerStorage', OAuth2])
    .service('satellizerOAuth1', ['$http', '$window', 'satellizerConfig', 'satellizerPopup', OAuth1])
    .service('satellizerStorage', ['$window', 'satellizerConfig', Storage]);
export default 'satellizer';
