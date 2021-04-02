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
  styleUrls: ['./business-notifications.component.css']
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
    public authService: AuthenticateService,

  ) { }

   ngOnInit(){
    this.business.getUserInfo().subscribe( // get the current users data
      async (data) =>
      {
        this.user = data;
        (await this.reschedule.getCancellationList(this.user.uid)).subscribe( // get the id's of cancelled appointments
        (list) =>
        {
          if (list)
          {
            this.cancelledAppointments = list;
            this.hiddenCancellation = false; // all cancelled notification to display
          }
          else{
            this.hiddenCancellation = true; // hide cancelled notification
          }
        });
      });
  }

public completeCancel(cancelled: string) // pass in the id of the cancelled appointment
{
   // subscribe to func to get the cancelled appointments data, take ensures this is not called when the schedule is updated
  this.booking.getAppointment(cancelled).subscribe(
    async (data) => {
      this.appointToRemove = data[0]; // the cancelled appointments data
      this.duration = this.appointToRemove.serDuration.slice(1, 2); // cut out the duration of the service
      let amountAsNum = parseInt(this.duration, 10); // cast duration value to num
      await this.booking.getBookingSchedule(this.appointToRemove.bid, this.appointToRemove.date) // get schedule for date
      .pipe(take(1)).subscribe((thedate) => {
        this.newSchedule.calendarIndex = thedate.calendarIndex;
        this.newSchedule.date = thedate.date;
        this.scheduleOfDay = Array.from(thedate.availableTimes); // store as array of available hours
        let i = 1;
        this.scheduleOfDay.push(this.appointToRemove.time);
        if (amountAsNum > 1) // if the hours are more than 1
        {
          let startTime = moment(this.appointToRemove.time, 'HH:mm:ss'); // booked time to moment obj
          while (i < amountAsNum) // while there are still hours to add
          {
            let getNextTime = startTime.add(1, 'hour').format('HH:mm:ss'); // add hour to old booking time
            this.scheduleOfDay.push(getNextTime.toString()); // add hours to array
            startTime = moment(getNextTime, 'HH:mm:ss'); // set start time to last added time
            i++; // increase by 1
          }
        }
        this.newSchedule.availableTimes = [];
        this.newSchedule.availableTimes = Array.from(this.scheduleOfDay); // set schedule for cancelled date
        this.reschedule.editSchedule(this.appointToRemove, this.newSchedule); // call func to update schedule of hours in db
        this.cancelBusiness(cancelled); // call func to remove appoinment data
        });
    });
}

  cancelBusiness(cancelled: string)
  {
    this.reschedule.deleteCancellation(cancelled, this.user.uid); // delete id from cancellation doc
    this.reschedule.cancelBusBooking(cancelled, this.user.uid); //// remove the appointment from business appointments
    this.changeRoute(this.user.uid); // change route
  }

  changeRoute(id: string){
    this.router.navigate(['/business-view/', id]);
  }
}
