// src/app/book-detail-modal/book-detail-modal.component.ts
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Book } from '../book.model';

@Component({
  selector: 'app-book-detail-modal',
  templateUrl: './book-detail-modal.component.html',
  styleUrls: ['./book-detail-modal.component.css']
})
export class BookDetailModalComponent implements OnChanges {
  @Input() isOpen: boolean = false;
  @Input() book: Book | null = null;
  @Output() close = new EventEmitter<void>();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isOpen']) {
      console.log('Modal open state:', this.isOpen);
    }
    if (changes['book']) {
      console.log('Selected book:', this.book);
    }
  }

  closeModal() {
    this.close.emit();
  }
}
