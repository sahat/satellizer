export default class HttpProviderConfig {
    private $httpProvider;
    static $inject: string[];
    constructor($httpProvider: angular.IHttpProvider);
}
