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
    public booking: BookingService,
    public firestore: AngularFirestore,
    public hourService: WorkingDaysService,
    private notif: NotificationsService,
    public authService: AuthenticateService
  ) {}

  ngOnInit() {
    // build appointment formgroup
    this.addAppointmentForm = this.addAppointment.group({
      employeeId: new FormControl('', [Validators.required]),
      serviceId: new FormControl('', [Validators.required]),
      date: new FormControl(Date, [Validators.required]),
      time: new FormControl([Validators.required]),
      note: new FormControl(''),
    });

    // call func to get user data
    this.authService
      .getUserInfo()
      .pipe(take(1))
      .subscribe((data) => {
        this.client = data; // store user data
        // call func to get user subscription token from db
        this.notif.getToken(this.client.uid).subscribe((theToken) => {
          if (!theToken.token) {
            // if no token found
            this.askPermis(); // call func to get user permission
          }
        });
      });

    // subscribe to route observable to get id
    this.route.paramMap.subscribe(async (params) => {
      this.id = params.get('id'); // store id
      // call func to get a business' details
      this.business
        .getABusiness(this.id)
        .pipe(take(1))
        .subscribe((bus) => {
          this.profileInfo = bus; // store business details
        });

      // call func to get business' services
      this.business
        .getBusServices(this.id)
        .pipe(take(1))
        .subscribe((servs) => {
          this.services = servs; // store services
        });

      // call func to get business hours
      this.business
        .getHours(params.get('id'))
        .pipe(take(1))
        .subscribe((data) => {
          this.theHourOfDay = data[0]; // store business hours
        });

      // call func to get business employees
      this.business
        .getBusEmployees(this.id)
        .pipe(take(1))
        .subscribe((emps) => {
          this.employees = emps; // store business employees
        });

      // call func to get working days collection
      this.hourService
        .getAll(this.id)
        .pipe(take(1))
        .subscribe(
          // get schedule for each day, unsubscribe after first value
          (all) => {
            this.weekDays = [];
            this.weekDays = all; // store schedules for each day
            // loop through documents
            for (let i = 0; i < this.weekDays.length; i++) {
              if (
                // if the day has less than 1 available time or is undefined
                this.weekDays[i][0].length <= 1 ||
                this.weekDays[i][0].length === undefined
              ) {
                // add day index to unavailable array
                this.unavailableDays.push(this.weekDays[i][1]);
              }
            }
          }
        );

      this.unavailableDates = []; // reset array
      // call func to get the businesses booked days
      this.booking
        .getBookedDays(this.id)
        .pipe(take(1))
        .subscribe(
          // pass in business id and call func to get booked dates collection
          (data) => {
            this.bookedDays = data; // store the booked days

            // loop through booked days
            for (let i = 0; i < this.bookedDays.length; i++) {
              // if a booking hours array has 1 or less items or is undefined
              if (
                this.bookedDays[i].availableTimes.length <= 1 ||
                this.bookedDays[i].availableTimes.length === undefined
              ) {
                const newd = new Date(
                  this.bookedDays[i].calendarIndex
                ).getTime(); // convert string calendar index to date with time
                this.unavailableDates.push(newd); // add calendarIndex to array of unavailable dates
              }
            }
          }
        );
    });
  }

  // called when booking button clicked
  askPermis() {
    // func to request notification permission
    this.notif.requestPermission();
  }

  // submit form data
  public async onAppointSubmit(clientAppointment: IUser['appointment']) {
    // if the form data is valid
    if (this.addAppointmentForm.status === 'VALID') {
      // set new appoinment details
      this.clientAppointment = this.addAppointmentForm.value; // form values
      this.clientAppointment.date = clientAppointment.date.toString(); // store appointment date as string
      this.clientAppointment.date = this.setDate;
      this.clientAppointment.bid = this.id; // set business id
      this.clientAppointment.uid = this.client.uid; // set client id
      this.clientAppointment.timeStamp = new Date(); // set timestamp of when appointment was made
      this.clientAppointment.appointmentId = this.firestore.createId(); // create an appointment id
      // call func to get the selected service data
      this.booking
        .getServiceDuration(this.id, this.clientAppointment)
        .subscribe((ser) => {
          this.selectedService = ser[0]; // store service data
          this.clientAppointment.serName = this.selectedService.serviceName; // store service name
          this.clientAppointment.serPrice = this.selectedService.servicePrice; // set booking price
          this.clientAppointment.serDuration = this.selectedService.duration; // set booking duration

          // edit booked schedule

          // slice no. of hours from string
          const noHours = this.clientAppointment.serDuration.slice(1, 2);
          const totalAsNum = parseInt(noHours); // cast hours to num
          const temp: any[] = [];
          let j = 1;
          temp.push(this.clientAppointment.time); // add time to schedule
          // if the service duration is more than 1 hour
          if (totalAsNum > 1) {
            let start = moment(this.clientAppointment.time, 'HH:mm:ss'); // booked time as moment obj
            // while there are still hours to add
            while (j < totalAsNum) {
              const getNextTime = start.add(1, 'hour').format('HH:mm:ss'); // add hour to old booking time
              temp.push(getNextTime); // add time to array
              start = moment(getNextTime, 'HH:mm:ss'); // set start time to last added time
              j++; // increase by 1
            }
          }
          // get array from day array that do not include the items in the temp array
          const theDayHours = this.day.filter((a) => !temp.includes(a)); // removes unavailable hours from the array
          // setting schedule for booked date
          this.schedule.date = this.clientAppointment.date; // set the date of the booked date
          this.schedule.availableTimes = [];
          this.schedule.availableTimes = theDayHours; // set the new hours of the booked date
          this.schedule.calendarIndex = this.date.toString(); // get string value of calendar date
        });

      // call func to get the selected employee's data
      this.booking
        .getEmployeeName(this.id, this.clientAppointment)
        .subscribe((emp) => {
          this.selectedEmployee = emp[0]; // store employee data
          this.clientAppointment.empName =
            this.selectedEmployee.firstName +
            ' ' +
            this.selectedEmployee.lastName; // store employee name
        });

      // call func to get client data
      this.authService.getUserInfo().subscribe(async (user) => {
        this.user = user; // store client data
        this.clientAppointment.clientName =
          this.user.firstName + ' ' + this.user.lastName; // store client name
        this.clientAppointment.phone = this.user.phone.toString(); // store client number

        // call func to add schedule of booked date
        await this.booking.addBookingSchedule(
          clientAppointment.bid,
          this.schedule
        );
        // call func to add the cleints appointment to db
        await this.booking.addClientAppointment(this.clientAppointment);
        // call func to add the business appointment to db
        await this.booking.addBusinessBooking(this.clientAppointment);
        // call func to add an appointment reminder for user
        await this.notif.appoinmtentReminder(
          this.clientAppointment,
          this.profileInfo
        ); // call funcs to add a business review reminders for user
        await this.notif.reviewReminder(
          this.clientAppointment,
          this.profileInfo
        );
        // call func to change roiute
        this.changeRoute();
      });
    } else {
      // if form data nit valid show alert
      alert('Correct the invalid fields before submitting');
      return;
    }
  }
  // function to disable dates/days
  dateFilter = (d: Date) => {
    // gets the day index of a date
    const day = (d || new Date()).getDay();
    // gets the calendar dates with time
    const ddd = d.getTime();

    // this sets what dates/days are filtered
    return (
      // return the day indexes that are not found in the array
      this.unavailableDays.indexOf(day) === -1 && // unavailable days
      // do not return the date indexes that are common to the arrays
      !this.unavailableDates.find((x) => x === ddd) // unavailable dates
    );
  };

  // this is triggered everytime a date is selected on the calendar, unless the date is disabled
  newInput(event) {
    // store the event value (for calendar index)
    this.date = new Date(event.value);
    // the selected date as a moment obj
    this.momentDate = moment(event.value); // the selected date as a moment obj
    // gets the week day index of a selected date
    this.selectedDay = this.momentDate.day(); // the week day index of selected date
    // formatting the selected date
    this.setDate = this.momentDate.format('ddd MMM DD YYYY'); // formatting date
    // call func to get schedule of selected date
    this.booking
      .getBookingSchedule(this.id, this.setDate) // get schedule if booked
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
            } // if it has more than 1 time and tuesday was selected
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
            } // if it has more than 1 time and wednesday was selected
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
            } // if it has more than 1 time and thursday was selected
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
            } // if it has more than 1 time and friday was selected
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
            } // if it has more than 1 time and saturday was selected
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
            } // if it has more than 1 time and sunday was selected
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

  // pass in appointment id and display booking confirmation page
  changeRoute() {
    this.router.navigate([
      '/booking-confirmed/',
      this.clientAppointment.appointmentId,
    ]);
  }
}
