import { State } from 'src/app/store';
import { AuthState } from 'src/app/store/authentication/authentication.state';
import { ActionReducerMap } from '@ngrx/store';
import { authReducer } from 'src/app/store/authentication/authentication.reducer';
import { createFeatureSelector } from '@ngrx/store';
import { createSelector } from '@ngrx/store';

export interface CoreState extends State {
  authState: AuthState;
}

export const reducers: ActionReducerMap<CoreState> = {
  authState: authReducer,
};

export const selectCoreState = createFeatureSelector<CoreState>('core');

export const selectAuthState = createSelector(
  selectCoreState,
  (state: CoreState) => state.authState
);
