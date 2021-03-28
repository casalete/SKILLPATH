import { createAction, props } from '@ngrx/store';
import { UserCredentials } from '../../core/Models/UserCredentials';

export const loginStart = createAction(
  '[Auth] Login Start',
  props<{ userCredentials: UserCredentials; rememberMe?: boolean }>()
);
export const authenticateSuccess = createAction(
  '[Auth] Authenticate Sucess',
  props<{ authenticatedSessionData: any; rememberMe: boolean }>()
);
export const authenticateError = createAction(
  '[Auth] Login Error',
  props<{ error: string; username?: string }>()
);
export const autoLogin = createAction(
  '[Auth] Auto Login',
  props<{ apiKey: string; username: string; rememberMe: boolean }>()
);
export const redirectOnLogin = createAction(
  '[Auth] Redirect on Login',
  props<{ authSuccesAction: any }>()
);

export const logout = createAction('[Auth] LOGOUT');
export const clearError = createAction('[Auth] Clear Error');
