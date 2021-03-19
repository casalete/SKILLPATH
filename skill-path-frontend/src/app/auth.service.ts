import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {
  }

  isAuthenticated = (): boolean => {
    const userData = localStorage.getItem('userInfo');
    return !!(userData && JSON.parse(userData));
  }

  setUserInfo = (user): void => {
    localStorage.setItem('userInfo', JSON.stringify(user));
  }

  validate = (email, password): any => {
    return this.http.post(`${this.apiUrl}/authenticate`, {username: email, password}).toPromise();
  }
}
