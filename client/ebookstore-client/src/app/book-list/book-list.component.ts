import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookService, BooksResponse } from '../book.service';
import { CartService } from '../cart.service';
import { NotificationService } from '../notification.service';
import { Book } from '../book.model';
import { BookDetailModalComponent } from '../book-detail-modal/book-detail-modal.component';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
  @ViewChild('bookDetailModal') bookDetailModal: BookDetailModalComponent;
  @Input() searchQuery: string = '';

  books: Book[] = [];
  filteredBooks: Book[] = [];
  categories: string[] = [];
  selectedCategories: string[] = [];
  errorMessage: string = '';
  selectedBook: Book | null = null;
  itemsPerPage: number = 10;
  isCategoryDropdownOpen = false;

  constructor(
    private bookService: BookService,
    private cartService: CartService,
    private notificationService: NotificationService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadAllBooks();
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['search'] || '';
      this.filterBooks();
    });
  }

  loadAllBooks(): void {
    this.bookService.getBooks(1, 1000).subscribe(
      (response: BooksResponse) => {
        this.books = response.books;
        this.filterBooks();
      },
      error => {
        this.errorMessage = error.message;
      }
    );
  }

  loadCategories(): void {
    this.bookService.getCategories().subscribe(
      (categories: string[]) => {
        this.categories = categories;
      },
      error => {
        this.errorMessage = error.message;
      }
    );
  }

  addToCart(bookId: string): void {
    this.cartService.addToCart(bookId, 1).subscribe({
      next: () => {
        this.notificationService.showNotification('Book added to cart!');
      },
      error: (error) => {
        this.notificationService.showNotification('Failed to add book to cart');
        console.error(error);
      }
    });
  }

  openBookDetailModal(bookId: string): void {
    this.bookService.getBookById(bookId).subscribe({
      next: (book) => {
        this.selectedBook = book;
        this.bookDetailModal.book = book;
        this.bookDetailModal.isOpen = true;
      },
      error: (error) => {
        this.notificationService.showNotification('Failed to load book details');
        console.error(error);
      }
    });
  }

  closeBookDetailModal(): void {
    this.bookDetailModal.isOpen = false;
    this.selectedBook = null;
  }

  onCategoryChange(event: any): void {
    const category = event.target.value;
    if (event.target.checked) {
      this.selectedCategories.push(category);
    } else {
      this.selectedCategories = this.selectedCategories.filter(cat => cat !== category);
    }
    this.filterBooks();
  }

  filterBooks(): void {
    const filtered = this.books.filter(book => {
      const matchesSearchQuery = this.searchQuery ? book.title.toLowerCase().includes(this.searchQuery.toLowerCase()) : true;
      const matchesCategory = this.selectedCategories.length ? this.selectedCategories.includes(book.genre) : true;
      return matchesSearchQuery && matchesCategory;
    });

    this.filteredBooks = filtered;
  }

  searchBooks(): void {
    this.filterBooks();
  }

  toggleCategoryDropdown(): void {
    this.isCategoryDropdownOpen = !this.isCategoryDropdownOpen;
  }

  openCategoryModal(): void {
    const modal = document.getElementById("categoryModal");
    if (modal) {
      modal.style.display = "block";
    }
  }

  closeCategoryModal(): void {
    const modal = document.getElementById("categoryModal");
    if (modal) {
      modal.style.display = "none";
    }
  }
}
