import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { Post } from 'src/app/core/Models/Post';
import { environment } from 'src/environments/environment';
@Injectable()
export class PostEntityService extends EntityCollectionServiceBase<Post> {
    constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory, private http: HttpClient) {
        super('Post', serviceElementsFactory);
    }
    apiUrl = `${environment.apiUrl}`;
    addComment(comment) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        };
        return this.http.post<any>(`${this.apiUrl}/comments`, comment, httpOptions);
    }
}
