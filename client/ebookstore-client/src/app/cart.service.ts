import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UserService } from './user.service';
import { environment } from '../environments/environment';
import { Book } from './book.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = `${environment.apiUrl}/cart`;
  private cartSubject = new BehaviorSubject<any>({ items: [] });
  cart$ = this.cartSubject.asObservable();
  private hasMergedLocalCart = false;

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) {
    this.loadCartFromLocalStorage();
    this.userService.getLoginStatus().subscribe(loggedIn => {
      if (loggedIn && !this.hasMergedLocalCart) {
        this.mergeLocalCartWithServer();
      }
    });
  }

  private getHeaders(): HttpHeaders {
    const token = this.userService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  private loadCartFromLocalStorage(): void {
    const cart = JSON.parse(localStorage.getItem('cart') || '{"items": []}');
    this.cartSubject.next(cart);
  }

  private saveCartToLocalStorage(cart: any): void {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  private fetchBookDetails(bookId: string): Observable<Book> {
    return this.http.get<Book>(`${environment.apiUrl}/books/${bookId}`);
  }

  private mergeLocalCartWithServer(): void {
    const localCart = this.cartSubject.value;
    if (localCart.items.length === 0) {
      this.loadServerCart();
      return;
    }

    this.getCart().subscribe(serverCart => {
      localCart.items.forEach((localItem: any) => {
        const serverItem = serverCart.items.find((item: any) => item.book._id === localItem.book._id);
        if (serverItem) {
          serverItem.quantity += localItem.quantity;
        } else {
          serverCart.items.push(localItem);
        }
      });

      this.cartSubject.next(serverCart);
      this.saveCartToLocalStorage({ items: [] });

      this.updateServerCart(serverCart).subscribe(() => {
        this.hasMergedLocalCart = true;
        this.loadServerCart();
      });
    });
  }

  private loadServerCart(): void {
    const headers = this.getHeaders();
    this.http.get(this.apiUrl, { headers }).pipe(
      tap(response => {
        const groupedCart = this.groupCartItems(response);
        this.cartSubject.next(groupedCart);
      }),
      catchError(this.handleError('getCart', { items: [] }))
    ).subscribe();
  }

  private updateServerCart(cart: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.put(this.apiUrl, cart, { headers }).pipe(
      catchError(this.handleError('updateServerCart', { success: false }))
    );
  }

  getCart(): Observable<any> {
    if (!this.userService.isLoggedIn()) {
      this.loadCartFromLocalStorage();
      return of(this.cartSubject.value);
    }
    return of(this.cartSubject.value); // Already merged, return current cart
  }

  addToCart(bookId: string, quantity: number): Observable<any> {
    if (!this.userService.isLoggedIn()) {
      return this.fetchBookDetails(bookId).pipe(
        tap(book => {
          const cart = this.cartSubject.value;
          const existingItem = cart.items.find((item: any) => item.book._id === bookId);
          if (existingItem) {
            existingItem.quantity += quantity;
          } else {
            cart.items.push({ book, quantity });
          }
          this.cartSubject.next(cart);
          this.saveCartToLocalStorage(cart);
        }),
        catchError(this.handleError('addToCart', { success: false, message: 'Failed to add book to cart' }))
      );
    }

    const headers = this.getHeaders();
    return this.http.post(this.apiUrl, { bookId, quantity }, { headers }).pipe(
      tap(response => {
        this.getCart().subscribe();
      }),
      catchError(this.handleError('addToCart', { success: false, message: 'Failed to add book to cart' }))
    );
  }

  updateCartItem(bookId: string, quantity: number): Observable<any> {
    if (!this.userService.isLoggedIn()) {
      const cart = this.cartSubject.value;
      const item = cart.items.find((item: any) => item.book._id === bookId);
      if (item) {
        item.quantity = quantity;
        if (item.quantity <= 0) {
          cart.items = cart.items.filter((i: any) => i.book._id !== bookId);
        }
        this.cartSubject.next(cart);
        this.saveCartToLocalStorage(cart);
      }
      return of({ success: true, message: 'Cart item updated' });
    }

    const headers = this.getHeaders();
    return this.http.put(`${this.apiUrl}/item/${bookId}`, { quantity }, { headers }).pipe(
      tap(response => {
        this.getCart().subscribe();
      }),
      catchError(this.handleError('updateCartItem', { success: false, message: 'Failed to update cart item' }))
    );
  }

  removeItemFromCart(bookId: string): Observable<any> {
    if (!this.userService.isLoggedIn()) {
      const cart = this.cartSubject.value;
      cart.items = cart.items.filter((item: any) => item.book._id !== bookId);
      this.cartSubject.next(cart);
      this.saveCartToLocalStorage(cart);
      return of({ success: true, message: 'Item removed from cart' });
    }

    const headers = this.getHeaders();
    return this.http.delete(`${this.apiUrl}/item/${bookId}`, { headers }).pipe(
      tap(response => {
        this.getCart().subscribe();
      }),
      catchError(this.handleError('removeItemFromCart', { success: false, message: 'Failed to remove item from cart' }))
    );
  }

  clearCart(): Observable<any> {
    if (!this.userService.isLoggedIn()) {
      this.cartSubject.next({ items: [] });
      this.saveCartToLocalStorage({ items: [] });
      return of({ success: true, message: 'Cart cleared' });
    }

    const headers = this.getHeaders();
    return this.http.delete(this.apiUrl, { headers }).pipe(
      tap(response => {
        this.getCart().subscribe();
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
