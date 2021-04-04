import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IUser } from 'src/app/interfaces/i-user';
import { BookingService } from 'src/app/services/booking.service';
import { BusinessService } from 'src/app/services/business.service';
import { ClientUserService } from 'src/app/services/client-user.service';
import { WorkingDaysService } from 'src/app/services/working-days.service';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { NotificationsService } from 'src/app/services/notifications.service';
import { take } from 'rxjs/operators';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { IBusiness } from 'src/app/interfaces/i-business';
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
  selector: 'app-booking-form',
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class BookingFormComponent implements OnInit {
  profileInfo: IBusiness['business'];
  schedule: IUser['bookingSchedule'] = {};
  bookedDays: IUser['bookingSchedule'][];
  public clientAppointment: IUser['appointment'];
  employees: IUser['employee'];
  public selectedService: IUser['service'];
  public selectedEmployee: IUser['employee'];
  user: IUser['user'];
  selectedDay: number;
  todaysDate: Date = new Date();
  services: IUser['service'];
  theHourOfDay: IUser['hours'];
  public client: IUser['user'];
  public weekDays: IUser['scheduleOfDays'][];
  addAppointmentForm: FormGroup;
  unavailableDays: any[] = [];
  public unavailableDates: any[] = [];
  public id: string;
  public day: string[] = [];
  momentDate = moment();
  date: Date;
  public setDate: string;

  constructor(
    private addAppointment: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public business: BusinessService,
    public clientService: ClientUserService,
    public booking: BookingService,
    public firestore: AngularFirestore,
    public hourService: WorkingDaysService,
    private notif: NotificationsService,
    public authService: AuthenticateService
  ) {}

  ngOnInit() {

    this.addAppointmentForm = this.addAppointment.group({
      employeeId: new FormControl('', [Validators.required]),
      serviceId: new FormControl('', [Validators.required]),
      date: new FormControl(Date, [Validators.required]),
      time: new FormControl([Validators.required]),
      note: new FormControl(''),
    });

    this.clientService
      .getUserInfo()
      .pipe(take(1))
      .subscribe((data) => {
        this.client = data;
        this.notif.getToken(this.client.uid).subscribe((theToken) => {
          // call func to get user token from db
          if (!theToken.token) {
            // if no token
            this.askPermis(); // call func to get user permis
          }
        });
      });

    this.route.paramMap.subscribe(async (params) => {
      this.id = params.get('id');
      this.business
        .getABusiness(this.id)
        .pipe(take(1))
        .subscribe((bus) => {
          this.profileInfo = bus;
        });
      this.business
        .getBusServices(this.id)
        .pipe(take(1))
        .subscribe((servs) => {
          this.services = servs;
        });
      this.business
        .getHours(params.get('id'))
        .pipe(take(1))
        .subscribe((data) => {
          this.theHourOfDay = data[0];
        });
      this.business
        .getBusEmployees(this.id)
        .pipe(take(1))
        .subscribe((emps) => {
          this.employees = emps;
        });

      this.hourService
        .getAll(this.id)
        .pipe(take(1))
        .subscribe(
          // get schedule for each day, unsubscribe after first value
          (all) => {
            this.weekDays = [];
            this.weekDays = all; // schedules for each weekday
            for (let i = 0; i < this.weekDays.length; i++) {
              if (
                this.weekDays[i][0].length <= 1 ||
                this.weekDays[i][0].length === undefined
              ) {
                // if no hours for that day
                this.unavailableDays.push(this.weekDays[i][1]); // add day index to unavailable array
              }
            }
          }
        );

      this.unavailableDates = []; // reset array
      this.booking
        .getBookedDays(this.id)
        .pipe(take(1))
        .subscribe(
          // pass in business id and call func to get booked dates collection
          (data) => {
            this.bookedDays = data;
            for (let i = 0; i < this.bookedDays.length; i++) {
              // if a booking hours array has 1 or less items
              if (
                this.bookedDays[i].availableTimes.length <= 1 ||
                this.bookedDays[i].availableTimes.length === undefined
              ) {
                const newd = new Date(
                  this.bookedDays[i].calendarIndex
                ).getTime();
                this.unavailableDates.push(newd); // add foc calendarIndex to array of unavailable dates
              }
            }
          }
        );
      });
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

  public async onAppointSubmit(clientAppointment: IUser['appointment']) {
    if (this.addAppointmentForm.status === 'VALID') {
      // setting new appoinment details
      this.clientAppointment = this.addAppointmentForm.value; // form values
      this.clientAppointment.date = clientAppointment.date.toString(); // store appointment date
      this.clientAppointment.date = this.setDate;
      this.clientAppointment.bid = this.id; // set business id
      this.clientAppointment.uid = this.client.uid; // set client id
      this.clientAppointment.timeStamp = new Date(); // set timestamp of when appointment was made
      this.clientAppointment.appointmentId = this.firestore.createId(); // create an appointment id
      this.booking
        .getServiceDuration(this.id, this.clientAppointment)
        .subscribe(
          // call func to get service data
          (ser) => {
            this.selectedService = ser[0]; // store service data
            this.clientAppointment.serName = this.selectedService.serviceName; // store service name
            this.clientAppointment.serPrice = this.selectedService.servicePrice; // set booking price
            this.clientAppointment.serDuration = this.selectedService.duration; // set booking duration

            // edit booked schedule
            const noHours = this.clientAppointment.serDuration.slice(1, 2); // slice no. of hours
            const totalAsNum = parseInt(noHours); // cast to num
            const temp: any[] = [];
            let j = 1;
            temp.push(this.clientAppointment.time);
            if (totalAsNum > 1) {
              // if the hours are more than 1
              let start = moment(this.clientAppointment.time, 'HH:mm:ss'); // booked time to moment obj
              while (j < totalAsNum) {
                // while there are still hours to add
                const getNextTime = start.add(1, 'hour').format('HH:mm:ss'); // add hour to old booking time
                temp.push(getNextTime); // add hours to array
                start = moment(getNextTime, 'HH:mm:ss'); // set start time to last added time
                j++; // increase by 1
              }
            }
            // remove common items in arrays
            const theDayHours = this.day.filter((a) => !temp.includes(a)); // removes unavailable hours from the array
            // setting schedule
            this.schedule.date = this.clientAppointment.date; // set the date of the booked date
            this.schedule.availableTimes = [];
            this.schedule.availableTimes = theDayHours; // set the new hours of the booked date
            this.schedule.calendarIndex = this.date.toString();
          }
        );
      this.booking
        .getEmployeeName(this.id, this.clientAppointment)
        .subscribe((emp) => {
          this.selectedEmployee = emp[0];
          this.clientAppointment.empName =
            this.selectedEmployee.firstName +
            ' ' +
            this.selectedEmployee.lastName; // store employee name
        });
      this.business.getUserInfo().subscribe(async (user) => {
        this.user = user;
        this.clientAppointment.clientName =
          this.user.firstName + ' ' + this.user.lastName; // store client name
        this.clientAppointment.phone = this.user.phone.toString();
        await this.booking.addBookingSchedule(
          clientAppointment.bid,
          this.schedule
        ); // add schedule for booked date
        await this.booking.addClientAppointment(this.clientAppointment);
        await this.booking.addBusinessBooking(this.clientAppointment);
        await this.notif.appoinmtentReminder(
          this.clientAppointment,
          this.profileInfo
        ); // call funcs to store reminders
        await this.notif.reviewReminder(
          this.clientAppointment,
          this.profileInfo
        );
        // const dateA = moment(this.clientAppointment.timeStamp, 'DD-MM-YYYY');
        // const dateB = moment(this.date, 'DD-MM-YYYY');
        this.changeRoute();
      });
    } else {
      alert('Correct the invalid fields before submitting');
      return;
    }
  }

  dateFilter = (d: Date) => {
    const day = (d || new Date()).getDay();
    const ddd = d.getTime();

    // dates not in array and dates more than the current date
    return (
      this.unavailableDays.indexOf(day) === -1 && // unavailable days
      !this.unavailableDates.find((x) => x === ddd) // unavailable dates
    );
  };

  newInput(
    event // triggered when the date selection changes
  ) {
    this.date = new Date(event.value);
    this.momentDate = moment(event.value); // the selected date as a moment obj
    this.selectedDay = this.momentDate.day(); // the week day index of selected date
    this.setDate = this.momentDate.format('ddd MMM DD YYYY'); // formatting date
    this.booking
      .getBookingSchedule(this.id, this.setDate) // get schedule if booked
      .subscribe((dateSchedule) => {
        if (dateSchedule) {
          // if there is a booked date
          dateSchedule.availableTimes.sort(function (a, b) {
            if (a > b) {
              return 1;
            }
            if (a < b) {
              return -1;
            }
            return 0;
          });
          this.day = Array.from(dateSchedule.availableTimes);
        } else if (!dateSchedule) {
          // tslint:disable-next-line: prefer-for-of
          for (let i = 0; i < this.weekDays.length; i++) {
            // if there is no booked date
            if (this.weekDays[i][0].length > 0 && this.selectedDay === 0) {
              // sun
              this.weekDays[i][0].sort(function (a, b) {
                if (a > b) {
                  return 1;
                }
                if (a < b) {
                  return -1;
                }
                return 0;
              });
              this.day = Array.from(this.weekDays[i][0]); // store in selected schedule array
            } else if (
              this.weekDays[i][0].length > 0 &&
              this.selectedDay === 1
            ) {
              // mon
              this.weekDays[i][0].sort(function (a, b) {
                if (a > b) {
                  return 1;
                }
                if (a < b) {
                  return -1;
                }
                return 0;
              });
              this.day = Array.from(this.weekDays[i][0]);
            } else if (
              this.weekDays[i][0].length > 0 &&
              this.selectedDay === 2
            ) {
              // tue
              this.weekDays[i][0].sort(function (a, b) {
                if (a > b) {
                  return 1;
                }
                if (a < b) {
                  return -1;
                }
                return 0;
              });
              this.day = Array.from(this.weekDays[i][0]);
            } else if (
              this.weekDays[i][0].length > 0 &&
              this.selectedDay === 3
            ) {
              // wed
              this.weekDays[i][0].sort(function (a, b) {
                if (a > b) {
                  return 1;
                }
                if (a < b) {
                  return -1;
                }
                return 0;
              });
              this.day = Array.from(this.weekDays[i][0]);
            } else if (
              this.weekDays[i][0].length > 0 &&
              this.selectedDay === 4
            ) {
              // thur
              this.weekDays[i][0].sort(function (a, b) {
                if (a > b) {
                  return 1;
                }
                if (a < b) {
                  return -1;
                }
                return 0;
              });
              this.day = Array.from(this.weekDays[i][0]);
            } else if (
              this.weekDays[i][0].length > 0 &&
              this.selectedDay === 5
            ) {
              // fri
              this.weekDays[i][0].sort(function (a, b) {
                if (a > b) {
                  return 1;
                }
                if (a < b) {
                  return -1;
                }
                return 0;
              });
              this.day = Array.from(this.weekDays[i][0]);
            } else if (
              this.weekDays[i][0].length > 0 &&
              this.selectedDay === 6
            ) {
              // sat
              this.weekDays[i][0].sort(function (a, b) {
                if (a > b) {
                  return 1;
                }
                if (a < b) {
                  return -1;
                }
                return 0;
              });
              this.day = Array.from(this.weekDays[i][0]);
            }
          }
        }
      });
  }

  changeRoute() {
    this.router.navigate([
      '/booking-confirmed/',
      this.clientAppointment.appointmentId,
    ]);
  }
}
