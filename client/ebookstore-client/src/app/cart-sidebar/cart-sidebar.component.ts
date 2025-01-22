import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../cart.service';
import { UserService } from '../user.service';

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
    private userService: UserService
  ) {}

  ngOnInit() {
    this.loadCart();
    this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
      console.log('Cart updated in sidebar:', cart);
    });
  }

  loadCart(): void {
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
    this.cartService.updateCartItem(bookId, quantity).subscribe();
  }

  removeFromCart(bookId: string) {
    this.cartService.removeItemFromCart(bookId).subscribe();
  }

  clearCart() {
    this.cartService.clearCart().subscribe();
  }

  getTotal() {
    return this.cart.items.reduce((total, item) => total + item.book.price * item.quantity, 0);
  }

  checkout() {
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
