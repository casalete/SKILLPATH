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
    on(AuthActions.authenticateSuccess, (state, { jwt }) => ({
        ...state,
        jwt,
        loading: false,
        loadingStatus: null,
    })),
    on(AuthActions.authenticateError, (state, { error }) => ({
        ...state,
        authError: error,
        loading: false,
        loadingStatus: null,
        profile: null,
    })),
    on(AuthActions.logout, (state) => ({
        ...state,
        loading: false,
        loadingStatus: null,
    })),

    on(AuthActions.registerStart, (state) => ({
        ...state,
        loading: true,
        loadingStatus: 'Registering...',
    })),

    on(AuthActions.registerError, (state, { error }) => ({
        ...state,
        authError: error,
        loading: false,
        loadingStatus: null,
    })),

    on(AuthActions.clearError, (state) => ({
        ...state,
        authError: null,
        profileError: null,
    })),
);

export function authReducer(state: AuthState, action: Action): any {
    return reducer(state, action);
}
