import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../book.service';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent implements OnInit {
  book: any;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.bookService.getBookById(id).subscribe((data: any) => {
      this.book = data;
    });
  }

  addToCart(book: any): void {
    // Lógica para agregar el libro al carrito
    console.log('Book added to cart:', book);
    // Puedes implementar aquí la lógica para agregar el libro al carrito
  }
}
