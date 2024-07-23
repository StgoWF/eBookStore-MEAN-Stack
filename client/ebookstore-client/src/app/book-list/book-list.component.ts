// src/app/book-list/book-list.component.ts
import { Component, OnInit } from '@angular/core';
import { BookService } from '../book.service';
import { CartService } from '../cart.service';
import { NotificationService } from '../notification.service';
import { Book } from '../book.model';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
  books: Book[] = [];
  errorMessage: string = '';
  selectedBook: Book | null = null;
  isBookDetailModalOpen: boolean = false;

  constructor(
    private bookService: BookService,
    private cartService: CartService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.bookService.getBooks().subscribe(
      books => {
        this.books = books;
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
        console.log('Loaded book:', book);
        this.selectedBook = book;
        this.isBookDetailModalOpen = true;
      },
      error: (error) => {
        this.notificationService.showNotification('Failed to load book details');
        console.error(error);
      }
    });
  }

  closeBookDetailModal(): void {
    this.isBookDetailModalOpen = false;
  }
}
