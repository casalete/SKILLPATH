import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { ToastService } from 'ng-uikit-pro-standard';
import { catchError, exhaustMap, switchMap, tap } from 'rxjs/operators';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';

import { AuthService } from '../../core/services/authService';
import * as AuthActions from './authentication.actions';

// import { LocalStorageService } from 'src/app/core/services/local-storage.service';

@Injectable()
export class AuthEffects {
    constructor(
        private actions$: Actions,
        private authService: AuthService,
        private router: Router,
        private http: HttpClient,
        private toast: ToastService,
        private localStorageService: LocalStorageService,
    ) {}

    @Effect()
    authLogin = this.actions$.pipe(
        ofType(AuthActions.loginStart),
        switchMap((action) =>
            this.authService.login(action.userCredentials).pipe(
                switchMap((response) => {
                    this.localStorageService.setData('id_token', response.token);
                    this.handleLoginRedirect();
                    return [AuthActions.authenticateSuccess({ jwt: response.token })];
                }),
                catchError((err) => {
                    this.toast.error('login failed!');
                    return [AuthActions.authenticateError({ error: err.message })];
                }),
            ),
        ),
    );
    /*
    @Effect()
    autoLogin = this.actions$.pipe(
        ofType(AuthActions.loginStart),
        exhaustMap((action) => {
            return this.authService.login(action.userCredentials).pipe(tap((response) => {
                //TOASTR response.success
                console.log(response);
                localStorage.setItem('token',response.token.split('BEARER ')[1]);
            }));
        })
    );
*/

    /*
    @Effect()
    authLogout = this.actions$.pipe(
        ofType(AuthActions.loginStart),
        exhaustMap((action) => {
            return this.authService.login(action.userCredentials).pipe(tap((response) => {
                //TOASTR response.success
                console.log(response);
                localStorage.setItem('token',response.token.split('BEARER ')[1]);
            }));
        })
    );
*/
    @Effect()
    authRegister = this.actions$.pipe(
        ofType(AuthActions.registerStart),
        exhaustMap((action) => {
            return this.authService.register(action.userRegisterPayload).pipe(
                switchMap(() => {
                    this.toast.success('User succesfully registered!');
                    return [];
                }),

                catchError((err) => {
                    console.log(err);
                    this.toast.error(err.error.message);
                    return [];
                }),
            );
        }),
    );

    private handleLoginRedirect() {
        this.router.navigate(['/']);
    }
}
