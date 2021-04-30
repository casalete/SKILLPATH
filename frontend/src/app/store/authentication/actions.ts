import { createAction, props } from '@ngrx/store';
import { ProfileData } from 'src/app/core/Models/ProfileData';
import { UserCredentials } from '../../core/Models/UserCredentials';
import { UserRegisterPayload } from '../../core/Models/UserRegisterPayload';

export const loginStart = createAction('[Auth] Login Start', props<{ userCredentials: UserCredentials; rememberMe?: boolean }>());
export const authenticateSuccess = createAction('[Auth] Authenticate Sucess', props<{ jwt: string }>());
export const authenticateError = createAction('[Auth] Login Error', props<{ error: string; email?: string }>());
export const autoLogin = createAction('[Auth] Auto Login', props<{ apiKey: string; email: string; rememberMe: boolean }>());
export const redirectOnLogin = createAction('[Auth] Redirect on Login', props<{ authSuccesAction: any }>());
export const registerStart = createAction('[Auth] Register Start', props<{ userRegisterPayload: UserRegisterPayload }>());
export const registerError = createAction('[Auth] Register Error', props<{ error: string }>());
export const logout = createAction('[Auth] LOGOUT');
export const clearError = createAction('[Auth] Clear Error');

export const getProfileDataStart = createAction('[Auth] Get Profile Data Start');
export const storeProfileData = createAction('[Auth] Store Profile Data', props<{ profileData: ProfileData }>());
// export const getProfileDataError = createAction('[Auth] Get Profile Data Error', props<{ err: string }>());
