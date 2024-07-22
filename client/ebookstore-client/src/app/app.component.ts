import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from './auth.service';
import { CartService } from './cart.service';
import { NotificationModalComponent } from './notification-modal/notification-modal.component';
import { NotificationService } from './notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isLoggedIn = false;
  isCartSidebarOpen = false;
  cart: any = { items: [] };

  @ViewChild('notificationModal', { static: false }) notificationModal!: NotificationModalComponent;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.authService.isLoggedIn().subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });
    this.loadCart();
  }

  ngAfterViewInit() {
    this.notificationService.registerNotificationModal(this.notificationModal);
  }

  toggleCartSidebar() {
    this.isCartSidebarOpen = !this.isCartSidebarOpen;
  }

  loadCart() {
    this.cartService.getCart().subscribe((cart) => {
      console.log('Cart data:', cart); // Verifica la estructura de los datos aquí
      if (cart && cart.items) {
        this.cart = cart;
      } else {
        console.error('Invalid cart structure:', cart);
      }
    }, error => {
      console.error('Error loading cart:', error);
    });
  }
  

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
  }

  onCartClose() {
    this.isCartSidebarOpen = false;
  }
}
