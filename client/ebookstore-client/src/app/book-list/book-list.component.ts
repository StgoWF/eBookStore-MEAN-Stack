import { Component, OnInit } from '@angular/core';
import { BookService } from '../book.service';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
  books: any[] = [];

  constructor(private bookService: BookService) { }

  ngOnInit(): void {
    this.bookService.getBooks().subscribe((data: any[]) => {
      this.books = data;
    });
  }

  addToCart(book: any): void {
    // Lógica para agregar el libro al carrito
    console.log('Book added to cart:', book);
    // Puedes implementar aquí la lógica para agregar el libro al carrito, como llamar a un servicio de carrito
  }
}
