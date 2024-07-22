import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { HttpClient } from '@angular/common/http';
import { tap, map } from 'rxjs/operators';
import { Observable, of, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5001/api/users';
  private authStatus = new BehaviorSubject<boolean>(this.isTokenPresent());

  constructor(private afAuth: AngularFireAuth, private http: HttpClient) {}

  loginWithGoogle() {
    return this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(result => {
      return result.user?.getIdToken().then(token => {
        // Enviar el token de Firebase a tu servidor
        this.http.post<{ token: string, userId: string }>(`${this.apiUrl}/firebase-auth`, { token }).subscribe(
          response => {
            localStorage.setItem('token', response.token);
            localStorage.setItem('userId', response.userId);
            this.authStatus.next(true);  // Actualizar el estado de autenticación
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
            this.authStatus.next(true);  // Actualizar el estado de autenticación
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
        this.authStatus.next(true);  // Actualizar el estado de autenticación
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
    this.authStatus.next(false);  // Actualizar el estado de autenticación
    return this.afAuth.signOut();
  }

  isLoggedIn(): Observable<boolean> {
    return this.authStatus.asObservable();
  }

  private isTokenPresent(): boolean {
    return !!this.getToken();
  }
}
