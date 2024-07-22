import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:5001/api/cart';
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
    const headers = this.getHeaders();
    return this.http.get(this.apiUrl, { headers }).pipe(
      tap(response => {
        const groupedCart = this.groupCartItems(response);
        this.cartSubject.next(groupedCart);
        console.log('getCart response:', response);
      }),
      catchError(this.handleError)
    );
  }

  addToCart(bookId: string, quantity: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(this.apiUrl, { bookId, quantity }, { headers }).pipe(
      tap(response => {
        this.getCart().subscribe();
        console.log('addToCart response:', response);
      }),
      catchError(this.handleError)
    );
  }

  updateCartItem(bookId: string, quantity: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.put(`${this.apiUrl}/item/${bookId}`, { quantity }, { headers }).pipe(
      tap(response => {
        this.getCart().subscribe();
        console.log('updateCartItem response:', response);
      }),
      catchError(this.handleError)
    );
  }

  removeItemFromCart(bookId: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete(`${this.apiUrl}/item/${bookId}`, { headers }).pipe(
      tap(response => {
        this.getCart().subscribe();
        console.log('removeItemFromCart response:', response);
      }),
      catchError(this.handleError)
    );
  }

  clearCart(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete(this.apiUrl, { headers }).pipe(
      tap(response => {
        this.getCart().subscribe();
        console.log('clearCart response:', response);
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }

  private groupCartItems(cart: any): any {
    const groupedItems = cart.items.reduce((acc: any, item: any) => {
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
