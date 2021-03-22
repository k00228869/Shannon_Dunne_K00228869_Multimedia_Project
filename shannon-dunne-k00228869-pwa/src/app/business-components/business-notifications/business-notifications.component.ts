import { Component, OnInit } from '@angular/core';
import { IUser } from 'src/app/i-user';
import { BookingService } from 'src/app/services/booking.service';
import { BusinessService } from 'src/app/services/business.service';
import { RescheduleService } from 'src/app/services/reschedule.service';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { Router } from '@angular/router';
const moment = _rollupMoment || _moment;
import { take } from 'rxjs/operators';

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
  editedSchedule: string[] = [];


  constructor(
    public business: BusinessService,
    public reschedule: RescheduleService,
    public booking: BookingService,
    private router: Router,
  ) { }

   ngOnInit(){
    this.business.getUserInfo().subscribe( // get the current users data
      async (data) =>
      {
        console.log('userData', data);
        this.user = data;
        (await this.reschedule.getCancellationList(this.user.uid)).subscribe( // get the id's of cancelled appointments
        (list) =>
        {
          console.log('cancelled ids', list);
          if (list)
          {
            this.cancelledAppointments = list;
            console.log('id list', this.cancelledAppointments);
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
  console.log('completeCancel cancelled ', cancelled);
   // subscribe to func to get the cancelled appointments data, take ensures this is not called when the schedule is updated
  this.booking.getAppointment(cancelled).subscribe(
    async (data) => {
      console.log(data[0]);
      this.appointToRemove = data[0]; // the cancelled appointments data
      console.log('duration', this.appointToRemove.serDuration);
      this.duration = this.appointToRemove.serDuration.slice(1, 2); // cut out the duration of the service
      let amountAsNum = parseInt(this.duration, 10); // cast duration value to num
      await this.booking.getBookingSchedule(this.appointToRemove.bid, this.appointToRemove.date) // get schedule for date
      .pipe(take(1)).subscribe((thedate) => {
        console.log('booked schedule received', thedate);
        this.scheduleOfDay = Array.from(thedate.availableTimes); // store as array of available hours

        let i = 0;
        if (amountAsNum > 1) // if the duration is more than 1 hour
        {
          while (i < amountAsNum){ // while i is less than the number of hours
            const rescheduleAt = moment(this.appointToRemove.time, 'HH:mm:ss'); // get the booking time as moment obj
            let theTime = rescheduleAt.add(1, 'hour').format('HH:mm:ss'); // add an hour to the booking time to get end time
            this.scheduleOfDay.push(theTime); // add time value to array holding the hours for the old booking date
            i++;
          }
        }
        else if (amountAsNum <= 1) // if the duration is 1 hour or less
        {
          this.scheduleOfDay.push(this.appointToRemove.time); // add time to array of availabilities
        }

        console.log('3rd booking schedule', this.scheduleOfDay);
        this.newSchedule.availableTimes = this.scheduleOfDay; // set schedule for cancelled date
        this.reschedule.editBookingSchedule(this.appointToRemove, this.newSchedule); // call func to update schedule of hours in db
        this.cancelBusiness(cancelled); // call func to remove appoinment data
        });
    });
}

  cancelBusiness(cancelled: string)
  {
    console.log('cancelBusiness called', cancelled);
    this.reschedule.deleteCancellation(cancelled, this.user.uid); // delete id from cancellation doc
    this.reschedule.cancelBusBooking(cancelled, this.user.uid); //// remove the appointment from business appointments
    this.changeRoute(this.user.uid); // change route
  }

  changeRoute(id: string){
    this.router.navigate(['/business-view/', id]);
  }
}
