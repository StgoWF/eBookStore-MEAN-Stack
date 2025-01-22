import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient) {}

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  login(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, user).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('userId', response.userId);
        this.isLoggedInSubject.next(true); // Notify about login
        // Reload the page after successful login
        window.location.reload();
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    this.isLoggedInSubject.next(false); // Notify about logout
    // Optionally, you can also reload the page after logout
    window.location.reload();
  }

  getLoginStatus(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }
}
