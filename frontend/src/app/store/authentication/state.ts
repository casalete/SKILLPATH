import { ProfileData } from '../../core/Models/ProfileData';
export interface AuthState {
    error: string;
    loading: boolean;
    loadingStatus: string;
    profileData: ProfileData;
    jwt: string;
}

export const initialAuthState: AuthState = {
    // authenticatedSessionData: localStorage.getItem('authenticatedSessionData') ? JSON.parse(localStorage.getItem('authenticatedSessionData')) : null,
    error: null,
    loading: false,
    loadingStatus: null,
    profileData: null,
    jwt: null,
};
