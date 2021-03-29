import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserCredentials } from '../Models/UserCredentials';

export class AuthService {
  constructor(private http: HttpClient) {}

  login(userCredentials: UserCredentials): Observable<any> {
    // return this.http.post()
    return null;
  }
}
