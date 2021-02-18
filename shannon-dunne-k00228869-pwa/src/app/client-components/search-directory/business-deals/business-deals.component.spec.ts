import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessDealsComponent } from './business-deals.component';

describe('BusinessDealsComponent', () => {
  let component: BusinessDealsComponent;
  let fixture: ComponentFixture<BusinessDealsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessDealsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessDealsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
