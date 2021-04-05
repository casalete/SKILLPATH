import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { exhaustMap, tap } from 'rxjs/operators';

import { AuthService } from '../../core/services/authService';
import * as AuthActions from './authentication.actions';

// import { LocalStorageService } from 'src/app/core/services/local-storage.service';

@Injectable()
export class AuthEffects {
    constructor(
        private actions$: Actions,
        private authService: AuthService,
        private router: Router,
        private http: HttpClient
    ) {}

    @Effect()
    authLogin = this.actions$.pipe(
        ofType(AuthActions.loginStart),
        exhaustMap((action) => {
            return this.authService.login(action.userCredentials).pipe(tap((response) => console.log(response)));
        })
    );

    @Effect()
    authRegister = this.actions$.pipe(
        ofType(AuthActions.registerStart),
        exhaustMap((action) => {
            return this.authService.register(action.userRegisterPayload).pipe(tap((response) => console.log(response)));
        })
    );
}
