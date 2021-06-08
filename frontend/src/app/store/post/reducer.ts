import { Action, createReducer, on } from '@ngrx/store';
import * as PostActions from './actions';
import { initialPostState, PostState } from './state';

const reducer = createReducer(
    initialPostState,

    // on(PostActions.updatePostDataError, (state, { error }) => ({
    //     ...state,
    //     loading: false,
    //     loadingStatus: null,
    //     error: error,
    // })),
);

export function PostReducer(state: PostState, action: Action): any {
    return reducer(state, action);
}
