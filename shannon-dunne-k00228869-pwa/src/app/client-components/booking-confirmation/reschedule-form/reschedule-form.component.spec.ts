import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RescheduleFormComponent } from './reschedule-form.component';

describe('RescheduleFormComponent', () => {
  let component: RescheduleFormComponent;
  let fixture: ComponentFixture<RescheduleFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RescheduleFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RescheduleFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
