import { Component, OnInit } from '@angular/core';
import { BookService } from '../book.service';
import { CartService } from '../cart.service';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
  books: any[] = [];
  errorMessage: string = '';

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
}
