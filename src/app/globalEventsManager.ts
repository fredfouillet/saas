import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";

@Injectable()
export class GlobalEventsManager {

    private _showNavBar: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
    public showNavBarEmitter: Observable<boolean> = this._showNavBar.asObservable();

    private _showTopNavBar: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
    public showTopNavBarEmitter: Observable<boolean> = this._showTopNavBar.asObservable();


    private _isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
    public isLoggedInEmitter: Observable<boolean> = this._isLoggedIn.asObservable();


    private _isLoadding: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
    public isLoaddingEmitter: Observable<boolean> = this._isLoadding.asObservable();


    private _showBackButton: BehaviorSubject<number> = new BehaviorSubject<number>(null);
    public showBackButtonEmitter: Observable<number> = this._showBackButton.asObservable();



    constructor() {}

    showNavBar(ifShow: boolean) {
        this._showNavBar.next(ifShow);
    }
    showTopNavBar(ifShow: boolean) {
        this._showTopNavBar.next(ifShow);
    }
    isLoggedIn(ifShow: boolean) {
        this._isLoggedIn.next(ifShow);
    }
    isLoadding(ifShow: boolean) {
        this._isLoadding.next(ifShow);
    }
    showBackButton(ifShow: number) {
        this._showBackButton.next(ifShow);
    }


}
