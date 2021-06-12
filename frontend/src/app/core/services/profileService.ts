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

    updateProfileData(profileData: Partial<ProfileData>, picture: any): Observable<ProfileData> {
        const postData = new FormData();
        postData.append('profile', JSON.stringify(profileData));
        console.log(picture);
        if (picture) {
            postData.append('image', picture);
        }

        return this.http.patch<ProfileData>(`${this.apiUrl}/users/profile`, postData);
    }

    followUser(user: string) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        };
        return this.http.post<ProfileData>(`${this.apiUrl}/users/follow`, { id: user }, httpOptions);
    }

    followTopic(topic: string) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        };
        return this.http.post<ProfileData>(`${this.apiUrl}/topics/follow`, { topicName: topic }, httpOptions);
    }
}
