export interface AuthState {
  authenticatedSessionData: any;
  error: string;
  loading: boolean;
  loadingStatus: string;
  profile: any;
}

export const initialState: AuthState = {
  // authenticatedSessionData: localStorage.getItem('authenticatedSessionData') ? JSON.parse(localStorage.getItem('authenticatedSessionData')) : null,
  authenticatedSessionData: null,
  error: null,
  loading: false,
  loadingStatus: null,
  profile: null,
};
