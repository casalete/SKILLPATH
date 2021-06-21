import { Route } from '@angular/compiler/src/core';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map, switchMap, take, withLatestFrom } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private store: Store) {}

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {
        console.log(localStorage.getItem('id_token') !== null ? true : this.router.createUrlTree(['/auth/login']));
        return localStorage.getItem('id_token') !== null ? true : this.router.createUrlTree(['/auth/login']);
        // return this.store.select(selectAuthenticatedSessionData).pipe(
        //     take(1),
        //     switchMap((authenticatedSessionData: AuthenticatedSessionData) =>
        //         this.store.select(selectUrl).pipe(
        //             withLatestFrom(this.store.select(selectErrorCode)),
        //             filter(([url, errorCode]) => errorCode !== undefined),
        //             map(([url, errorCode]) => {
        //                 if (errorCode === null) {
        //                     if (authenticatedSessionData && url === '/login' && !authenticatedSessionData.passwordChangeRequired) {
        //                         return this.router.createUrlTree(['/home']);
        //                     }
        //                     if (!authenticatedSessionData && url !== '/login') {
        //                         return this.router.createUrlTree(['/login']);
        //                     }

        //                     if (authenticatedSessionData && url !== '/login') {
        //                         if (authenticatedSessionData.passwordChangeRequired) {
        //                             return this.router.createUrlTree(['/login']);
        //                         }

        //                         const userRole = +authenticatedSessionData.accessLevel;
        //                         if (next.data.role && RoleMapper.toRoleId(next.data.role) <= userRole) {
        //                             return true;
        //                         } else {
        //                             return false;
        //                         }
        //                     }

        //                     if (url === '/login' && !authenticatedSessionData) {
        //                         return true;
        //                     }
        //                 } else {
        //                     if (errorCode === 570 && url !== '/system/install') {
        //                         return this.router.createUrlTree(['/system/install']);
        //                     }
        //                     if (errorCode === 571 && url !== '/system/upgrade') {
        //                         return this.router.createUrlTree(['/system/upgrade']);
        //                     }
        //                     if (errorCode === 572 && url !== '/system/restore') {
        //                         return this.router.createUrlTree(['/system/restore']);
        //                     }
        //                     return true;
        //                 }
        //             })
        //         )
        //     )
        // );
    }
}
