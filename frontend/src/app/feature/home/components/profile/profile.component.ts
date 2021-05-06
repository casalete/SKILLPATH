import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { ProfileData } from 'src/app/core/Models/ProfileData';
import { ProfileActions } from 'src/app/store/profile';
import { selectProfileData } from 'src/app/store/profile/selectors';
import { SubSink } from 'subsink';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
    subs = new SubSink();

    profileData$: Observable<ProfileData>;
    hideElement = true;

    followedTopics: string[];
    followedUsers: string[];
    profileForm: FormGroup;

    constructor(private store: Store, private fb: FormBuilder) {}

    ngOnInit(): void {
        this.profileForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            displayName: ['', Validators.required],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            about: ['', Validators.length],
        });

        this.store.dispatch(ProfileActions.getProfileDataStart());

        this.profileData$ = this.store.select(selectProfileData).pipe(
            filter((profileData) => !!profileData),
            tap((profileData) => {
                this.followedTopics = profileData.followedTopics;
                this.followedUsers = profileData.followedUsers;

                this.profileForm.setValue({
                    email: profileData.email,
                    displayName: profileData.displayName,
                    firstName: profileData.firstName,
                    lastName: profileData.lastName,
                    about: profileData.about ? profileData.about : '',
                });
            }),
        );
    }

    onUpdateProfile(): void {
        const profileFormValues = this.profileForm.value;
        console.log(profileFormValues);
        this.store.dispatch(
            ProfileActions.updateProfileDataStart({
                profileData: {
                    ...profileFormValues,
                },
            }),
        );
    }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }
}
