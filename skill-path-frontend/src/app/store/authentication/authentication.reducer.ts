import { Action, createReducer, on } from '@ngrx/store';

import * as AuthActions from './authentication.actions';
import { AuthState, initialState } from './authentication.state';

const reducer = createReducer(
  initialState,
  on(AuthActions.loginStart, (state) => ({
    ...state,
    loading: true,
    loadingStatus: 'Authenticating...',
  })),
  on(
    AuthActions.authenticateSuccess,
    (state, { authenticatedSessionData }) => ({
      ...state,
      authenticatedSessionData,
      loading: false,
      loadingStatus: null,
    })
  ),
  on(AuthActions.authenticateError, (state, { error }) => ({
    ...state,
    authError: error,
    authenticatedSessionData: null,
    loading: false,
    loadingStatus: null,
    profile: null,
    // TODO: check if this is still used
  })),
  on(AuthActions.logout, (state) => ({
    ...state,
    authenticatedSessionData: null,
    loading: false,
    loadingStatus: null,
  })),
  on(AuthActions.clearError, (state) => ({
    ...state,
    authError: null,
    profileError: null,
  }))
);

export function authReducer(state: AuthState, action: Action): any {
  return reducer(state, action);
}
