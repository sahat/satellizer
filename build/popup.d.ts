export interface IPopup {
    open(url: string, name: string, popupOptions: {
        width: number;
        height: number;
    }, redirectUri: string): Function | Promise<any>;
}
export default class Popup implements IPopup {
    private $interval;
    private $window;
    static $inject: string[];
    private popup;
    private url;
    private defaults;
    constructor($interval: angular.IIntervalService, $window: angular.IWindowService);
    stringifyOptions(options: any): string;
    open(url: string, name: string, popupOptions: {
        width: number;
        height: number;
    }, redirectUri: string): Promise<any>;
    polling(redirectUri: any): Promise<any>;
    eventListener(redirectUri: any): Promise<any>;
}
