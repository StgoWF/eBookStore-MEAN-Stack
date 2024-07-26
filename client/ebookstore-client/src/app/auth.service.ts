import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { HttpClient } from '@angular/common/http';
import { tap, map } from 'rxjs/operators';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/users`;
  private authStatus = new BehaviorSubject<boolean>(this.isTokenPresent());

  constructor(private afAuth: AngularFireAuth, private http: HttpClient) {}

  loginWithGoogle() {
    return this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(result => {
      return result.user?.getIdToken().then(token => {
        // Send the Firebase token to your server
        this.http.post<{ token: string, userId: string }>(`${this.apiUrl}/firebase-auth`, { token }).subscribe(
          response => {
            localStorage.setItem('token', response.token);
            localStorage.setItem('userId', response.userId);
            this.authStatus.next(true);  // Update authentication status
          },
          error => {
            console.error('Error authenticating with Firebase:', error);
          }
        );
      });
    }).catch(error => {
      console.error('Error obtaining Google token:', error);
    });
  }

  loginWithFacebook() {
    return this.afAuth.signInWithPopup(new firebase.auth.FacebookAuthProvider()).then(result => {
      return result.user?.getIdToken().then(token => {
        // Send the Firebase token to your server
        this.http.post<{ token: string, userId: string }>(`${this.apiUrl}/firebase-auth`, { token }).subscribe(
          response => {
            localStorage.setItem('token', response.token);
            localStorage.setItem('userId', response.userId);
            this.authStatus.next(true);  // Update authentication status
          },
          error => {
            console.error('Error authenticating with Firebase:', error);
          }
        );
      });
    }).catch(error => {
      console.error('Error obtaining Facebook token:', error);
    });
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  login(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, user).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('userId', response.userId);
        this.authStatus.next(true);  // Update authentication status
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('token') || localStorage.getItem('firebaseToken');
  }

  getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('firebaseToken');
    localStorage.removeItem('userId');
    this.authStatus.next(false);  // Update authentication status
    return this.afAuth.signOut();
  }

  isLoggedIn(): Observable<boolean> {
    return this.authStatus.asObservable();
  }

  private isTokenPresent(): boolean {
    return !!this.getToken();
  }
}
