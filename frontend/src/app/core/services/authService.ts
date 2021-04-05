import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserCredentials } from '../Models/UserCredentials';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  apiUrl = `${environment.apiUrl}`;

  login(userCredentials: UserCredentials): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post(
      `${this.apiUrl}/auth/login`,
      userCredentials,
      httpOptions
    );
  }

  register(userCredentials: UserCredentials): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post(
      `${this.apiUrl}/auth/register`,
      userCredentials,
      httpOptions
    );
  }
}
