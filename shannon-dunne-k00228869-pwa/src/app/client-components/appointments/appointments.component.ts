import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { IUser } from 'src/app/interfaces/i-user';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { BookingService } from 'src/app/services/booking.service';
import { BusinessService } from 'src/app/services/business.service';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css']
})
export class AppointmentsComponent implements OnInit {
  allBookings: IUser['appointment'][];
  public client: IUser['user'];
  public hidden: boolean = false;
  constructor(
    public booking: BookingService,
    public authService: AuthenticateService,
    public business: BusinessService,
  ) { }

  async ngOnInit() {

    this.booking.getBusinessAppointment().pipe(take(1)).subscribe(
      async (data) => {
          this.allBookings = data;
          if (this.allBookings.length === 0 || this.allBookings.length === undefined)
          {
            this.hidden = true; // hide bookings ui
          }
          else{
            this.hidden = false; // show bookings ui
          }
        }
      );

    this.business.getUserInfo().pipe(take(1)).subscribe(
      (data) =>
      {
        this.client = data;
      }
    );
  }




}
