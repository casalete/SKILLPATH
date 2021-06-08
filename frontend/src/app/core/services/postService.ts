import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastService } from 'ng-uikit-pro-standard';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class PostService {
    constructor(private http: HttpClient, private toast: ToastService) {}

    apiUrl = `${environment.apiUrl}`;

    votePost(voteType: string, id: string): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        };
        return this.http
            .patch<any>(
                `${this.apiUrl}/posts/vote`,
                { voteType, id },
                {
                    headers: new HttpHeaders({
                        'Content-Type': 'application/json',
                    }),
                },
            )
            .pipe(
                catchError((err) => {
                    this.toast.error('Could not apply vote');
                    return [];
                }),
            );
    }
}
