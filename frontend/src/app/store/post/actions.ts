import { createAction, props } from '@ngrx/store';
import { ProfileData } from 'src/app/core/Models/ProfileData';
import { QueryParams } from '@ngrx/data';

export const votePostStart = createAction('[Profile] Vote post Start', props<{ voteType: string; postId: string; queryParams?: QueryParams }>());
export const votePostSuccess = createAction('[Profile] Vote post Success', props<{ queryParams?: QueryParams }>());
export const votePostError = createAction('[Profile] Vote post Error', props<{ error: string }>());

export const voteCommentStart = createAction('[Profile] Vote comment Start', props<{ voteType: string; commentId: string; postId: string }>());
export const voteCommentSuccess = createAction('[Profile] Vote comment Success', props<{ postId: string }>());
export const voteCommentError = createAction('[Profile] Vote comment Stop', props<{ error: string }>());
