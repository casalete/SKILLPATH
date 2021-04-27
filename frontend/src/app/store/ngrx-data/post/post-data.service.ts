import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DefaultDataService, HttpUrlGenerator } from '@ngrx/data';
import { Observable } from 'rxjs';
import { Post } from 'src/app/core/Models/Post';
import { environment } from 'src/environments/environment';

@Injectable()
export class PostDataService extends DefaultDataService<Post> {
    apiUrl = `${environment.apiUrl}`;
    constructor(http: HttpClient, httpUrlGenerator: HttpUrlGenerator) {
        super('Post', http, httpUrlGenerator);
    }
    getAll(): Observable<Post[]> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        };
        return this.http.get<Post[]>(`${this.apiUrl}/post`, httpOptions);
    }
}
