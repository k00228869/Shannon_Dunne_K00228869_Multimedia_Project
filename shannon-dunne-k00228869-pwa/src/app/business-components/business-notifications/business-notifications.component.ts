import { Component, OnInit } from '@angular/core';
import { IUser } from 'src/app/i-user';
import { BookingService } from 'src/app/services/booking.service';
import { BusinessService } from 'src/app/services/business.service';
import { RescheduleService } from 'src/app/services/reschedule.service';

@Component({
  selector: 'app-business-notifications',
  templateUrl: './business-notifications.component.html',
  styleUrls: ['./business-notifications.component.css']
})
export class BusinessNotificationsComponent implements OnInit {
  public user: IUser['user'];
  public cancelledAppointments: string[];
  public appointToRemove: IUser['appointment'];
  public hidden: boolean;
  duration: string;
  newSchedule: IUser['bookingSchedule'] = {};
  scheduleOfDay: string[] = [];


  constructor(
    public business: BusinessService,
    public reschedule: RescheduleService,
    public booking: BookingService

  ) { }

  ngOnInit(){
    this.business.getUserInfo().subscribe( // get the current users data
      (data) =>
      {
        this.user = data;
      });

    this.reschedule.getCancellationList(this.user.uid).subscribe( // get the id's of cancelled appointments
        (data) =>
        {
          if (data)
          {
            this.cancelledAppointments = data;
            this.hidden = false; // all cancelled notification to display
          }
          else{
            this.hidden = true; // hide cancelled notification
          }
        });
  }

public completeCancel(cancelled) // pass in the id of the cancelled appointment
{
  this.booking.getAppointment(cancelled).subscribe( // subscribe to func to get the cancelled appointments data
    (data) => {
      console.log(data[0]);
      this.appointToRemove = data; // the cancelled appointments data
      this.duration = this.appointToRemove.serDuration.slice(1, 2); // cut out the duration of the service
      let amountAsNum = parseInt(this.duration); // cast duration value to num
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
        else if (amountAsNum <= 1) // if the duration is 1 hour
        {
          this.scheduleOfDay.push(this.appointToRemove.time); // add time to array of availabilities
        }
        this.newSchedule.availableTimes = this.scheduleOfDay; // set schedule for cancelled date
      cancelled(cancelled);
    }
  );
 
  //get appointment info
  //add hour to bus schedule
  //delete appointment
  //delete id from cancelled list
}




  cancelBusiness(cancelled)
  {
    this.reschedule.deleteCancellation(cancelled, this.user.uid); // delete id from cancellation doc
    this.reschedule.cancelBusBooking(cancelled, this.user.uid); //// remove the appointment from business appointments
 
  }


}
