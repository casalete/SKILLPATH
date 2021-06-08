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
            this.profileService.updateProfileData(action.profileData).pipe(
                switchMap((profileData) => {
                    return [ProfileActions.updateProfileDataSuccess({ profileData })];
                }),
                catchError((err) => {
                    this.toast.error('Profile Data Update failed!');
                    return [ProfileActions.updateProfileDataError({ error: err.error.error })];
                }),
            ),
        ),
    );
}
