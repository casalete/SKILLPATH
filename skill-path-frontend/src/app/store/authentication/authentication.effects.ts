import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import {
  catchError,
  exhaust,
  exhaustMap,
  map,
  switchMap,
  tap,
} from 'rxjs/operators';
// import { LocalStorageService } from 'src/app/core/services/local-storage.service';

import * as AuthActions from './authentication.actions';
import { AuthService } from '../../core/services/authService';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient // private localStorageService: LocalStorageService,
  ) {}

  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.loginStart),
    exhaustMap((action) => {
      return this.authService
        .login(action.userCredentials)
        .pipe(tap((response) => console.log(response)));
    })
  );
}
// @Effect()
// authLogin = this.actions$.pipe(
//   ofType(AuthActions.loginStart),
//   exhaustMap((action) => {
//     return this.authService.login(action.userCredentials).pipe(
//       map((loginResponse: AuthenticatedSessionData) => {
//         return AuthActions.authenticateSuccess({
//           authenticatedSessionData: loginResponse,
//           rememberMe: action.rememberMe,
//           origin: 'login',
//         });
//       }),
//       catchError((err) =>
//         of(AuthActions.authenticateError({ error: err.error.error }))
//       )
//     );
//   })
// );

//     @Effect()
//     authRedirect = this.actions$.pipe(
//         ofType(AuthActions.authenticateSuccess),
//         switchMap((authSuccessAction) => {
//             this.localStorageService.setData('authenticatedSessionData', authSuccessAction.authenticatedSessionData);
//             this.localStorageService.setData('activeSession', authSuccessAction.authenticatedSessionData.scenarioSession ? true : false);

//             const loginActions = [];

//             if (!authSuccessAction.authenticatedSessionData.passwordChangeRequired && authSuccessAction.origin !== 'first-login') {
//                 const username = authSuccessAction.authenticatedSessionData.username;
//                 loginActions.push(UserProfileActions.getUserProfile({ username }));
//                 loginActions.push(UserProfileActions.getUserProfilePicture({ username }));
//             }

//             if (authSuccessAction.authenticatedSessionData.scenarioSession) {
//                 loginActions.push(ScenarioActions.getScenarioSession({ sessionId: authSuccessAction.authenticatedSessionData.scenarioSession as string }));
//             }

//             loginActions.push(AuthActions.redirectOnLogin({ authSuccesAction: authSuccessAction }));

//             return loginActions;
//         })
//     );

//     @Effect()
//     autoLogin = this.actions$.pipe(
//         ofType(AuthActions.autoLogin),
//         switchMap((action) => {
//             return this.authService.getSession(action.username).pipe(
//                 map((sessionDataResponse: any) => {
//                     return AuthActions.authenticateSuccess({
//                         authenticatedSessionData: sessionDataResponse,
//                         rememberMe: action.rememberMe,
//                         origin: 'auto-login',
//                     });
//                 }),
//                 catchError((err: HttpErrorResponse) => {
//                     if (err.status !== 504) {
//                         return [ErrorActions.handleErrors({ error: err })];
//                     } else {
//                         return [];
//                     }
//                 })
//             );
//         })
//     );

//     @Effect({ dispatch: false })
//     authLogout = this.actions$.pipe(
//         ofType(AuthActions.logout),
//         switchMap(() => {
//             if (this.dialog.openDialogs.length !== 0) {
//                 this.dialog.closeAll();
//             }
//             this.localStorageService.clearDataOnLogout();
//             this.router.navigate(['/login']);
//             return this.authService.logout();
//         })
//     );

//     @Effect({ dispatch: false })
//     redirectAfterLogin = this.actions$.pipe(
//         ofType(AuthActions.redirectOnLogin),
//         tap((action) => {
//             this.handleRedirect(action.authSuccesAction);
//         })
//     );

//     private handleRedirect(authSuccessAction): void {
//         if (authSuccessAction.rememberMe) {
//             const rememberMeCookie = `remember_me=true; path=/; max-age=${60 * 60 * 24 * 30}`;
//             document.cookie = rememberMeCookie;
//         } else {
//             const rememberMeCookie = 'remember_me=false; path=/; max-age=30';
//             document.cookie = rememberMeCookie;
//         }
//         if (authSuccessAction.origin) {
//             if (authSuccessAction.origin === 'first-login') {
//                 // this.store.dispatch(getLicenseServerStart());
//                 this.router.navigate(['/config/license-activation']);
//             } else if (
//                 authSuccessAction.origin === 'login' ||
//                 (authSuccessAction.origin === 'initial-config-import-users' && !authSuccessAction.authenticatedSessionData.passwordChangeRequired)
//             ) {
//                 this.router.navigate(['home']);
//             }
//         }
//     }
