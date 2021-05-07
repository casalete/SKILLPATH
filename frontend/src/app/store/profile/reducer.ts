import { Action, createReducer, on } from '@ngrx/store';
import * as ProfileActions from './actions';
import { initialProfileState, ProfileState } from './state';

const reducer = createReducer(
    initialProfileState,

    on(ProfileActions.getProfileDataStart, (state) => ({
        ...state,
        loading: true,
        loadingStatus: 'Loading Profile Data...',
    })),

    on(ProfileActions.storeProfileData, (state, { profileData }) => ({
        ...state,
        profileData,
        loading: false,
        loadingStatus: null,
    })),
    on(ProfileActions.updateProfileDataStart, (state, { profileData }) => ({
        ...state,
        loading: true,
        loadingStatus: 'Updating Profile Data',
    })),
    on(ProfileActions.updateProfileDataSuccess, (state, { profileData }) => ({
        ...state,
        loading: false,
        loadingStatus: null,
        profileData: { ...state.profileData, ...profileData },
    })),
    on(ProfileActions.updateProfileDataError, (state, { error }) => ({
        ...state,
        loading: false,
        loadingStatus: null,
        error: error,
    })),
);

export function profileReducer(state: ProfileState, action: Action): any {
    return reducer(state, action);
}
