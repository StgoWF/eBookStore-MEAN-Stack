import { Component, OnInit } from '@angular/core';
import { BookService } from '../book.service';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
  books: any[] = [];

  constructor(private bookService: BookService, private cartService: CartService) { }

  ngOnInit(): void {
    this.bookService.getBooks().subscribe((data: any[]) => {
      this.books = data;
    });
  }

  addToCart(book: any): void {
    this.cartService.addToCart(book._id, 1).subscribe(
      response => {
        console.log('Book added to cart:', response);
      },
      error => {
        console.error('Error adding book to cart:', error);
      }
    );
  }
}