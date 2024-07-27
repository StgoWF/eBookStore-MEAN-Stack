// src/app/book-detail-modal/book-detail-modal.component.ts
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Book } from '../book.model';
import { CartService } from '../cart.service';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-book-detail-modal',
  templateUrl: './book-detail-modal.component.html',
  styleUrls: ['./book-detail-modal.component.css']
})
export class BookDetailModalComponent implements OnChanges {
  @Input() isOpen: boolean = false;
  @Input() book: Book | null = null;
  @Output() close = new EventEmitter<void>();
  quantity: number = 1;

  constructor(
    private cartService: CartService,
    private notificationService: NotificationService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isOpen']) {
      console.log('Modal open state:', this.isOpen);
    }
    if (changes['book']) {
      console.log('Selected book in modal:', this.book);
      if (this.book) {
        console.log('Book apiDescription:', this.book.apiDescription);
        this.quantity = 1;
      }
    }
  }

  closeModal() {
    this.close.emit();
  }

  increaseQuantity() {
    this.quantity++;
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(bookId: string) {
    this.cartService.addToCart(bookId, this.quantity).subscribe({
      next: () => {
        this.notificationService.showNotification('Book added to cart!', 'success');
        this.closeModal();
      },
      error: (error) => {
        this.notificationService.showNotification('Failed to add book to cart', 'error');
        console.error(error);
      }
    });
  }
}
