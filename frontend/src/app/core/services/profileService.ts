import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProfileData } from '../Models/ProfileData';

@Injectable({
    providedIn: 'root',
})
export class ProfileService {
    constructor(private http: HttpClient) {}

    apiUrl = `${environment.apiUrl}`;

    getProfileData(): Observable<ProfileData> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        };
        return this.http.get<ProfileData>(`${this.apiUrl}/users/profile`, httpOptions);
    }

    updateProfileData(profileData: Partial<ProfileData>): Observable<ProfileData> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        };
        return this.http.patch<ProfileData>(`${this.apiUrl}/users/profile`, profileData, httpOptions);
    }
}
