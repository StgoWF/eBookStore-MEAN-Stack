// src/app/cart.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UserService } from './user.service';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = `${environment.apiUrl}/cart`;
  private cartSubject = new BehaviorSubject<any>({ items: [] });
  cart$ = this.cartSubject.asObservable();

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.userService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getCart(): Observable<any> {
    if (!this.userService.isLoggedIn()) {
      return of({ items: [] });
    }

    const headers = this.getHeaders();
    return this.http.get(this.apiUrl, { headers }).pipe(
      tap(response => {
        const groupedCart = this.groupCartItems(response);
        this.cartSubject.next(groupedCart);
        console.log('getCart response:', response);
      }),
      catchError(this.handleError('getCart', { items: [] }))
    );
  }

  addToCart(bookId: string, quantity: number): Observable<any> {
    if (!this.userService.isLoggedIn()) {
      return of({ success: false, message: 'User not authenticated' });
    }

    const headers = this.getHeaders();
    return this.http.post(this.apiUrl, { bookId, quantity }, { headers }).pipe(
      tap(response => {
        this.getCart().subscribe();
        this.cartSubject.next(response);
        console.log('addToCart response:', response);
      }),
      catchError(this.handleError('addToCart', { success: false, message: 'Failed to add book to cart' }))
    );
  }

  updateCartItem(bookId: string, quantity: number): Observable<any> {
    if (!this.userService.isLoggedIn()) {
      return of({ success: false, message: 'User not authenticated' });
    }

    const headers = this.getHeaders();
    return this.http.put(`${this.apiUrl}/item/${bookId}`, { quantity }, { headers }).pipe(
      tap(response => {
        this.getCart().subscribe();
        this.cartSubject.next(response);
        console.log('updateCartItem response:', response);
      }),
      catchError(this.handleError('updateCartItem', { success: false, message: 'Failed to update cart item' }))
    );
  }

  removeItemFromCart(bookId: string): Observable<any> {
    if (!this.userService.isLoggedIn()) {
      return of({ success: false, message: 'User not authenticated' });
    }

    const headers = this.getHeaders();
    return this.http.delete(`${this.apiUrl}/item/${bookId}`, { headers }).pipe(
      tap(response => {
        this.getCart().subscribe();
        this.cartSubject.next(response);
        console.log('removeItemFromCart response:', response);
      }),
      catchError(this.handleError('removeItemFromCart', { success: false, message: 'Failed to remove item from cart' }))
    );
  }

  clearCart(): Observable<any> {
    if (!this.userService.isLoggedIn()) {
      return of({ success: false, message: 'User not authenticated' });
    }

    const headers = this.getHeaders();
    return this.http.delete(this.apiUrl, { headers }).pipe(
      tap(response => {
        this.getCart().subscribe();
        this.cartSubject.next(response);
        console.log('clearCart response:', response);
      }),
      catchError(this.handleError('clearCart', { success: false, message: 'Failed to clear cart' }))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      return of(result as T);
    };
  }

  private groupCartItems(cart: any): any {
    const groupedItems = cart.items.reduce((acc: any, item: any) => {
      if (!item.book) {
        console.error('Invalid item structure:', item);
        return acc;
      }
      const existingItem = acc.find((i: any) => i.book._id === item.book._id);
      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        acc.push({ ...item });
      }
      return acc;
    }, []);
    return { ...cart, items: groupedItems };
  }
}
