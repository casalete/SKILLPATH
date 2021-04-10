import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class LocalStorageService extends Observable<Map<string, string>> implements OnDestroy {
    private readonly entireStorage$: BehaviorSubject<Map<string, string>> = new BehaviorSubject(this._allStorage());

    constructor() {
        super((subscriber) => {
            this.entireStorage$.subscribe(subscriber);
        });
    }

    private _allStorage(): Map<string, string> {
        const values = new Map();
        const keys = Object.keys(localStorage);
        let i = keys.length;
        while (i--) {
            values.set(keys[i], localStorage.getItem(keys[i]));
        }
        return values;
    }

    ngOnDestroy(): void {
        this.entireStorage$.complete();
    }

    public hasAnyData(): boolean {
        return localStorage.length > 0;
    }
    public hasData(key: string): boolean {
        return localStorage.getItem(key) !== null;
    }
    public getData(key: string): any {
        const data = localStorage.getItem(key);
        try {
            return JSON.parse(data);
        } catch (e) {
            return data;
        }
    }
    public setData(key: string, value: any): void {
        localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
        this.entireStorage$.next(this._allStorage());
    }
    public removeData(key: string): void {
        localStorage.removeItem(key);
        this.entireStorage$.next(this._allStorage());
    }
    public clearAll(): void {
        localStorage.clear();
    }
}
