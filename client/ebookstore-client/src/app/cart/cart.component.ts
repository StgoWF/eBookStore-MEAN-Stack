import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cart: any = null;
  errorMessage: string = '';

  constructor(
    private cartService: CartService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartService.getCart().subscribe(
      cart => {
        this.cart = cart;
        console.log('Cart loaded:', cart);
      },
      error => {
        this.errorMessage = error.message;
        console.error('Error loading cart:', error);
      }
    );
  }

  clearCart(): void {
    this.cartService.clearCart().subscribe(
      () => {
        this.cart = { items: [] };
        this.notificationService.showNotification('Cart cleared!');
        console.log('Cart cleared');
      },
      error => {
        this.errorMessage = error.message;
        console.error('Error clearing cart:', error);
      }
    );
  }

  increaseQuantity(bookId: string): void {
    const item = this.cart.items.find((item: any) => item.book._id === bookId);
    if (item) {
      this.updateQuantity(bookId, item.quantity + 1);
    }
  }

  decreaseQuantity(bookId: string): void {
    const item = this.cart.items.find((item: any) => item.book._id === bookId);
    if (item && item.quantity > 1) {
      this.updateQuantity(bookId, item.quantity - 1);
    } else if (item && item.quantity === 1) {
      this.removeFromCart(bookId);
    }
  }

  updateQuantity(bookId: string, quantity: number): void {
    this.cartService.updateCartItem(bookId, quantity).subscribe(
      cart => {
        this.cart = cart;
        console.log('Cart updated:', cart);
      },
      error => {
        this.errorMessage = error.message;
        console.error('Error updating cart:', error);
      }
    );
  }

  removeFromCart(bookId: string): void {
    this.cartService.removeItemFromCart(bookId).subscribe(
      cart => {
        this.cart = cart;
        this.notificationService.showNotification('Book removed from cart!');
        console.log('Item removed from cart:', cart);
      },
      error => {
        this.errorMessage = error.message;
        console.error('Error removing item from cart:', error);
      }
    );
  }

  getTotal(): number {
    return this.cart.items.reduce((total: number, item: any) => total + (item.book.price * item.quantity), 0);
  }

  checkout(): void {
    alert('Proceeding to checkout...');
  }
}
