import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { ProfileData } from 'src/app/core/Models/ProfileData';
import { mimeType } from 'src/app/shared/validators/mime-type.validator';
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
    imagePreview: string;
    image: any;
    profileImage: any;

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
                this.profileImage = profileData.imagePath;

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

    uploadProfilePicture(event: any): void {
        const file = (event.target as HTMLInputElement).files[0];
        try {
            // this.profileForm.patchValue({ image: file });
            // this.profileForm.get('image').updateValueAndValidity();
            this.image = file;
        } catch (e) {
            console.log(e);
        }

        const reader = new FileReader();
        reader.onload = () => {
            this.imagePreview = reader.result as string;
        };
        reader.readAsDataURL(file);

        // const uploadProfilePictureDialog = this.dialog.open(UploadProfilePictureModalComponent, {
        //     panelClass: 'cr-upload-profile-picture-modal',
        //     data: {
        //         username: this.userProfile.username,
        //         uploadedProfilePicture: event,
        //         pictureType: event.target.files[0].type,
        //     },
        // });
    }

    onUpdateProfile(profileForm: FormGroup): void {
        // console.log(this.profileForm.get('image').value);
        // console.log(profileForm.get('image').value);
        // console.log(this.image);
        // console.log(this.profileForm.value);
        const profileFormValues = this.profileForm.value;
        this.store.dispatch(
            ProfileActions.updateProfileDataStart({
                profileData: this.profileForm.value,
                picture: this.image,
            }),
        );
    }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }
}
