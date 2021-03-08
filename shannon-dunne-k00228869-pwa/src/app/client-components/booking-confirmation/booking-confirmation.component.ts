import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IUser } from 'src/app/i-user';
import { BusinessService } from 'src/app/services/business.service';
import { ClientUserService } from 'src/app/services/client-user.service';
import { Location } from '@angular/common';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { BookingService } from 'src/app/services/booking.service';

@Component({
  selector: 'app-booking-confirmation',
  templateUrl: './booking-confirmation.component.html',
  styleUrls: ['./booking-confirmation.component.css']
})
export class BookingConfirmationComponent implements OnInit {
  public client: IUser['user'];
  public appointmentInfo: IUser['appointment'];
  public busInfo: IUser['business'];
  public id: string;

  constructor(
    private route: ActivatedRoute,
    public business: BusinessService,
    public clientService: ClientUserService,
    private location: Location,
    public authService: AuthenticateService,
    public booking: BookingService
  ) {}

  ngOnInit(){
    this.route.paramMap.subscribe(
      (params) =>
      {
        this.id = params.get('id');
        this.booking.getAppointment(this.id).subscribe(
         (appoint) =>
          {
            this.appointmentInfo = appoint[0];
            console.log(this.appointmentInfo.bid);
            this.business.getABusiness(this.appointmentInfo.bid).subscribe(
            (bus) =>
            {
              console.log(bus);
              this.busInfo = bus[0];
            });
          });
        
      });
    this.clientService.getUserInfo().subscribe(
      (data) =>
      {
        this.client = data;
      });
  }

  cancel()
  {
    this.location.back();
  }

}
