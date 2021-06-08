import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastService } from 'ng-uikit-pro-standard';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ProfileData } from '../Models/ProfileData';

@Injectable({
    providedIn: 'root',
})
export class CommentService {
    constructor(private http: HttpClient, private toast: ToastService) {}

    apiUrl = `${environment.apiUrl}`;

    voteComment(voteType: string, id: string): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        };
        return this.http
            .patch<any>(
                `${this.apiUrl}/comments/vote`,
                { voteType, id },
                {
                    headers: new HttpHeaders({
                        'Content-Type': 'application/json',
                    }),
                },
            )
            .pipe(
                catchError((err) => {
                    this.toast.error('Could not update Comment');
                    return [];
                }),
            );
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
