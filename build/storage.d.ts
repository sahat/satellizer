import Config from './config';
export default class Storage {
    private $window;
    private SatellizerConfig;
    static $inject: string[];
    private memoryStore;
    private storageType;
    constructor($window: angular.IHttpService, SatellizerConfig: Config);
    get(key: string): string;
    set(key: string, value: string): void;
    remove(key: string): void;
}
