import { Component, OnInit, ViewChild, HostListener, ElementRef, Renderer2 } from '@angular/core';
import { AuthService } from './auth.service';
import { CartService } from './cart.service';
import { NotificationModalComponent } from './notification-modal/notification-modal.component';
import { NotificationService } from './notification.service';
import { BookService } from './book.service';
import { Book } from './book.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isLoggedIn = false;
  isCartSidebarOpen = false;
  isMenuModalOpen = false;
  cart: any = { items: [] };
  searchQuery: string = '';
  books: Book[] = [];
  filteredBooks: Book[] = [];
  categories: string[] = [];

  @ViewChild('notificationModal', { static: false }) notificationModal!: NotificationModalComponent;
  @ViewChild('menuModal', { static: false }) menuModal!: ElementRef;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private notificationService: NotificationService,
    private bookService: BookService,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.authService.isLoggedIn().subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      console.log('User logged in status:', isLoggedIn);
    });
    this.loadCart();
    this.loadBooks();
    this.loadCategories();
  }

  ngAfterViewInit() {
    this.notificationService.registerNotificationModal(this.notificationModal);
    console.log('Notification modal registered');

    this.renderer.listen('document', 'click', (event) => {
      if (this.isMenuModalOpen && !this.menuModal.nativeElement.contains(event.target)) {
        this.closeMenuModal();
        console.log('Menu modal closed due to outside click');
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    console.log('Window resized to:', window.innerWidth);
    if (window.innerWidth > 768) {
      this.isMenuModalOpen = false;
      console.log('Window width > 768, closing menu modal');
    }
  }

  toggleCartSidebar() {
    this.isCartSidebarOpen = !this.isCartSidebarOpen;
    console.log('Cart sidebar toggled, new state:', this.isCartSidebarOpen);
  }

  loadCart() {
    this.cartService.getCart().subscribe((cart) => {
      console.log('Cart data loaded:', cart); // Verifica la estructura de los datos aquí
      if (cart && cart.items) {
        this.cart = cart;
        console.log('Cart items set:', this.cart.items);
      } else {
        console.error('Invalid cart structure:', cart);
      }
    }, error => {
      console.error('Error loading cart:', error);
    });
  }

  loadBooks() {
    this.bookService.getBooks().subscribe(
      response => {
        this.books = response.books;
        this.filteredBooks = response.books;
        console.log('Books loaded:', this.books);
      },
      error => {
        console.error('Error loading books:', error);
      }
    );
  }

  loadCategories() {
    this.bookService.getCategories().subscribe(
      (categories: string[]) => {
        this.categories = categories;
        console.log('Categories loaded:', this.categories);
      },
      error => {
        console.error('Error loading categories:', error);
      }
    );
  }

  searchBooks() {
    this.filteredBooks = this.books.filter(book => 
      book.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      book.description.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
    console.log('Filtered books:', this.filteredBooks);
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    console.log('User logged out');
  }

  onCartClose() {
    this.isCartSidebarOpen = false;
    console.log('Cart sidebar closed');
  }

  openMenuModal(): void {
    this.isMenuModalOpen = true;
    console.log('Menu modal opened');
  }

  closeMenuModal(): void {
    this.isMenuModalOpen = false;
    console.log('Menu modal closed');
  }
}
