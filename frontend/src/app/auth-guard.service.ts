import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { LocalStorageService } from './core/services/local-storage.service';

@Injectable({
    providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
    constructor(private router: Router, private store: Store, private localStorageService: LocalStorageService) {}

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {
        // if (this.authService.isAuthenticated()) {
        if (this.localStorageService.hasData('jwt')) {
            return true;
        }
        return this.router.createUrlTree(['/auth/login']);
    }
}
