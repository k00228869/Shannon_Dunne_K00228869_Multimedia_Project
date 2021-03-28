import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { IUser } from 'src/app/i-user';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { AngularFirestore } from '@angular/fire/firestore';
import { ClientUserService } from 'src/app/services/client-user.service';
import { BookingService } from 'src/app/services/booking.service';
import { BusinessService } from 'src/app/services/business.service';
import { RescheduleService } from 'src/app/services/reschedule.service';
import { WorkingDaysService } from 'src/app/services/working-days.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from 'src/app/services/notifications.service';
import { take } from 'rxjs/operators';
const moment = _rollupMoment || _moment;
export const MY_FORMATS = {
  // set selected date format
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
  encapsulation: ViewEncapsulation.None,
  // providers: [
  //   {
  //     provide: DateAdapter,
  //     useClass: MomentDateAdapter,
  //     deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
  //   },
  //   {
  //     provide: MAT_DATE_FORMATS,
  //     useValue: MY_FORMATS,
  //   },
  // ],
})
export class RescheduleFormComponent implements OnInit {
  editAppointmentForm: FormGroup;
  public newAppointment: IUser['appointment'];
  public setDate: string;
  public client: IUser['user'];
  selectedDay: number;
  unavailableDays: any[] = [];
  theHourOfDay: IUser['hours'];
  // public selectedService: IUser['service'];
  public duration: string;
  public day: string[] = [];
  schedule: IUser['bookingSchedule'] = {};
  newSchedule: IUser['bookingSchedule'] = {};
  public weekDays: IUser['scheduleOfDays'][];
  public notAvailable: any[] = [];
  bookedDays: IUser['bookingSchedule'][];
  tempSchedule: string[] = [];
  user: IUser['user'];
  date: Date;
  momentDate = moment();

  public id: string;
  public appointmentInfo: IUser['appointment'];
  public busInfo: IUser['business'];
  scheduleOfDay: string[] = [];

  constructor(
    private editAppointment: FormBuilder,
    public firestore: AngularFirestore,
    public clientService: ClientUserService,
    public bookingService: BookingService,
    public business: BusinessService,
    public reschedule: RescheduleService,
    public hourService: WorkingDaysService,
    private route: ActivatedRoute,
    private router: Router,
    private notif: NotificationsService
  ) {}

  ngOnInit() {
    this.editAppointmentForm = this.editAppointment.group({
      date: new FormControl(Date, [Validators.required]),
      time: new FormControl([Validators.required]),
      note: new FormControl('', [Validators.required]),
    });

    this.clientService.getUserInfo().subscribe((data) => {
      this.client = data;
      this.notif.getToken(this.client.uid).subscribe((theToken) => {
        // call func to get user token from db
        if (!theToken.token) {
          // if no token available
          this.askPermis(); // call func to get user permis
        }
      });
    });

    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id');
      this.bookingService.getAppointment(this.id).subscribe((appoint) => {
        this.appointmentInfo = appoint[0];
        console.log('appointInfo', this.appointmentInfo);
        this.updateInfo(this.appointmentInfo.bid);
      });
    });
  }

  updateInfo(bid: string) {
    this.business.getABusiness(bid).subscribe((bus) => {
      this.busInfo = bus;
    });

    this.hourService
      .getAll(this.appointmentInfo.bid)
      .pipe(take(1))
      .subscribe(
        // get schedule for each day, do not run after fists value
        (all) => {
          this.weekDays = [];
          this.weekDays = all; // schedules for each weekday
          for (let i = 0; i < this.weekDays.length; i++) {
            // console.log('schedule array in loop', this.weekDays[i][0]);
            if (
              this.weekDays[i][0].length === 0 ||
              this.weekDays[i][0].length === undefined
            ) {
              // if no hours for that day
              // console.log('not available');
              this.unavailableDays.push(this.weekDays[i][1]); // add day index to unavailable array
            } else {
              // console.log('available day');
            }
          }
        }
      );

    this.notAvailable = []; // reset array
    this.bookingService.getBookedDays(this.appointmentInfo.bid).subscribe(
      // get documents with booked dates
      (data) => {
        this.bookedDays = data;
        for (let i = 0; i < this.bookedDays.length; i++) {
          // console.log(this.bookedDays[i].availableTimes.length);
          // if a booking hours array has 1 or less items
          if (
            this.bookedDays[i].availableTimes.length <= 1 ||
            this.bookedDays[i].availableTimes.length === undefined
          ) {
            const newd = new Date(this.bookedDays[i].calendarIndex).getTime();
            this.notAvailable.push(newd); // add doc name to array of unavailable dates
          } else {
            // console.log('no bookings found');
          }
          // console.log(this.notAvailable);
        }
      }
    );
  }

  askPermis() {
    // called when booking button clicked
    this.notif.requestPermission().subscribe(
      // func to get/store notification permission
      async (token) => {
        console.log('token received', token); // token returned
      }
    );
  }

  public async editAppointSubmit(newAppointment: IUser['appointment']) {
    // setting new appoinment details
    this.newAppointment = this.editAppointmentForm.value; // store form values
    this.newAppointment.date = newAppointment.date.toString(); // format date to string
    this.newAppointment.date = this.setDate; // set the date to the last selected date before booking
    this.newAppointment.timeStamp = new Date(); // set the booking timestamp
    this.newAppointment.serName = this.appointmentInfo.serName; // store service name

    // edit schedule for new booking
    this.newAppointment.serDuration = this.appointmentInfo.serDuration;
    let noHours = this.newAppointment.serDuration.slice(1, 2); // slice no. of hours
    let totalAsNum = parseInt(noHours, 10); // cast to num
    let temp: any[] = [];
    let j = 1;
    temp.push(this.newAppointment.time); // add booked time to schedule
    if (totalAsNum > 1) {
      // if the hours are more than 1
      let start = moment(this.newAppointment.time, 'HH:mm:ss'); // booked time to moment obj
      while (j < totalAsNum) {
        // while there are still hours to add
        let getNextTime = start.add(1, 'hour').format('HH:mm:ss'); // add hour to old booking time
        temp.push(getNextTime); // add hours to array
        start = moment(getNextTime, 'HH:mm:ss'); // set start time to last added time
        j++; // increase by 1
      }
    }
    const theDayHours = this.day.filter((a) => !temp.includes(a)); // store hours from day that are not in temp
    // const theDayHours = oldTimes.filter((a) => !newTimes.includes(a)); // remove unavailable hours from the available hours array
    this.schedule.date = this.newAppointment.date; // set the date of the booking
    this.schedule.availableTimes = [];
    this.schedule.availableTimes = theDayHours; // set the new hours of the booked date
    this.schedule.calendarIndex = this.date.toString();
    // let tempArr: any[] = [];
    // editing schedule for rescheduled booking
    await this.bookingService
      .getBookingSchedule(this.appointmentInfo.bid, this.appointmentInfo.date)
      .pipe(take(1))
      .subscribe(
        // get schedule for date
        (data) => {
          // console.log('resceduled date', data);
          this.newSchedule.calendarIndex = data.calendarIndex;
          this.newSchedule.date = data.date;
          this.scheduleOfDay = Array.from(data.availableTimes); // store as array
          let i = 1;
          this.scheduleOfDay.push(this.appointmentInfo.time); // add booked time to schedule
          if (totalAsNum > 1) {
            // if the hours are more than 1
            let theStartTime = moment(this.appointmentInfo.time, 'HH:mm:ss'); // booked time to moment obj
            while (i < totalAsNum) {
              // while there are still hours to add
              let nextTime = theStartTime.add(1, 'hour').format('HH:mm:ss'); // add hour to old booking time
              this.scheduleOfDay.push(nextTime.toString()); // add hours to array
              theStartTime = moment(nextTime, 'HH:mm:ss'); // set start time to last added time
              i++; // increase by 1
            }
          }
          this.newSchedule.availableTimes = [];
          this.newSchedule.availableTimes =  Array.from(this.scheduleOfDay);
          this.reschedule.editSchedule(this.appointmentInfo, this.newSchedule); // call func to update schedule of hours in db

        }
      );

    // edit appointment and schedule docs
    await this.bookingService.addBookingSchedule(
      this.appointmentInfo.bid,
      this.schedule
    ); // call func to update schedule of hours in db
    this.reschedule.editSchedule(this.appointmentInfo, this.newSchedule); // call func to update schedule of hours in db
    this.reschedule.updateBusAppointment(
      this.appointmentInfo,
      this.newAppointment
    ); // call func to update appointment info in db
    this.reschedule.updateClientAppointment(
      this.appointmentInfo,
      this.newAppointment
    );
    // handle notifications
    this.notif.appoinmtentReminder(this.newAppointment, this.busInfo); // create appointment notification
    this.notif.reviewReminder(this.newAppointment, this.busInfo); // create review notification
    this.notif.deleteRNotifications(this.busInfo.id); // delete old review notification
    this.notif.deleteANotifications(this.appointmentInfo.appointmentId); // delete old appointment notification
    this.changeRoute(this.appointmentInfo.appointmentId);
  }

  dateFilter = (d: Date) => {
    const day = d.getDay();
    const ddd = d.getTime();
    return (
      this.notAvailable.indexOf(day) == -1 &&
      d >= new Date() &&
      !this.unavailableDays.find((x) => x === ddd)
    );
  };

  changeRoute(id: string) {
    this.router.navigate(['/booking-confirmed/', id]);
  }

  newInput(
    event // pass in date change event
  ) {
    this.date = new Date(event.value);
    this.momentDate = moment(event.value); // the selected date as a moment obj
    this.selectedDay = this.momentDate.day(); // the week day index of selected date
    this.setDate = this.momentDate.format('ddd MMM DD YYYY'); // formatting date
    this.bookingService
      .getBookingSchedule(this.appointmentInfo.bid, this.setDate) // get schedule if booked
      .subscribe((dateSchedule) => {
        if (dateSchedule) {
          this.day = Array.from(dateSchedule.availableTimes);
        } else if (!dateSchedule) {
          for (let i = 0; i < this.weekDays.length; i++) {
            // if there is no booked date
            if (this.weekDays[i][0].length > 0 && this.selectedDay === 0) {
              this.day = Array.from(this.weekDays[i][0]); // store in selected schedule array
            } else if (
              this.weekDays[i][0].length > 0 &&
              this.selectedDay === 1
            ) {
              this.day = Array.from(this.weekDays[i][0]);
            } else if (
              this.weekDays[i][0].length > 0 &&
              this.selectedDay === 2
            ) {
              this.day = Array.from(this.weekDays[i][0]);
            } else if (
              this.weekDays[i][0].length > 0 &&
              this.selectedDay === 3
            ) {
              this.day = Array.from(this.weekDays[i][0]);
            } else if (
              this.weekDays[i][0].length > 0 &&
              this.selectedDay === 4
            ) {
              this.day = Array.from(this.weekDays[i][0]);
            } else if (
              this.weekDays[i][0].length > 0 &&
              this.selectedDay === 5
            ) {
              this.day = Array.from(this.weekDays[i][0]);
            } else if (
              this.weekDays[i][0].length > 0 &&
              this.selectedDay === 6
            ) {
              this.day = Array.from(this.weekDays[i][0]);
            }
          }
        }
      });
  }
}
