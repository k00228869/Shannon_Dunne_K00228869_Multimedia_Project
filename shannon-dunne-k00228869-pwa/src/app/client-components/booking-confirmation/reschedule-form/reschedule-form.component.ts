import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { IUser } from 'src/app/interfaces/i-user';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { AngularFirestore } from '@angular/fire/firestore';
import { BookingService } from 'src/app/services/booking.service';
import { BusinessService } from 'src/app/services/business.service';
import { RescheduleService } from 'src/app/services/reschedule.service';
import { WorkingDaysService } from 'src/app/services/working-days.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from 'src/app/services/notifications.service';
import { take } from 'rxjs/operators';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { IBusiness } from 'src/app/interfaces/i-business';
const moment = _rollupMoment || _moment;
export const MY_FORMATS = {
  // set selected date format for calendar
  parse: {
    dateInput: 'ddd MMM DD YYYY',
  },
  display: {
    dateInput: 'ddd MMM DD YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'ddd MMM DD YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-reschedule-form',
  templateUrl: './reschedule-form.component.html',
  styleUrls: ['./reschedule-form.component.css'],
  encapsulation: ViewEncapsulation.None, // don not provide style encapsultaion or template
})
export class RescheduleFormComponent implements OnInit {
  editAppointmentForm: FormGroup;
  todaysDate: Date = new Date();
  public newAppointment: IUser['appointment'];
  public setDate: string;
  public client: IUser['user'];
  selectedDay: number;
  unavailableDays: any[] = [];
  theHourOfDay: IUser['hours'];
  public duration: string;
  public day: string[] = [];
  schedule: IUser['bookingSchedule'] = {};
  newSchedule: IUser['bookingSchedule'] = {};
  public weekDays: IUser['scheduleOfDays'][];
  public unavailableDates: any[] = [];
  bookedDays: IUser['bookingSchedule'][];
  tempSchedule: string[] = [];
  user: IUser['user'];
  date: Date;
  momentDate = moment();
  public id: string;
  public appointmentInfo: IUser['appointment'];
  public busInfo: IBusiness['business'];
  scheduleOfDay: string[] = [];

  constructor(
    private editAppointment: FormBuilder,
    public firestore: AngularFirestore,
    public bookingService: BookingService,
    public business: BusinessService,
    public reschedule: RescheduleService,
    public hourService: WorkingDaysService,
    private route: ActivatedRoute,
    public authService: AuthenticateService,
    private router: Router,
    private notif: NotificationsService
  ) {}

  ngOnInit() {
    // build an appointment form group
    this.editAppointmentForm = this.editAppointment.group({
      date: new FormControl([Validators.required]),
      time: new FormControl([Validators.required]),
      note: new FormControl('')
    });

    // call func to get the users data
    this.authService
      .getUserInfo()
      .pipe(take(1))
      .subscribe((data) => {
        this.client = data; // store the user data

        // call func to get the notification subscription token
        this.notif.getToken(this.client.uid).subscribe((theToken) => {
          // call func to get user token from db
          if (!theToken.token) {
            // if no token available
            this.askPermis(); // call func to get user permis
          }
        });
      });

    // get id from route
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id'); // store route id
      // call func to get the appointment that needs to be rescheduled
      this.bookingService
        .getAppointment(this.id)
        .pipe(take(1))
        .subscribe((appoint) => {
          this.appointmentInfo = appoint[0]; // store the appointment data
          this.updateInfo(this.appointmentInfo.bid); // call func to update the users appointment doc
        });
    });
  }

  // pass in business id and call func to get the business' data
  updateInfo(bid: string) {
    this.business.getABusiness(bid).subscribe((bus) => {
      this.busInfo = bus; // store the businesses data
    });

    // call func to get weekly schedule collection
    this.hourService.getAll(this.appointmentInfo.bid).subscribe(
      // get schedule for each day, do not run after fists value
      (all) => {
        this.weekDays = []; // arr to store each day
        this.weekDays = all; // store schedules of each weekday
        for (let i = 0; i < this.weekDays.length; i++) {
          // loop through collection
          if (
            // if the doc has less than 1 hour in its schedule, or if it's undefined
            this.weekDays[i][0].length <= 1 ||
            this.weekDays[i][0].length === undefined
          ) {
            this.unavailableDays.push(this.weekDays[i][1]); // add the day index of the empty day to the unavailable array
          }
        }
      }
    );

    this.unavailableDates = []; // empty array
    // call func to get the documents of the busineses booked days
    this.bookingService
      .getBookedDays(this.appointmentInfo.bid)
      .subscribe((data) => {
        this.bookedDays = data; // store the booke dates
        for (let i = 0; i < this.bookedDays.length; i++) {
          // loop through docs
          // if a booking hours array has 1 or less items
          if (
            this.bookedDays[i].availableTimes.length <= 1 ||
            this.bookedDays[i].availableTimes.length === undefined
          ) {
            // if the doc has less than 1 hour available in its schedule, or if it's undefined
            const newd = new Date(this.bookedDays[i].calendarIndex).getTime(); // convert string timestamp
            this.unavailableDates.push(newd); // add doc name to array of unavailable dates
          }
        }
      });
  }
  // called when booking button clicked
  askPermis() {
    // call func to get notification permission
    this.notif.requestPermission().subscribe();
  }

  // submit appointment data
  public async editAppointSubmit(newAppointment: IUser['appointment']) {
    // if form data is valid
    // form will not validate eventhough fields are valid
    // if (this.editAppointmentForm.status === 'Valid') {
      // setting new appoinment details
    this.newAppointment = this.editAppointmentForm.value; // store form values
    this.newAppointment.date = newAppointment.date.toString(); // format date to string
    this.newAppointment.date = this.setDate; // set the date to the last selected date before booking
    this.newAppointment.timeStamp = new Date(); // set the booking timestamp
    this.newAppointment.serName = this.appointmentInfo.serName; // store service name
    this.newAppointment.phone = this.appointmentInfo.phone;
      // edit schedule for new booking
    this.newAppointment.serDuration = this.appointmentInfo.serDuration;

    let noHours = this.newAppointment.serDuration.slice(1, 2); // slice no. of hours from string
    let totalAsNum = parseInt(noHours, 10); // cast string to num
    let temp: any[] = [];
    let j = 1; // set to 1 as the first time is added outside the loop
    temp.push(this.newAppointment.time); // add booked time to schedule
      // if the duration is more than 1 hour
    if (totalAsNum > 1) {
        let start = moment(this.newAppointment.time, 'HH:mm:ss'); // booked time to moment obj
        // while there are still hours to add
        while (j < totalAsNum) {
          let getNextTime = start.add(1, 'hour').format('HH:mm:ss'); // add an hour to old booking time
          temp.push(getNextTime); // add the time to the array
          start = moment(getNextTime, 'HH:mm:ss'); // set start time to last added time
          j++; // increase by 1
        }
      }
      // get array from day array that do not include the items in the temp array
    const theDayHours = this.day.filter((a) => !temp.includes(a));
    this.schedule.date = this.newAppointment.date; // set the date of the new booking
    this.schedule.availableTimes = [];
    this.schedule.availableTimes = theDayHours; // set the new schedule of the booked date
    this.schedule.calendarIndex = this.date.toString(); // get string value of the date index

      // editing schedule for rescheduled booking
      // call func to get rescheduled date doc
    await this.bookingService
        .getBookingSchedule(this.appointmentInfo.bid, this.appointmentInfo.date)
        .pipe(take(1))
        .subscribe((data) => {
          this.newSchedule.calendarIndex = data.calendarIndex; // get cal index for rescheduled date
          this.newSchedule.date = data.date; // get date for the rescheduled date
          this.scheduleOfDay = Array.from(data.availableTimes); // get array of available times for rescheduled date
          let i = 1;
          this.scheduleOfDay.push(this.appointmentInfo.time); // add booked time to schedule
          // if the service duration is more than 1 hour
          if (totalAsNum > 1) {
            let theStartTime = moment(this.appointmentInfo.time, 'HH:mm:ss'); // booked time as moment obj
            // while there are hours to add
            while (i < totalAsNum) {
              let nextTime = theStartTime.add(1, 'hour').format('HH:mm:ss'); // add hour to old booking time
              this.scheduleOfDay.push(nextTime.toString()); // add time to array
              theStartTime = moment(nextTime, 'HH:mm:ss'); // set start time to last added time
              i++; // increase by 1
            }
          }
          this.newSchedule.availableTimes = [];
          this.newSchedule.availableTimes = Array.from(this.scheduleOfDay); // store new schedule for reschedule date
          // call func to update schedule of hours in db for rescheduled date
          this.reschedule.editSchedule(this.appointmentInfo, this.newSchedule);
        });

      // edit appointment and schedule docs
      // call func to update the booked date schedule
    await this.bookingService.addBookingSchedule(
        this.appointmentInfo.bid,
        this.schedule
      ); // call func to update schedule of hours in db for booked date
    this.reschedule.editSchedule(this.appointmentInfo, this.newSchedule);
    this.reschedule.updateBusAppointment(
        // call func to update the business' appointment data
        this.appointmentInfo,
        this.newAppointment
      ); // call func to update the clients appointment data
    this.reschedule.updateClientAppointment(
        this.appointmentInfo,
        this.newAppointment
      );
      // handle notifications
      // call func to create appointment notification
    this.notif.appoinmtentReminder(this.newAppointment, this.busInfo);
      // call func to create review notification
    this.notif.reviewReminder(this.newAppointment, this.busInfo);
      // call func to delete old review notification
    this.notif.deleteRNotifications(this.busInfo.id);
      // call func to delete old appointment notification
    this.notif.deleteANotifications(this.appointmentInfo.appointmentId);
      // func to change route
    this.changeRoute(this.appointmentInfo.appointmentId);
    // } 
  }

  // function to disable dates/days
  dateFilter = (d: Date) => {
    const day = (d || new Date()).getDay(); // gets the day index of a date
    const ddd = d.getTime(); // gets the calendar dates with time

    // this sets what dates/days are filtered
    return (
      // return the day indexes that are not found in the array
      this.unavailableDays.indexOf(+day) === -1 &&
      // do not return the date indexes that are common to the arrays
      !this.unavailableDates.find((x) => x === ddd)
    );
  };

  // pass in appointment id and display booking confirmation
  changeRoute(id: string) {
    this.router.navigate(['/booking-confirmed/', id]);
  }

  // this is triggered everytime a date is selected on the calendar, unless the date is disabled
  newInput(
    event // pass in date change event
  ) {
    // store the event value (for calendar index)
    this.date = new Date(event.value);
    // the selected date as a moment obj
    this.momentDate = moment(event.value);
    // gets the week day index of a selected date
    this.selectedDay = this.momentDate.day();
    // formatting the selected date
    this.setDate = this.momentDate.format('ddd MMM DD YYYY');
    // call func to get schedule of selected date
    this.bookingService
      .getBookingSchedule(this.appointmentInfo.bid, this.setDate)
      .subscribe((dateSchedule) => {
        // if the selected date was booked
        if (dateSchedule) {
          // sort the times array from low to high
          dateSchedule.availableTimes.sort(function (a, b) {
            if (a > b) {
              return 1;
            }
            if (a < b) {
              return -1;
            }
            return 0;
          });
          // store the sorted times in an array
          this.day = Array.from(dateSchedule.availableTimes);
        } // if the selected date does not have a schedule
        else if (!dateSchedule) {
          // loop through the weekdays docs
          for (let i = 0; i < this.weekDays.length; i++) {
            // if it has more than 1 time and monday was selected
            if (this.weekDays[i][0].length > 0 && this.selectedDay === 0) {
              // sort the available times for monday from low to high
              this.weekDays[i][0].sort(function (a, b) {
                if (a > b) {
                  return 1;
                }
                if (a < b) {
                  return -1;
                }
                return 0;
              });
              // store sorted array
              this.day = Array.from(this.weekDays[i][0]); // store in selected schedule array
            }
            // if it has more than 1 time and tuesday was selected
            else if (this.weekDays[i][0].length > 0 && this.selectedDay === 1) {
              // sort the available times for tuesday from low to high
              this.weekDays[i][0].sort(function (a, b) {
                if (a > b) {
                  return 1;
                }
                if (a < b) {
                  return -1;
                }
                return 0;
              });
              // store sorted array
              this.day = Array.from(this.weekDays[i][0]);
            }
            // if it has more than 1 time and wednesday was selected
            else if (this.weekDays[i][0].length > 0 && this.selectedDay === 2) {
              // sort the available times for wednesday from low to high
              this.weekDays[i][0].sort(function (a, b) {
                if (a > b) {
                  return 1;
                }
                if (a < b) {
                  return -1;
                }
                return 0;
              });
              // store sorted array
              this.day = Array.from(this.weekDays[i][0]);
            }
            // if it has more than 1 time and thursday was selected
            else if (this.weekDays[i][0].length > 0 && this.selectedDay === 3) {
              // sort the available times for thursday from low to high
              this.weekDays[i][0].sort(function (a, b) {
                if (a > b) {
                  return 1;
                }
                if (a < b) {
                  return -1;
                }
                return 0;
              });
              // store sorted array
              this.day = Array.from(this.weekDays[i][0]);
            }
            // if it has more than 1 time and friday was selected
            else if (this.weekDays[i][0].length > 0 && this.selectedDay === 4) {
              // sort the available times for friday from low to high
              this.weekDays[i][0].sort(function (a, b) {
                if (a > b) {
                  return 1;
                }
                if (a < b) {
                  return -1;
                }
                return 0;
              });
              // store sorted array
              this.day = Array.from(this.weekDays[i][0]);
            }
            // if it has more than 1 time and saturday was selected
            else if (this.weekDays[i][0].length > 0 && this.selectedDay === 5) {
              // sort the available times for saturday from low to high
              this.weekDays[i][0].sort(function (a, b) {
                if (a > b) {
                  return 1;
                }
                if (a < b) {
                  return -1;
                }
                return 0;
              });
              // store sorted array
              this.day = Array.from(this.weekDays[i][0]);
            }
            // if it has more than 1 time and sunday was selected
            else if (this.weekDays[i][0].length > 0 && this.selectedDay === 6) {
              // sort the available times for sunday from low to high
              this.weekDays[i][0].sort(function (a, b) {
                if (a > b) {
                  return 1;
                }
                if (a < b) {
                  return -1;
                }
                return 0;
              });
              // store sorted array
              this.day = Array.from(this.weekDays[i][0]);
            }
          }
        }
      });
  }
}
