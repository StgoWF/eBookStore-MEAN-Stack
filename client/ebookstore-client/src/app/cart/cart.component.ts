import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CartService } from '../cart.service';
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router';

declare var paypal: any;

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, AfterViewInit {
  cart: any = { items: [] };
  errorMessage: string = '';

  constructor(
    private cartService: CartService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
    this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
      console.log('Cart updated:', cart);
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initializePaypal();
    }, 0);
  }

  loadCart(): void {
    this.cartService.getCart().subscribe(
      cart => {
        this.cart = cart;
        console.log('Cart loaded:', cart);
        setTimeout(() => {
          this.initializePaypal();
        }, 0);
      },
      error => {
        this.errorMessage = 'Error loading cart: ' + error.message;
        console.error('Error loading cart:', error);
      }
    );
  }

  clearCart(): void {
    this.cartService.clearCart().subscribe(
      () => {
        this.notificationService.showNotification('Cart cleared!');
        console.log('Cart cleared');
        this.loadCart();
      },
      error => {
        this.errorMessage = 'Error clearing cart: ' + error.message;
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
    if (!bookId) {
      console.error('Book ID is undefined');
      return;
    }
    this.cartService.updateCartItem(bookId, quantity).subscribe(
      () => {
        console.log('Quantity updated');
        this.loadCart();
      },
      error => {
        this.notificationService.showNotification('Error updating quantity: ' + error.message);
        console.error('Error updating quantity:', error);
      }
    );
  }

  removeFromCart(bookId: string): void {
    if (!bookId) {
      console.error('Book ID is undefined');
      return;
    }
    this.cartService.removeItemFromCart(bookId).subscribe(
      () => {
        this.notificationService.showNotification('Book removed from cart!');
        console.log('Item removed from cart');
        this.loadCart();
      },
      error => {
        this.notificationService.showNotification('Error removing item from cart: ' + error.message);
        console.error('Error removing item from cart:', error);
      }
    );
  }

  getTotal(): number {
    return parseFloat(this.cart.items.reduce((total: number, item: any) => total + (item.book.price * item.quantity), 0).toFixed(2));
  }

  async initializePaypal(): Promise<void> {
    const paypalContainer = document.getElementById('paypal-button-container');
    if (paypalContainer) {
      paypalContainer.innerHTML = ''; // Clear the container before rendering
      paypal.Buttons({
        env: 'sandbox', // Ensure this is set to sandbox for testing
        client: {
          sandbox: 'YOUR_SANDBOX_CLIENT_ID', // Replace with your sandbox clientId
        },
        style: {
          shape: 'rect',
          color: 'gold',
          layout: 'vertical',
          label: 'paypal',
          tagline: false,
          height: 40,
        },
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: this.getTotal().toString()
              }
            }]
          });
        },
        onApprove: (data, actions) => {
          return actions.order.capture().then(async (details) => {
            console.log('Transaction approved:', details);
            try {
              await this.clearCartAsync();
              this.notificationService.showNotification('Transaction completed by ' + details.payer.name.given_name);
              this.router.navigate(['/payment-confirmation'], { queryParams: { success: true } });
            } catch (error) {
              console.error('Error clearing cart:', error);
              this.router.navigate(['/payment-confirmation'], { queryParams: { success: false } });
            }
          }).catch(err => {
            console.error('Error capturing order:', err);
            this.router.navigate(['/payment-confirmation'], { queryParams: { success: false } });
          });
        },
        onError: (err) => {
          console.error('Error during PayPal transaction', err);
        }
      }).render('#paypal-button-container');
    } else {
      console.error('PayPal button container not found');
    }
  }

  clearCartAsync(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.cartService.clearCart().subscribe(
        () => {
          console.log('Cart cleared');
          resolve();
        },
        error => {
          console.error('Error clearing cart:', error);
          reject(error);
        }
      );
    });
  }
}
