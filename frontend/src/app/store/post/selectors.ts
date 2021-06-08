import { createFeatureSelector } from '@ngrx/store';
import { PostState } from '.';

export const selectProfileState = createFeatureSelector<PostState>('post');

// export const selectProfileData = createSelector(selectProfileState, (state) => state.profileData);
