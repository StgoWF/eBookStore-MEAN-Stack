import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CartService } from '../cart.service';
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

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
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    if (this.userService.isLoggedIn()) {
      this.loadCart();
    } else {
      this.errorMessage = 'Please log in to view your cart.';
    }
  }

  ngAfterViewInit(): void {
    if (this.userService.isLoggedIn()) {
      setTimeout(() => {
        this.initializePaypal();
      }, 0);
    }
  }

  loadCart(): void {
    if (!this.userService.isLoggedIn()) {
      this.errorMessage = 'Please log in to view your cart.';
      return;
    }
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
    if (!this.userService.isLoggedIn()) {
      this.errorMessage = 'Please log in to clear your cart.';
      return;
    }
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
    if (!this.userService.isLoggedIn()) {
      this.errorMessage = 'Please log in to update the quantity.';
      return;
    }
    this.cartService.updateCartItem(bookId, quantity).subscribe(
      () => {
        console.log('Quantity updated');
        this.loadCart();
      },
      error => {
        this.errorMessage = 'Error updating quantity: ' + error.message;
        console.error('Error updating quantity:', error);
      }
    );
  }
  removeFromCart(bookId: string): void {
    if (!bookId) {
      console.error('Book ID is undefined');
      return;
    }
    if (!this.userService.isLoggedIn()) {
      this.errorMessage = 'Please log in to remove items from the cart.';
      return;
    }
    this.cartService.removeItemFromCart(bookId).subscribe(
      () => {
        this.notificationService.showNotification('Book removed from cart!');
        console.log('Item removed from cart');
        this.loadCart();
      },
      error => {
        this.errorMessage = 'Error removing item from cart: ' + error.message;
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
      paypalContainer.innerHTML = ''; // Limpiar el contenedor antes de renderizar
      paypal.Buttons({
        env: 'sandbox', // Asegúrate de que esto está configurado para usar sandbox
        client: {
          sandbox: 'AS4Or1-wqmvBkyfj8fC2cnXud-SZWE2jz8t4pEHndW341xHtN_F7jRkkmPPkOPrppph-Rwpat11aptOk', // Reemplaza con tu clientId de sandbox
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
              console.error('Error al limpiar el carrito:', error);
              this.router.navigate(['/payment-confirmation'], { queryParams: { success: false } });
            }
          }).catch(err => {
            console.error('Error capturando la orden:', err);
            this.router.navigate(['/payment-confirmation'], { queryParams: { success: false } });
          });
        },
        onError: (err) => {
          console.error('Error durante la transacción de PayPal', err);
        }
      }).render('#paypal-button-container');
    } else {
      console.error('Contenedor del botón de PayPal no encontrado');
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
