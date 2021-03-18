import { Component, OnInit } from '@angular/core';
import { IUser } from 'src/app/i-user';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { BookingService } from 'src/app/services/booking.service';
import { BusinessService } from 'src/app/services/business.service';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.css']
})
export class NotificationListComponent implements OnInit {
  public appointmentInfo: IUser['appointment'];
  public id: string;
  public busInfo: IUser['business'];
  client: IUser['user'];
  constructor(
    public booking: BookingService,
    public business: BusinessService,
    public authService: AuthenticateService,


  ) { }

  ngOnInit(){

    this.booking.getBusinessAppointment().subscribe(
      (appoint) =>
       {
         this.appointmentInfo = appoint[0];
         // console.log(this.appointmentInfo.bid);
         this.business.getABusiness(this.appointmentInfo.bid).subscribe(
         (bus) =>
         {
           // console.log(bus);
           this.busInfo = bus[0];
         });
       });

    this.business.getUserInfo().subscribe(
        (data) =>
        {
          this.client = data;
        }
      );
  }

}

// notification is triggered by timestamp
// get notification id
// get data with notification id and display in list
