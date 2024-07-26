import { Component, OnInit, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { CartService } from '../cart.service';
import { NotificationService } from '../notification.service';
import { SearchService } from '../search.service';
import { Book } from '../book.model';
import { BookDetailModalComponent } from '../book-detail-modal/book-detail-modal.component';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit, OnChanges {
  @ViewChild('bookDetailModal') bookDetailModal: BookDetailModalComponent;
  books: Book[] = [];
  categories: string[] = [];
  filteredBooks: Book[] = [];
  selectedBook: Book | null = null;
  searchQuery: string = '';
  selectedCategories: string[] = [];

  isCategoryDropdownOpen: boolean = false;
  isSortDropdownOpen: boolean = false;

  constructor(
    private cartService: CartService,
    private notificationService: NotificationService,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.searchService.searchQuery$.subscribe(query => {
      this.searchQuery = query;
      this.filterBooks();
    });
    this.searchService.selectedCategories$.subscribe(categories => {
      this.selectedCategories = categories;
      this.filterBooks();
    });
    this.searchService.books$.subscribe(books => {
      this.books = books;
      this.updateCategories();
      this.filterBooks();
    });
    this.filterBooks();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.categories || changes.books) {
      this.filterBooks();
    }
  }

  addToCart(bookId: string): void {
    this.cartService.addToCart(bookId, 1).subscribe({
      next: (response) => {
        if (response.success !== false) {
          this.notificationService.showNotification('Book added to cart!', 'success');
        } else {
          this.notificationService.showNotification(response.message || 'Failed to add book to cart.', 'error');
        }
      },
      error: (error) => {
        this.notificationService.showNotification('Failed to add book to cart.', 'error');
        console.error('Error adding book to cart:', error);
      }
    });
  }

  openBookDetailModal(bookId: string): void {
    const selectedBook = this.books.find(book => book._id === bookId);
    if (selectedBook) {
      this.bookDetailModal.book = selectedBook;
      this.bookDetailModal.isOpen = true;
    }
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

  updateCategories(): void {
    const allCategories = new Set<string>();
    this.books.forEach(book => allCategories.add(book.genre));
    this.categories = Array.from(allCategories);
  }

  filterBooks(): void {
    this.filteredBooks = this.books.filter(book => {
      const matchesSearchQuery = this.searchQuery ? book.title.toLowerCase().includes(this.searchQuery.toLowerCase()) : true;
      const matchesCategory = this.selectedCategories.length ? this.selectedCategories.includes(book.genre) : true;
      return matchesSearchQuery && matchesCategory;
    });
  }

  toggleCategoryDropdown(): void {
    this.isCategoryDropdownOpen = !this.isCategoryDropdownOpen;
  }

  toggleSortDropdown(): void {
    this.isSortDropdownOpen = !this.isSortDropdownOpen;
  }

  sortBooks(criteria: string): void {
    if (criteria === 'alphabetical') {
      this.filteredBooks.sort((a, b) => a.title.localeCompare(b.title));
    }
  }
}
