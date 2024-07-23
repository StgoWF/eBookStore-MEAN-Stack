import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookDetailModalComponent } from './book-detail-modal.component';

describe('BookDetailModalComponent', () => {
  let component: BookDetailModalComponent;
  let fixture: ComponentFixture<BookDetailModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookDetailModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
