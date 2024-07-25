import { Component, OnInit, ViewChild, HostListener, ElementRef, Renderer2 } from '@angular/core';
import { AuthService } from './auth.service';
import { CartService } from './cart.service';
import { NotificationModalComponent } from './notification-modal/notification-modal.component';
import { NotificationService } from './notification.service';
import { BookService } from './book.service';
import { SearchService } from './search.service';
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
  isSortModalOpen = false;
  isCategoryDropdownOpen = false;
  isSortDropdownOpen = false;  // Añadir esta línea
  isMobile = false;
  cart: any = { items: [] };
  searchQuery: string = '';
  books: Book[] = [];
  categories: string[] = [];
  selectedCategories: string[] = [];
  errorMessage: string = '';

  @ViewChild('notificationModal', { static: false }) notificationModal!: NotificationModalComponent;
  @ViewChild('menuModal', { static: false }) menuModal!: ElementRef;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private notificationService: NotificationService,
    private bookService: BookService,
    private renderer: Renderer2,
    private searchService: SearchService
  ) {}

  ngOnInit() {
    this.authService.isLoggedIn().subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });
    this.loadCart();
    this.loadBooks();
    this.loadCategories();
    this.checkIfMobile();
  }

  ngAfterViewInit() {
    this.notificationService.registerNotificationModal(this.notificationModal);

    this.renderer.listen('document', 'click', (event) => {
      if (this.isMenuModalOpen && !this.menuModal.nativeElement.contains(event.target)) {
        this.closeMenuModal();
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkIfMobile();
    if (window.innerWidth > 768) {
      this.isMenuModalOpen = false;
    }
  }

  checkIfMobile() {
    this.isMobile = window.innerWidth <= 768;
  }

  toggleCartSidebar() {
    this.isCartSidebarOpen = !this.isCartSidebarOpen;
  }

  loadCart() {
    this.cartService.getCart().subscribe((cart) => {
      if (cart && cart.items) {
        this.cart = cart;
      } else {
        console.error('Invalid cart structure:', cart);
      }
    }, error => {
      console.error('Error loading cart:', error);
    });
  }

  loadBooks() {
    this.bookService.getBooks(1, 1000).subscribe(
      response => {
        console.log('Books loaded:', response.books);
        this.books = response.books;
        this.searchService.updateBooks(this.books);
      },
      error => {
        console.error('Error loading books:', error);
      }
    );
  }

  loadCategories() {
    this.bookService.getCategories().subscribe(
      (categories: string[]) => {
        console.log('Categories loaded:', categories);
        this.categories = categories;
        this.searchService.updateSelectedCategories(this.selectedCategories);
      },
      error => {
        console.error('Error loading categories:', error);
      }
    );
  }

  searchBooks() {
    console.log('Search query:', this.searchQuery);
    this.searchService.updateSearchQuery(this.searchQuery);
  }

  filterByCategory(category: string) {
    this.selectedCategories = [category];
    this.searchService.updateSelectedCategories(this.selectedCategories);
  }

  sortBooks(criteria: string) {
    if (criteria === 'alphabetical') {
      this.books.sort((a, b) => a.title.localeCompare(b.title));
    } 
    this.searchService.updateBooks(this.books);
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
  }

  onCartClose() {
    this.isCartSidebarOpen = false;
  }

  openMenuModal(): void {
    this.isMenuModalOpen = true;
  }

  closeMenuModal(): void {
    this.isMenuModalOpen = false;
  }

  toggleSortModal(): void {
    this.isSortModalOpen = !this.isSortModalOpen;
  }

  toggleSortDropdown(): void {  // Añadir este método
    this.isSortDropdownOpen = !this.isSortDropdownOpen;
  }

  toggleCategoryDropdown(): void {
    this.isCategoryDropdownOpen = !this.isCategoryDropdownOpen;
  }

  onCategoryChange(event: any): void {
    const category = event.target.value;
    if (event.target.checked) {
      this.selectedCategories.push(category);
    } else {
      this.selectedCategories = this.selectedCategories.filter(cat => cat !== category);
    }
    console.log('Selected categories:', this.selectedCategories);
    this.searchService.updateSelectedCategories(this.selectedCategories);
  }
}
