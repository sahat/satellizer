import Config from './config';
import Storage from './storage';
declare class Shared {
    private $q;
    private $window;
    private $log;
    private SatellizerConfig;
    private SatellizerStorage;
    static $inject: string[];
    private prefixedTokenName;
    constructor($q: angular.IQService, $window: angular.IWindowService, $log: angular.ILogService, SatellizerConfig: Config, SatellizerStorage: Storage);
    getToken(): string;
    getPayload(): any;
    setToken(response: any): void;
    removeToken(): void;
    isAuthenticated(): boolean;
    logout(): angular.IPromise<void>;
    setStorageType(type: any): void;
}
export default Shared;
