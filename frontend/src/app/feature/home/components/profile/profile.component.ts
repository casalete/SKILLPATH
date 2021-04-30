import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { ProfileData } from 'src/app/core/Models/ProfileData';
import { AuthActions } from 'src/app/store';
import { SubSink } from 'subsink';
import { selectProfileData } from '../../../../store/authentication/selectors';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
    subs = new SubSink();

    profileData$: Observable<ProfileData>;

    followedTopics: string[];
    followedUsers: string[];

    constructor(private store: Store) {}

    ngOnInit(): void {
        this.store.dispatch(AuthActions.getProfileDataStart());

        this.profileData$ = this.store.select(selectProfileData).pipe(
            filter((profileData) => !!profileData),
            tap((profileData) => {
                this.followedTopics = profileData.followedTopics;
                this.followedUsers = profileData.followedUsers;
                console.log(this.followedTopics);
            }),
        );
    }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }
}
