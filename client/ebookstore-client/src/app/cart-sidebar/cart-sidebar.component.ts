import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router'; // Importa Router
import { CartService } from '../cart.service';
import { UserService } from '../user.service'; // Importa UserService

@Component({
  selector: 'app-cart-sidebar',
  templateUrl: './cart-sidebar.component.html',
  styleUrls: ['./cart-sidebar.component.css']
})
export class CartSidebarComponent implements OnInit {
  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();
  cart: any = { items: [] };

  constructor(
    private cartService: CartService, 
    private router: Router, 
    private userService: UserService // Inyecta UserService
  ) {}

  ngOnInit() {
    if (this.userService.isLoggedIn()) {
      this.loadCart();
    }
  }

  loadCart(): void {
    if (!this.userService.isLoggedIn()) {
      console.error('User not authenticated');
      return;
    }
    this.cartService.getCart().subscribe(
      cart => {
        this.cart = cart;
        console.log('Cart loaded in sidebar:', cart);
      },
      error => {
        console.error('Error loading cart in sidebar:', error);
      }
    );
  }

  updateQuantity(bookId: string, quantity: number) {
    if (!this.userService.isLoggedIn()) {
      console.error('User not authenticated');
      return;
    }
    this.cartService.updateCartItem(bookId, quantity).subscribe();
  }

  removeFromCart(bookId: string) {
    if (!this.userService.isLoggedIn()) {
      console.error('User not authenticated');
      return;
    }
    this.cartService.removeItemFromCart(bookId).subscribe();
  }

  clearCart() {
    if (!this.userService.isLoggedIn()) {
      console.error('User not authenticated');
      return;
    }
    this.cartService.clearCart().subscribe();
  }

  getTotal() {
    return this.cart.items.reduce((total, item) => total + item.book.price * item.quantity, 0);
  }

  checkout() {
    if (!this.userService.isLoggedIn()) {
      console.error('User not authenticated');
      return;
    }
    alert('Proceeding to checkout...');
  }

  closeCart() {
    this.isOpen = false;
    this.close.emit();
  }

  goToCart() {
    this.closeCart();
    this.router.navigate(['/cart']);
  }
}
