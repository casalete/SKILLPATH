import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { ToastService } from 'ng-uikit-pro-standard';
import { catchError, switchMap } from 'rxjs/operators';
import * as ProfileActions from './actions';
import { ProfileService } from '../../core/services/profileService';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CommentService } from '../../core/services/commentService';
import { PostEntityService } from '../ngrx-data/post/post-entity.service';
import { followTopicStart, followTopicSuccess } from './actions';

@Injectable()
export class ProfileEffects {
    apiUrl = `${environment.apiUrl}`;

    constructor(
        private actions$: Actions,
        private profileService: ProfileService,
        private toast: ToastService,
        private http: HttpClient,
        private commentService: CommentService,
        private postEntityService: PostEntityService,
    ) {}

    @Effect()
    getProfileData$ = this.actions$.pipe(
        ofType(ProfileActions.getProfileDataStart),
        switchMap((action) =>
            this.profileService.getProfileData().pipe(
                switchMap((profileData) => {
                    return [ProfileActions.storeProfileData({ profileData })];
                }),
                catchError((err) => {
                    this.toast.error('Profile Data retrieval failed!');
                    return [];
                }),
            ),
        ),
    );

    @Effect()
    updateProfileData$ = this.actions$.pipe(
        ofType(ProfileActions.updateProfileDataStart),
        switchMap((action) =>
            this.profileService.updateProfileData(action.profileData, action.picture).pipe(
                switchMap((profileData) => {
                    return [ProfileActions.updateProfileDataSuccess({ profileData, picture: action.picture })];
                }),
                catchError((err) => {
                    this.toast.error('Profile Data Update failed!');
                    return [ProfileActions.updateProfileDataError({ error: err.error.error })];
                }),
            ),
        ),
    );

    @Effect()
    followUser$ = this.actions$.pipe(
        ofType(ProfileActions.followUserStart),
        switchMap((action) =>
            this.profileService.followUser(action.user).pipe(
                switchMap((profileData) => {
                    return [ProfileActions.followUserSuccess({ profileData })];
                }),
                catchError((err) => {
                    this.toast.error('User follow failed!');
                    return [ProfileActions.followUserError({ error: err.error.error })];
                }),
            ),
        ),
    );

    @Effect()
    followTopic$ = this.actions$.pipe(
        ofType(ProfileActions.followTopicStart),
        switchMap((action) =>
            this.profileService.followTopic(action.topic).pipe(
                switchMap((profileData) => {
                    this.toast.success('Topic added to follow list!');
                    return [ProfileActions.followTopicSuccess({ profileData })];
                }),
                catchError((err) => {
                    this.toast.error('Topic follow failed!');
                    return [ProfileActions.followTopicError({ error: err.error.error })];
                }),
            ),
        ),
    );
}
