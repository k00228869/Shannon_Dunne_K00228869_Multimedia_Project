import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IUser } from 'src/app/i-user';
import { BookingService } from 'src/app/services/booking.service';
import { BusinessService } from 'src/app/services/business.service';
import { ClientUserService } from 'src/app/services/client-user.service';
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
// import * as moment from 'moment';
// import {Moment} from 'moment/moment';
import { WorkingDaysService } from 'src/app/services/working-days.service';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
const moment = _rollupMoment || _moment;

export const MY_FORMATS = {  // set selected date format
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
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {
      provide: MAT_DATE_FORMATS, useValue: MY_FORMATS
    },
  ]
})
export class BookingFormComponent implements OnInit {
  profileInfo: IUser['business'];
  schedule: IUser['bookingSchedule'] = {};
  public clientAppointment: IUser['appointment'];
  employees: IUser['employee'];
  public selectedService: IUser['service'];
  public selectedEmployee: IUser['employee'];
  user: IUser['user'];
  // public duration: string;
  services: IUser['service'];
  theHourOfDay: IUser['hours'];
  public client: IUser['user'];
  public newHourList: IUser['scheduleOfDays'];
  mon: IUser['scheduleOfDays']['monday'];
  tues: IUser['scheduleOfDays']['tuesday'];
  wed: IUser['scheduleOfDays']['wednesday'];
  thur: IUser['scheduleOfDays']['thursday'];
  fri: IUser['scheduleOfDays']['friday'];
  sat: IUser['scheduleOfDays']['saturday'];
  sun: IUser['scheduleOfDays']['sunday'];
  addAppointmentForm: FormGroup;
  public unavailableDates: number[] = [];
  public unavailableDays: number[] = [];

  public id: string;
  // datesNotAvailable;
  public day: string[] = [];
  // public newDay: string[] = [];
  date = moment();
  public setDate: string;
  public setMonth: string;

  constructor(
    private addAppointment: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public business: BusinessService,
    public clientService: ClientUserService,
    public booking: BookingService,
    public firestore: AngularFirestore,
    public hourService: WorkingDaysService,
  ) { }

  ngOnInit(){
    this.addAppointmentForm = this.addAppointment.group({
      employeeId: new FormControl('', Validators.required),
      serviceId: new FormControl('', [Validators.minLength(7)]),
      date: new FormControl(moment(), [Validators.required]),
      time: new FormControl(moment().toString(), [Validators.required]),
      note: new FormControl('', [Validators.required]),
    });


    this.route.paramMap.subscribe(
      (params) =>
      {
        this.id = params.get('id');
        this.business.getABusiness(this.id).subscribe(
          (bus) =>
          {
            this.profileInfo = bus[0];
          });
        this.business.getBusServices(this.id).subscribe(
          (servs) =>
          {
            this.services = servs;
          });
        this.business.getHours(params.get('id')).subscribe(
          (data) =>
          {
            this.theHourOfDay = data[0];
          });
        this.business.getBusEmployees(this.id).subscribe(
          (emps) =>
          {
            this.employees = emps;
          });
      });
    this.clientService.getUserInfo().subscribe(
        (data) =>
        {
          this.client = data;
        }
      );
    this.booking.getBookedDays(this.id).subscribe( // pass in business id and call func to get doc for each day with a booking
        (data) => {
          for(let i=0; i<data.length; i++) // loop through the docs
          {
            if (data[0].availableTimes.length <= 1) // if a booking hours array has 1 or less items
            {
              let d = data[i].date.slice(7, 10); // slice the date value
              let asNum = parseInt(d); // convert string to num
              this.unavailableDates.push(asNum); // store in unavailable dates array
            }
          }
        });
  }


  public async onAppointSubmit(clientAppointment: IUser['appointment'])
  {
    if (this.addAppointmentForm.status === 'VALID')
    {
      this.clientAppointment = this.addAppointmentForm.value; // form values
      this.clientAppointment.date = clientAppointment.date.toString(); // store appointment date
      this.clientAppointment.date = this.setDate;
      this.clientAppointment.bid = this.id; //set business id
      // let theUser = JSON.parse(localStorage.getItem('user'));
      this.clientAppointment.uid = this.client.uid; // set client id
      this.clientAppointment.timeStamp = new Date(); // set timestamp of when appointment was made
      this.clientAppointment.appointmentId = this.firestore.createId(); // create an appointment id
      this.booking.getServiceDuration(this.id, this.clientAppointment).subscribe( // call func to get service data
        (ser) => {
          this.selectedService = ser[0]; // store service data
          this.clientAppointment.serName = this.selectedService.serviceName; // store service name
          this.clientAppointment.serPrice = this.selectedService.servicePrice; // set booking price
          this.clientAppointment.serDuration = this.selectedService.duration; // set booking duration
          const startTime = this.clientAppointment.time; // set booking start time
          const endTime = moment(startTime, 'HH:mm:ss').add(this.clientAppointment.serDuration, 'hours') // get service finish time
          .format('HH:mm:ss');
          console.log();
          let index1 = this.day.indexOf(startTime); // get index that is = to the selected time
          let index2 = this.day.indexOf(endTime); // get index that is = to the service end time
          let newTimes
          if (index2 == -1)
          {
            newTimes = this.day.slice(index1);
          }
          else{
            newTimes = this.day.slice(index1, index2); // gets array of the times between the service start and end time

          }
          const oldTimes = Array.from(this.day); // store array from associative array
          const theDayHours = oldTimes.filter(a => !newTimes.includes(a)); // removes unavailable hours from the array
          console.log('filter func', theDayHours);
          this.schedule.date = this.clientAppointment.date; // set the date of the booked date
          this.schedule.availableTimes = [];
          this.schedule.availableTimes = theDayHours; // set the new hours of the booked date
        });
      this.booking.getEmployeeName(this.id, this.clientAppointment).subscribe(
          (emp) => {
            this.selectedEmployee = emp[0];
            this.clientAppointment.empName = this.selectedEmployee.firstName + ' ' + this.selectedEmployee.lastName; // store employee name
          });
      this.business.getUserInfo().subscribe(
        async (user) => {
          this.user = user;
          this.clientAppointment.clientName = this.user.firstName + ' ' + this.user.lastName; // store client name
          // console.log('appointment info', this.clientAppointment);
          await this.booking.addBookingSchedule(clientAppointment.bid, this.schedule);
          await this.booking.addClientAppointment(this.clientAppointment);
          await this.booking.addBusinessBooking(this.clientAppointment);
          const dateA = moment(this.clientAppointment.timeStamp, 'DD-MM-YYYY');
          const dateB = moment(this.date, 'DD-MM-YYYY');
          this.booking.createRescheduleNotif(dateA, dateB);
        });
          // console.log('new day hours', newTimes);
          // if (index1 === -1 || index2 === -1)
          // {
          //   alert('The duration of this service exceeds the available hours');
          // }

      // this.router.navigate(['/booking-confirmed/', clientAppointment.appointmentId]); // display business dash
    }
  }


    dateFilter = (d: moment.Moment) => {
    const filter = this.unavailableDates.indexOf(+ d.date()) === -1; // disable dates in array
    // const month = (d || moment()).month(); // get the month num
    let currentYear = moment().year();
    const year = (d || moment()).year();

    let currentMonth = moment().month();
    const month = (d || moment()).month();

    return  [
      year <= currentYear + 1,
      filter,
      month <= currentMonth + 3];
  //     // disable hours not available
  //   return day !== 0 ; // disable sunday
    // return true value index
  }
  


// get duration of serv, disable time for duration when the selected dat is selected
    newInput(event)
    {
    this.date = moment(event.value);
    const selectedDay = this.date.day();
    this.setDate = this.date.format('ddd MMM DD YYYY');
    this.setMonth = this.date.format('MMMMM');
    // console.log(this.date); // moment obj
    // console.log(selectedDay); // index of day
    // console.log(this.setDate); // the selected day
          // let duration = moment.duration(finishTime.diff(startTime));
          // let diff = duration.hours();
          // if (this.day.length <= 1)
          //       {
          //         this.unavailableDays.push(0)
          //       }
    if (selectedDay)
    {
      this.booking.getBookingSchedule(this.id, this.setDate).subscribe(
      (data) => {
        if (data)
        {
          // console.log(data.availableTimes.length);
           let tempArr = data.availableTimes.pop();
           this.day = Array.from(data.availableTimes);
          //   alert('No availabilities for this date');
        }
        else if (!data)
        {
          if (selectedDay === 1)
          {
            this.hourService.getMon(this.id).subscribe(
              (mon) =>
              {
                // get monday hours
                this.day = Array.from(mon[0][0]);
              });
          }
          else if (selectedDay === 2)
          {
            this.hourService.getTue(this.id).subscribe(
              (tues) =>
              {
                // get tuesday hours
                this.day = Array.from(tues[0][0]);
              });
          }
          else if (selectedDay === 3)
          {
            this.hourService.getWed(this.id).subscribe(
              (wed) =>
              {
                // get wednesday hours
                this.day = Array.from(wed[0][0]);
              });
          }
          else if (selectedDay === 4)
          {
            this.hourService.getThur(this.id).subscribe(
              (thur) =>
              {
                // get thursday hours
                // console.log(thur);
                this.day = Array.from(thur[0][0]);
              });
          }
          else if (selectedDay === 5)
          {
            this.hourService.getFri(this.id).subscribe(
              (fri) =>
              {
                // get firday hours
                this.day = Array.from(fri[0][0]);
              });
          }
          else if (selectedDay === 6)
          {
            this.hourService.getSat(this.id).subscribe(
              (sat) =>
              {
                // get saturday hours
                this.day = Array.from(sat[0][0]);
              });
          }
          else if (selectedDay === 0)
          {
            this.hourService.getSun(this.id).subscribe(
              (sun) =>
              {
                // get sunday hours
                this.day = Array.from(sun[0][0]);
              });
          }
        }
      });
    }
  }
}
