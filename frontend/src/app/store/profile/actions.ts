import { createAction, props } from '@ngrx/store';
import { ProfileData } from 'src/app/core/Models/ProfileData';

export const getProfileDataStart = createAction('[Profile] Get Profile Data Start');
export const storeProfileData = createAction('[Profile] Store Profile Data', props<{ profileData: ProfileData }>());

export const updateProfileDataStart = createAction('[Profile] Update Profile Data Start', props<{ profileData: Partial<ProfileData>; picture: any }>());
export const updateProfileDataSuccess = createAction('[Profile] Update Profile Data Success', props<{ profileData: Partial<ProfileData>; picture: any }>());
export const updateProfileDataError = createAction('[Profile] Update Profile Data Error', props<{ error: string }>());

export const followUserStart = createAction('[Profile] Follow User Start', props<{ user: string }>());
export const followUserSuccess = createAction('[Profile] Follow User Success', props<{ profileData: Partial<ProfileData> }>());
export const followUserError = createAction('[Profile] Follow User Error', props<{ error: string }>());
