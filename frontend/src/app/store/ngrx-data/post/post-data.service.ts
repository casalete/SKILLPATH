import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DefaultDataService, HttpUrlGenerator, QueryParams, DefaultDataServiceConfig } from '@ngrx/data';
import { Observable } from 'rxjs';
import { Post } from 'src/app/core/Models/Post';
import { environment } from 'src/environments/environment';

@Injectable()
export class PostDataService extends DefaultDataService<Post> {
    apiUrl = `${environment.apiUrl}`;
    constructor(http: HttpClient, httpUrlGenerator: HttpUrlGenerator, config: DefaultDataServiceConfig) {
        super('Post', http, httpUrlGenerator, config);
    }
    // getAll(): Observable<Post[]> {

    //     const params = new HttpParams().set()

    //     return this.http.get<Post[]>(`${this.apiUrl}/post`, httpOptions);
    // }

    // getWithQuery(): Observable<Post[]>{

    // }
}
