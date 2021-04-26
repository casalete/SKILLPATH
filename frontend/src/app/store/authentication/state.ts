export interface AuthState {
    error: string;
    loading: boolean;
    loadingStatus: string;
    profile: any;
    jwt: string;
}

export const initialAuthState: AuthState = {
    // authenticatedSessionData: localStorage.getItem('authenticatedSessionData') ? JSON.parse(localStorage.getItem('authenticatedSessionData')) : null,
    error: null,
    loading: false,
    loadingStatus: null,
    profile: null,
    jwt: null,
};
