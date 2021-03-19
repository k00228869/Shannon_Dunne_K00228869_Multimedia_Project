import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IUser } from 'src/app/i-user';
import { BusinessService } from 'src/app/services/business.service';
import { ClientUserService } from 'src/app/services/client-user.service';
import { Location } from '@angular/common';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { BookingService } from 'src/app/services/booking.service';
import { RescheduleService } from 'src/app/services/reschedule.service';
import {MatDialog, MatDialogRef, MatDialogConfig} from '@angular/material/dialog';
import { CancelComponent } from 'src/app/client-components/booking-confirmation/cancel/cancel.component';
import { default as _rollupMoment } from 'moment';
import * as _moment from 'moment';
const moment = _rollupMoment || _moment;

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
  duration: string;
  scheduleOfDay: string[] = [];

  constructor(
    private route: ActivatedRoute,
    public business: BusinessService,
    public clientService: ClientUserService,
    private location: Location,
    public authService: AuthenticateService,
    public booking: BookingService,
    public reschedule: RescheduleService,
    private dialog: MatDialog

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
            // console.log(this.appointmentInfo.bid);
            this.business.getABusiness(this.appointmentInfo.bid).subscribe(
            (bus) =>
            {
              // console.log(bus);
              this.busInfo = bus[0];
            });
          });
      });
    this.clientService.getUserInfo().subscribe(
      (data) =>
      {
        this.client = data;
      });
    this.booking.getBookingSchedule(this.appointmentInfo.bid, this.appointmentInfo.date).subscribe(
        (data) => {
          this.scheduleOfDay = Array.from(data.availableTimes);
        });

        
  }

  cancel()
  {
    this.location.back();
  }


  openDialog()
  {
    const dialogConfiguation = new MatDialogConfig(); // creating instance of matdialog
    dialogConfiguation.disableClose = true; // ensures dialog does not close by clicking outside the box
    dialogConfiguation.data = {id: this.id, clientId: this.client.uid}; // set data to pass to cancel component
    // this.dialog.open(CancelComponent, dialogConfiguation);
    const dialogRef = this.dialog.open(CancelComponent, dialogConfiguation); // display cancel component

    dialogRef.afterClosed().subscribe(data => {
      if (data)
      {
        console.log('dialog data', data);
      }
    });
  }


  // cancelBusiness()
  // {
  //   this.duration = this.appointmentInfo.serDuration.slice(1, 2);
  //   let amountAsNum = parseInt(this.duration); // cast to num
  //   let i = 0;
  //   if (amountAsNum > 1) // if the duration is more than 1 hour
  //   {
  //     while (i < amountAsNum){ // while i is less than the number of hours
  //       const rescheduleAt = moment(this.appointmentInfo.time, 'HH:mm:ss'); // get old booking time as moment obj
  //       let theTime = rescheduleAt.add(1, 'hour').format('HH:mm:ss'); // add hour to old booking time to get end time
  //       this.scheduleOfDay.push(theTime); // add time value to array holding the hours for the old booking date
  //       i++;
  //     }
  //   }
  //   else if (amountAsNum <= 1)
  //   {
  //     this.scheduleOfDay.push(this.appointmentInfo.time); // add time to array of availabilities
  //   }
  // }

}

