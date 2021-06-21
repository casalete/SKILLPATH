import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserCredentials } from '../Models/UserCredentials';

@Injectable({
    providedIn: 'root',
})
export class SearchService {
    constructor(private http: HttpClient, private router: Router) {}

    apiUrl = `${environment.apiUrl}`;

    login(userCredentials: UserCredentials): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        };
        return this.http.post(`${this.apiUrl}/auth/login`, userCredentials, httpOptions);
    }

    searchTopicsAndPosts(): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        };
        return this.http.get<any>(`${this.apiUrl}/topics/search`, httpOptions);
    }
}
