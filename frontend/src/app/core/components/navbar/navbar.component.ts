import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { getProfileDataStart } from '../../../store/profile/actions';
import { Observable } from 'rxjs';
import { ProfileData } from '../../Models/ProfileData';
import { selectProfileData } from 'src/app/store/profile/selectors';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
    constructor(private store: Store) {}
    profileData$: Observable<ProfileData>;

    ngOnInit(): void {
        this.store.dispatch(getProfileDataStart());

        this.profileData$ = this.store.select(selectProfileData);
    }
}
