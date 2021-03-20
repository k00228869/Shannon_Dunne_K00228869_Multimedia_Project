import { Component, OnInit } from '@angular/core';
import { IUser } from 'src/app/i-user';
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
  public hidden = true;
  constructor(
    public booking: BookingService,
    public authService: AuthenticateService,
    public business: BusinessService,
  ) { }

  ngOnInit() {
    this.booking.getBusinessAppointment().subscribe(
      (data) => {
        console.log(data[0]);
        if (!data)
        {
          this.hidden = false;
        }
        this.allBookings = data;
      }
    );

    this.business.getUserInfo().subscribe(
      (data) =>
      {
        this.client = data;
      }
    );
  }




}
