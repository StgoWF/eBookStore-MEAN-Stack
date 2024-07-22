import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cart: any = null;
  errorMessage: string = '';

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartService.getCart().subscribe(
      cart => {
        this.cart = cart;
        console.log('Cart loaded:', cart);  // Agrega este log
      },
      error => {
        this.errorMessage = error.message;
        console.error('Error loading cart:', error);  // Agrega este log
      }
    );
  }

  clearCart(): void {
    this.cartService.clearCart().subscribe(
      () => {
        this.cart = null;
        console.log('Cart cleared');  // Agrega este log
      },
      error => {
        this.errorMessage = error.message;
        console.error('Error clearing cart:', error);  // Agrega este log
      }
    );
  }
}
