import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './state';

export const selectAuthState = createFeatureSelector<AuthState>('auth');
