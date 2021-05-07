import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DefaultDataService, HttpUrlGenerator, QueryParams, DefaultDataServiceConfig } from '@ngrx/data';
import { Observable } from 'rxjs';
import { Post } from 'src/app/core/Models/Post';
import { environment } from 'src/environments/environment';

@Injectable()
export class PostDataService extends DefaultDataService<Post> {
    apiUrl = `${environment.apiUrl}`;
    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        }),
    };
    constructor(http: HttpClient, httpUrlGenerator: HttpUrlGenerator, config: DefaultDataServiceConfig) {
        super('Post', http, httpUrlGenerator, config);
    }

    add(post: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/posts`, post, this.httpOptions);
    }

    getById(key: any): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/posts/${key}`, this.httpOptions);
    }

    // getAll(): Observable<Post[]> {

    //     const params = new HttpParams().set()

    //     return this.http.get<Post[]>(`${this.apiUrl}/post`, httpOptions);
    // }

    getWithQuery(topicName: any): Observable<Post[]> {
        return this.http.get<Post[]>(`${this.apiUrl}/posts/getPostsByTopic`, { params: topicName });
    }
}
