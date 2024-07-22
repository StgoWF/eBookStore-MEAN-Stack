import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:5001/api/cart';

  constructor(private http: HttpClient, private userService: UserService) {}

  private getHeaders(): HttpHeaders {
    const token = this.userService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getCart(): Observable<any> {
    const headers = this.getHeaders();
    console.log('Headers:', headers); // Log para verificar los headers
    return this.http.get(this.apiUrl, { headers }).pipe(
      tap(response => console.log('getCart response:', response)), // Log para verificar la respuesta
      catchError(this.handleError)
    );
  }

  addToCart(bookId: string, quantity: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(this.apiUrl, { bookId, quantity }, { headers }).pipe(
      tap(response => console.log('addToCart response:', response)), // Log para verificar la respuesta
      catchError(this.handleError)
    );
  }

  removeItemFromCart(bookId: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete(`${this.apiUrl}/item/${bookId}`, { headers }).pipe(
      tap(response => console.log('removeItemFromCart response:', response)), // Log para verificar la respuesta
      catchError(this.handleError)
    );
  }

  clearCart(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete(this.apiUrl, { headers }).pipe(
      tap(response => console.log('clearCart response:', response)), // Log para verificar la respuesta
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}
