import Config from './config';
import Shared from './shared';
declare class Local {
    private $http;
    private SatellizerConfig;
    private SatellizerShared;
    static $inject: string[];
    constructor($http: angular.IHttpService, SatellizerConfig: Config, SatellizerShared: Shared);
    login(user: string | Object, options?: any): angular.IHttpPromise<any>;
    signup(user: string | Object, options?: any): angular.IHttpPromise<any>;
}
export default Local;
