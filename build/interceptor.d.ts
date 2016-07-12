import Config from './config';
import Shared from './shared';
import Storage from './storage';
export default class Interceptor {
    private $q;
    private SatellizerConfig;
    private SatellizerShared;
    private SatellizerStorage;
    static $inject: string[];
    constructor($q: angular.IQService, SatellizerConfig: Config, SatellizerShared: Shared, SatellizerStorage: Storage);
    request: (request: any) => any;
    responseError: (response: any) => any;
}
