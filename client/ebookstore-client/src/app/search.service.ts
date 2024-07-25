import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Book } from './book.model';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchQuerySubject = new BehaviorSubject<string>('');
  searchQuery$ = this.searchQuerySubject.asObservable();

  private selectedCategoriesSubject = new BehaviorSubject<string[]>([]);
  selectedCategories$ = this.selectedCategoriesSubject.asObservable();

  private booksSubject = new BehaviorSubject<Book[]>([]);
  books$ = this.booksSubject.asObservable();

  updateSearchQuery(query: string) {
    this.searchQuerySubject.next(query);
  }

  updateSelectedCategories(categories: string[]) {
    this.selectedCategoriesSubject.next(categories);
  }

  updateBooks(books: Book[]) {
    this.booksSubject.next(books);
  }
}
