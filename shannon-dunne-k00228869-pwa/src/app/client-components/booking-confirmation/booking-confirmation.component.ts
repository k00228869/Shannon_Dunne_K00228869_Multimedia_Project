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
  public serInfo: IUser['service'];
  public empInfo: IUser['employee'];
  public id: string;

  constructor(
    private route: ActivatedRoute,
    public business: BusinessService,
    public clientService: ClientUserService,
    private location: Location,
    public authService: AuthenticateService,
    public booking: BookingService
  ) { }

  ngOnInit(){
    this.clientService.getUserInfo().subscribe(
      (data) =>
      {
        this.client = data;
        // console.log(this.client);
      }
    );

    this.route.paramMap.subscribe(
      (params) =>
      {
        this.id = params.get('id');
        this.booking.getAppointment(this.id).subscribe(
          (appoint) =>
          {
            console.log(appoint);
            this.appointmentInfo = appoint;
            this.business.getABusiness(this.appointmentInfo.bid).subscribe(
              (bus) => {
                console.log(bus);
                this.busInfo = bus;
              }
            );
          }
        );
        this.business.getBusServices(this.busInfo.id).subscribe(
          (ser) => {
            console.log(ser);
            this.serInfo = ser;

          }
        );
        this.business.getBusEmployees(this.busInfo.id).subscribe(
          (emp) => {
            console.log(emp);
            this.empInfo = emp;
          }
        );
      });
  }

  cancel()
    {
      this.location.back();
    }

}
