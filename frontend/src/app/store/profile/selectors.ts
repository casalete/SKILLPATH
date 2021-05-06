import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProfileState } from './state';

export const selectProfileState = createFeatureSelector<ProfileState>('profile');

export const selectProfileData = createSelector(selectProfileState, (state) => state.profileData);
