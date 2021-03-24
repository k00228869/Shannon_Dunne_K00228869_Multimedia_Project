import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BookingConfirmationComponent } from 'src/app/client-components/booking-confirmation/booking-confirmation.component';
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
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: MY_FORMATS,
    },
  ],
})
export class RescheduleFormComponent implements OnInit {
  editAppointmentForm: FormGroup;
  public newAppointment: IUser['appointment'];
  public setDate: string;
  public client: IUser['user'];
  public unavailableDays: number[] = [];
  theHourOfDay: IUser['hours'];
  public selectedService: IUser['service'];
  public duration: string;
  public day: string[] = [];
  schedule: IUser['bookingSchedule'] = {};
  newSchedule: IUser['bookingSchedule'] = {};
  tempSchedule: string[] = [];
  user: IUser['user'];
  public date = moment();
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
      date: new FormControl(moment(), [Validators.required]),
      time: new FormControl(moment().toString(), [Validators.required]),
      note: new FormControl('', [Validators.required]),
    });

    this.clientService.getUserInfo().subscribe((data) => {
      this.client = data;
    });

    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id');
      this.bookingService.getAppointment(this.id).subscribe((appoint) => {
        this.appointmentInfo = appoint[0];
        console.log('appointInfo', this.appointmentInfo);
        this.updateInfo();
      });
    });
  }

  updateInfo() {
    this.business.getABusiness(this.appointmentInfo.bid).subscribe((bus) => {
      this.busInfo = bus[0];
    });
    // this.business.getHours(this.appointmentInfo.bid).subscribe(
    //   (data) =>
    //   {
    //     this.theHourOfDay = data[0];
    //   });
    this.bookingService.getBookedDays(this.appointmentInfo.bid).subscribe(
      // get documents with booked dates
      (data) => {
        let key;
        for (key in data) { // for each document in the observ
          if (key.availableTimes.length <= 1) {
            // if there is less than 1 time available in schedule
            let d = key.date.slice(7, 10); // slice the date val from the date
            let asNum = parseInt(d); // convert to num
            console.log(asNum);
            this.unavailableDays.push(asNum); // add date value to fully booked array
          }
        }
      }
    );
    this.bookingService
      .getBookingSchedule(this.appointmentInfo.bid, this.appointmentInfo.date)
      .subscribe(
        // get schedule for date
        (data) => {
          this.scheduleOfDay = Array.from(data.availableTimes); // store as array
        }
      );
  }

  public async editAppointSubmit(newAppointment: IUser['appointment']) {
    this.newAppointment = this.editAppointmentForm.value; // store form values
    this.newAppointment.date = newAppointment.date.toString(); // format date to string
    this.newAppointment.date = this.setDate; // set the date to the last selected date before booking
    this.newAppointment.timeStamp = new Date(); // set the booking timestamp

    this.newAppointment.serName = this.appointmentInfo.serName; // store service name
    this.duration = this.appointmentInfo.serDuration; // store duration of service
    const startTime = this.newAppointment.time; // store service start time
    const endTime = moment(startTime, 'HH:mm:ss')
      .add(this.duration, 'hours')
      .format('HH:mm:ss'); // add duration to get service finish time
    const index1 = this.day.indexOf(startTime); // get index that is = to the selected time
    const index2 = this.day.indexOf(endTime); // get index that is = to the service end time
    // gets array of the times between the service start and end time
    const newTimes = this.day.slice(index1, index2); //
    const oldTimes = Array.from(this.day); // store array from associative array
    const theDayHours = oldTimes.filter((a) => !newTimes.includes(a)); // remove unavailable hours from the available hours array
    this.schedule.date = this.newAppointment.date; // set the date of the booking
    this.schedule.availableTimes = [];
    this.schedule.availableTimes = theDayHours; // set the new hours of the booked date

    let numberOfHours = this.appointmentInfo.serDuration.slice(1, 2); // slice number of hours from duration value
    let amountAsNum = parseInt(numberOfHours); // cast to num
    let i = 0;
    if (amountAsNum > 1) {
      // if the duration is more than 1 hour
      while (i < amountAsNum) {
        // while i is less than the number of hours
        const rescheduleAt = moment(this.appointmentInfo.time, 'HH:mm:ss'); // get old booking time as moment obj
        let theTime = rescheduleAt.add(1, 'hour').format('HH:mm:ss'); // add hour to old booking time to get end time
        this.scheduleOfDay.push(theTime); // add time value to array holding the hours for the old booking date
        i++;
      }
    } else if (amountAsNum <= 1) {
      this.scheduleOfDay.push(this.appointmentInfo.time); // add time to array of availabilities
      // this.scheduleOfDay.sort();
    }
    console.log('edited hours', this.scheduleOfDay);
    this.newSchedule.availableTimes = this.scheduleOfDay; // set schedule for booked date
    // this.newAppointment.empName = this.appointmentInfo.empName;
    // this.newAppointment.clientName = this.client.firstName + ' ' + this.client.lastName; // set client name for booking
    console.log('adding schedule', this.appointmentInfo.bid, this.schedule);
    await this.bookingService.addBookingSchedule(
      this.appointmentInfo.bid,
      this.schedule
    ); // call func to update schedule of hours in db
    console.log('editing schedule', this.appointmentInfo, this.newSchedule);
    this.reschedule.editBookingSchedule(this.appointmentInfo, this.newSchedule); // call func to update schedule of hours in db
    console.log('updating booking', this.appointmentInfo, this.newAppointment);
    this.reschedule.updateBusAppointment(
      this.appointmentInfo,
      this.newAppointment
    ); // call func to update appointment info in db
    this.reschedule.updateClientAppointment(this.appointmentInfo, this.newAppointment); // call func to update appointment info in db
    this.notif.appoinmtentReminder(this.newAppointment, this.busInfo); // create appointment notification
    this.notif.reviewReminder(this.newAppointment, this.busInfo); // create review notification
    this.notif.deleteRNotifications(this.busInfo.id); // delete old review notification
    this.notif.deleteANotifications(this.appointmentInfo.date); // delete old appointment notification
    this.changeRoute(this.appointmentInfo.appointmentId);
  }

  dateFilter = (d: moment.Moment) => {
    const filter = this.unavailableDays.indexOf(+d.date()) === -1; // hide dates in array
    return filter;
  };

  changeRoute(id: string) {
    this.router.navigate(['/booking-confirmed/', id]);
  }

  // get duration of serv, disable time for duration when the selected dat is selected
  newInput(
    event // pass in date change event
  ) {
    this.date = moment(event.value); // store event value
    const selectedDay = this.date.day(); // get day index of selected date
    this.setDate = this.date.format('ddd MMM DD YYYY'); // format selected date

    if (selectedDay) {
      // if a date was selected
      this.bookingService
        .getBookingSchedule(this.appointmentInfo.bid, this.setDate)
        .subscribe(
          // call func to get business's booked days
          (data) => {
            if (data) {
              console.log(data.availableTimes.length);
              this.day = Array.from(data.availableTimes); // store schedule in time array
              //   alert('No availabilities for this date');
            } else if (!data) {
              // if no data returned
              if (selectedDay === 1) {
                // if index of week = monday
                this.hourService.getMon(this.appointmentInfo.bid).subscribe(
                  // call func to get monday working hours
                  (mon) => {
                    // get monday hours
                    this.day = Array.from(mon[0][0]);
                  }
                );
              } else if (selectedDay === 2) {
                this.hourService
                  .getTue(this.appointmentInfo.bid)
                  .subscribe((tues) => {
                    // get tuesday hours
                    this.day = Array.from(tues[0][0]);
                  });
              } else if (selectedDay === 3) {
                this.hourService
                  .getWed(this.appointmentInfo.bid)
                  .subscribe((wed) => {
                    // get wednesday hours
                    this.day = Array.from(wed[0][0]);
                  });
              } else if (selectedDay === 4) {
                this.hourService
                  .getThur(this.appointmentInfo.bid)
                  .subscribe((thur) => {
                    // get thursday hours
                    // console.log(thur);
                    this.day = Array.from(thur[0][0]);
                  });
              } else if (selectedDay === 5) {
                this.hourService
                  .getFri(this.appointmentInfo.bid)
                  .subscribe((fri) => {
                    // get firday hours
                    this.day = Array.from(fri[0][0]);
                  });
              } else if (selectedDay === 6) {
                this.hourService
                  .getSat(this.appointmentInfo.bid)
                  .subscribe((sat) => {
                    // get saturday hours
                    this.day = Array.from(sat[0][0]);
                  });
              } else if (selectedDay === 0) {
                this.hourService
                  .getSun(this.appointmentInfo.bid)
                  .subscribe((sun) => {
                    // get sunday hours
                    this.day = Array.from(sun[0][0]);
                  });
              }
            }
          }
        );
    }
  }
}
