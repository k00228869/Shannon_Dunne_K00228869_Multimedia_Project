import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookDealComponent } from './book-deal.component';

describe('BookDealComponent', () => {
  let component: BookDealComponent;
  let fixture: ComponentFixture<BookDealComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookDealComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookDealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
