import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { HttpClient } from '@angular/common/http';
import { tap, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5001/api/users';

  constructor(private afAuth: AngularFireAuth, private http: HttpClient) {}

  loginWithGoogle() {
    return this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(result => {
      return result.user?.getIdToken().then(token => {
        // Enviar el token de Firebase a tu servidor
        this.http.post<{ token: string, userId: string }>(`${this.apiUrl}/firebase-auth`, { token }).subscribe(
          response => {
            localStorage.setItem('token', response.token);
            localStorage.setItem('userId', response.userId);
          },
          error => {
            console.error('Error al autenticar con Firebase:', error);
          }
        );
      });
    }).catch(error => {
      console.error('Error al obtener el token de Google:', error);
    });
  }

  loginWithFacebook() {
    return this.afAuth.signInWithPopup(new firebase.auth.FacebookAuthProvider()).then(result => {
      return result.user?.getIdToken().then(token => {
        // Enviar el token de Firebase a tu servidor
        this.http.post<{ token: string, userId: string }>(`${this.apiUrl}/firebase-auth`, { token }).subscribe(
          response => {
            localStorage.setItem('token', response.token);
            localStorage.setItem('userId', response.userId);
          },
          error => {
            console.error('Error al autenticar con Firebase:', error);
          }
        );
      });
    }).catch(error => {
      console.error('Error al obtener el token de Facebook:', error);
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
    return this.afAuth.signOut();
  }

  isLoggedIn(): Observable<boolean> {
    const token = this.getToken();
    if (token) {
      return of(true);
    } else {
      return this.afAuth.authState.pipe(
        map(user => !!user)
      );
    }
  }
}
