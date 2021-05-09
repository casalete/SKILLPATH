import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DefaultDataService, HttpUrlGenerator } from '@ngrx/data';
import { Observable, of } from 'rxjs';
import { Topic } from 'src/app/core/Models/Topic';
import { environment } from 'src/environments/environment';

@Injectable()
export class TopicDataService extends DefaultDataService<Topic> {
    apiUrl = `${environment.apiUrl}`;
    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        }),
    };
    constructor(http: HttpClient, httpUrlGenerator: HttpUrlGenerator) {
        super('Topic', http, httpUrlGenerator);
    }
    getAll(): Observable<Topic[]> {
        return this.http.get<Topic[]>(`${this.apiUrl}/topics`, this.httpOptions);
    }

    getById(key: any): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/topics/${key}`, this.httpOptions);
    }
}
