import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LocalStorageService } from '../services/local-storage.service';

@Injectable({
    providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {
    constructor(private localStorageService: LocalStorageService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log('test');
        const idToken = this.localStorageService.hasData('id_token') ? this.localStorageService.getData('id_token') : null;
        console.log(req);
        if (idToken) {
            const cloned = req.clone({
                headers: req.headers.set('Authorization', 'Bearer ' + idToken),
            });
            return next.handle(cloned);
        } else {
            return next.handle(req);
        }
    }
}
