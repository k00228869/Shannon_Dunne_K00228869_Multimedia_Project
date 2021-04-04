import { Component, OnInit } from '@angular/core';
import { IUser } from 'src/app/interfaces/i-user';
import { BookingService } from 'src/app/services/booking.service';
import { BusinessService } from 'src/app/services/business.service';
import { RescheduleService } from 'src/app/services/reschedule.service';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { Router } from '@angular/router';
const moment = _rollupMoment || _moment;
import { take } from 'rxjs/operators';
import { AuthenticateService } from 'src/app/services/authenticate.service';

@Component({
  selector: 'app-business-notifications',
  templateUrl: './business-notifications.component.html',
  styleUrls: ['./business-notifications.component.css'],
})
export class BusinessNotificationsComponent implements OnInit {
  public user: IUser['user'];
  public cancelledAppointments: IUser['cancellation'][] = [];
  public appointToRemove: IUser['appointment'];
  public hiddenCancellation: boolean;
  duration: string;
  newSchedule: IUser['bookingSchedule'] = {};
  scheduleOfDay: string[] = [];

  constructor(
    public business: BusinessService,
    public reschedule: RescheduleService,
    public booking: BookingService,
    private router: Router,
    public authService: AuthenticateService
  ) {}

  ngOnInit() {
    this.authService.getUserInfo().subscribe(
      // get the current users data
      async (data) => {
        this.user = data; // store data

        // call func to get the cancelled appointments doc
        (await this.reschedule.getCancellationList(this.user.uid))
          .pipe(take(1))
          .subscribe(
            // get the id's of cancelled appointments
            (list) => {
              this.cancelledAppointments = list; // store cancelled appointments

              // if their are no cancellations or the variable is undefined
              if (
                this.cancelledAppointments.length === 0 ||
                this.cancelledAppointments.length === undefined
              ) {
                this.hiddenCancellation = true; // hide cancelled appoiintments, show no cancellations message
              } else {
                this.hiddenCancellation = false; // show cancelled appointments, hide no cancellations message
              }
            }
          );
      }
    );
  }

  // pass in the id of the cancelled appointment
  public completeCancel(cancelled: string) {
    // subscribe to func to get the cancelled appointments data
    this.booking.getAppointment(cancelled).subscribe(async (data) => {
      this.appointToRemove = data[0]; // store cancelled appointments data
      this.duration = this.appointToRemove.serDuration.slice(1, 2); // cut out the duration of the cancelled service
      let amountAsNum = parseInt(this.duration, 10); // cast duration value to num
      await this.booking
        .getBookingSchedule(this.appointToRemove.bid, this.appointToRemove.date) // get schedule data for cancelled date
        .pipe(take(1))
        .subscribe((thedate) => {
          // take(1) ensures the subscription stops after the first observable is emitted
          this.newSchedule.calendarIndex = thedate.calendarIndex; // store the booked date index
          this.newSchedule.date = thedate.date; // store the booked date
          this.scheduleOfDay = Array.from(thedate.availableTimes); // store as array of available hours
          let i = 1; // its 1 because the first hour is added back as the appointment time
          this.scheduleOfDay.push(this.appointToRemove.time); // add booked time back to the schedule
          if (amountAsNum > 1) {
            // if the duration of the services is more than 1 hour
            let startTime = moment(this.appointToRemove.time, 'HH:mm:ss'); // booked time to moment obj
            while (i < amountAsNum) {
              // while there are still hours to add
              let getNextTime = startTime.add(1, 'hour').format('HH:mm:ss'); // add hour to old booking time
              this.scheduleOfDay.push(getNextTime.toString()); // add hour back to array
              startTime = moment(getNextTime, 'HH:mm:ss'); // set start time to last added time
              i++; // increase by 1
            }
          }
          this.newSchedule.availableTimes = [];
          this.newSchedule.availableTimes = Array.from(this.scheduleOfDay); // set schedule for cancelled date
          this.reschedule.editSchedule(this.appointToRemove, this.newSchedule); // call func to update schedule of cancelled date
          this.cancelBusiness(cancelled); // call func to remove appoinment data for business
        });
    });
  }

  // pass in cancelled appointment id
  cancelBusiness(cancelled: string) {
    this.reschedule.deleteCancellation(cancelled, this.user.uid); // delete id from cancellation doc
    this.reschedule.cancelBusBooking(cancelled, this.user.uid); //// remove the appointment from business appointments
    this.changeRoute(this.user.uid); // change route
  }

  changeRoute(id: string) {
    // pass in user id and change route
    this.router.navigate(['/business-view/', id]);
  }
}
