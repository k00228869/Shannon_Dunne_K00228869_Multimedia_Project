import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IUser } from 'src/app/interfaces/i-user';
import { BusinessService } from 'src/app/services/business.service';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { BookingService } from 'src/app/services/booking.service';
import { RescheduleService } from 'src/app/services/reschedule.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CancelComponent } from 'src/app/client-components/booking-confirmation/cancel/cancel.component';
import { IBusiness } from 'src/app/interfaces/i-business';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-booking-confirmation',
  templateUrl: './booking-confirmation.component.html',
  styleUrls: ['./booking-confirmation.component.css'],
})
export class BookingConfirmationComponent implements OnInit {
  public client: IUser['user'];
  public appointmentInfo: IUser['appointment'];
  public busInfo: IBusiness['business'];
  public id: string;
  duration: string;
  scheduleOfDay: string[] = [];

  constructor(
    private route: ActivatedRoute,
    public business: BusinessService,
    public authService: AuthenticateService,
    public booking: BookingService,
    public reschedule: RescheduleService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    // get id from route
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id'); // store id
      // call func to get appointment
      this.booking
        .getAppointment(this.id)
        .pipe(take(1))
        .subscribe((appoint) => {
          this.appointmentInfo = appoint[0]; // store appointment
          // call func to get business data
          this.business
            .getABusiness(this.appointmentInfo.bid)
            .subscribe((bus) => {
              this.busInfo = bus; // store business data
            });
        });
    });

    // call func to get use data
    this.authService
      .getUserInfo()
      .pipe(take(1))
      .subscribe((data) => {
        this.client = data; // store user data
      });

    // call func to get the booked date doc
    this.booking
      .getBookingSchedule(this.appointmentInfo.bid, this.appointmentInfo.date)
      .pipe(take(1))
      .subscribe((data) => {

        // store array of available times from booked date doc
        this.scheduleOfDay = Array.from(data.availableTimes);
      });
  }

  // opens cancel dialog when triggered
  openDialog() {
    const dialogConfiguation = new MatDialogConfig(); // creating instance of matdialog
    dialogConfiguation.disableClose = true; // ensures dialog does not close by clicking outside the box
    dialogConfiguation.data = {
      // data to pas to cancel component
      id: this.id, // appointment id
      clientId: this.client.uid, // client id
      busId: this.appointmentInfo.bid, // business id
      date: this.appointmentInfo.date,
    }; // set data to pass to cancel component
    const dialogRef = this.dialog.open(CancelComponent, dialogConfiguation); // display cancel component
    dialogRef.afterClosed(); // returns observable when finished closing cancel dialog
  }
}
