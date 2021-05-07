import { ProfileData } from '../../core/Models/ProfileData';
export interface ProfileState {
    error: string;
    loading: boolean;
    loadingStatus: string;
    profileData: ProfileData;
}

export const initialProfileState: ProfileState = {
    error: null,
    loading: false,
    loadingStatus: null,
    profileData: null,
};
