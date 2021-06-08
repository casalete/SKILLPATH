import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { ToastService } from 'ng-uikit-pro-standard';
import { catchError, delay, map, switchMap, tap } from 'rxjs/operators';
import * as PostActions from './actions';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CommentService } from '../../core/services/commentService';
import { PostEntityService } from '../ngrx-data/post/post-entity.service';
import { TopicEntityService } from '../ngrx-data/topic/topic-entity.service';
import { PostService } from 'src/app/core/services/postService';

@Injectable()
export class PostEffects {
    apiUrl = `${environment.apiUrl}`;

    constructor(
        private actions$: Actions,
        private toast: ToastService,
        private http: HttpClient,
        private commentService: CommentService,
        private postEntityService: PostEntityService,
        private topicEntityService: TopicEntityService,
        private postService: PostService,
    ) {}

    @Effect()
    voteComment$ = this.actions$.pipe(
        ofType(PostActions.voteCommentStart),
        switchMap((action) => {
            return this.commentService.voteComment(action.voteType, action.commentId).pipe(
                switchMap(() => [PostActions.voteCommentSuccess({ postId: action.postId })]),
                catchError((err) => [PostActions.voteCommentError({ error: err.error.error })]),
            );
        }),
    );

    @Effect({ dispatch: false })
    voteCommentSuccess$ = this.actions$.pipe(
        ofType(PostActions.voteCommentSuccess),
        switchMap((action) => {
            this.postEntityService.clearCache();
            return this.postEntityService.getByKey(action.postId).pipe(
                map((res) => {
                    return [];
                }),
                catchError((err) => {
                    return [];
                }),
            );
        }),
    );

    @Effect()
    votePost$ = this.actions$.pipe(
        ofType(PostActions.votePostStart),
        switchMap((action) => {
            return this.postService.votePost(action.voteType, action.postId).pipe(
                switchMap(() => [PostActions.votePostSuccess({ queryParams: action.queryParams })]),
                catchError((err) => [PostActions.votePostError({ error: err.error.error })]),
            );
        }),
    );

    @Effect({ dispatch: false })
    votePostSuccess$ = this.actions$.pipe(
        ofType(PostActions.votePostSuccess),
        tap((action) => {
            this.postEntityService.clearCache();
            this.postEntityService.getWithQuery(action.queryParams).pipe(
                map((res) => {
                    return [];
                }),
                catchError((err) => {
                    return [];
                }),
            );
        }),
    );
}
