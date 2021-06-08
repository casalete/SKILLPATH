export interface PostState {
    error: string;
    loading: boolean;
    loadingStatus: string;
}

export const initialPostState: PostState = {
    error: null,
    loading: false,
    loadingStatus: null,
};
