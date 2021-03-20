import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvertiseAppointmentComponent } from './advertise-appointment.component';

describe('AdvertiseAppointmentComponent', () => {
  let component: AdvertiseAppointmentComponent;
  let fixture: ComponentFixture<AdvertiseAppointmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvertiseAppointmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvertiseAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
