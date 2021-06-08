import { createAction, props } from '@ngrx/store';
import { ProfileData } from 'src/app/core/Models/ProfileData';

export const getProfileDataStart = createAction('[Profile] Get Profile Data Start');
export const storeProfileData = createAction('[Profile] Store Profile Data', props<{ profileData: ProfileData }>());

export const updateProfileDataStart = createAction('[Profile] Update Profile Data Start', props<{ profileData: Partial<ProfileData> }>());
export const updateProfileDataSuccess = createAction('[Profile] Update Profile Data Success', props<{ profileData: Partial<ProfileData> }>());
export const updateProfileDataError = createAction('[Profile] Update Profile Data Error', props<{ error: string }>());

export const voteComment = createAction('[Profile] Vote comment', props<{ voteType: string; commentId: string }>());
