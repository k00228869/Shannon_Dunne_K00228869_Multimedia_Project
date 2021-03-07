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
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
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

//   LTS  : 'h:mm:ss A',
//  LT   : 'h:mm A',
//  L    : 'MM/DD/YYYY',
//  LL   : 'MMMM D, YYYY',
//  LLL  : 'MMMM D, YYYY h:mm A',
//  LLLL : 'dddd, MMMM D, YYYY h:mm A'
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
  clientAppointment: IUser['appointment'];
  employees: IUser['employee'];
  selectedService: IUser['service'];
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
  unavailableDays: number[] = [];
  public id: string;
  // date = new FormControl(moment());
  datesNotAvailable;
  public day: string[] = [];
  public newDay: string[] = [];
  date = moment();
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
        // console.log('params', this.id);
        // console.log('paramid', this.id);
        this.business.getABusiness(this.id).subscribe(
          (bus) =>
          {
            this.profileInfo = bus[0];
            // console.log(this.profileInfo.cancellationPolicy);
            // console.log(this.profileInfo);
          });
        this.business.getBusServices(this.id).subscribe(
            (servs) =>
            {
              this.services = servs;
              // console.log('services', this.services);
            });
        this.business.getHours(params.get('id')).subscribe(
              (data) =>
              {
                this.theHourOfDay = data[0];
                // console.log(this.theHourOfDay.monday[0].startT);
              });
        this.business.getBusEmployees(this.id).subscribe(
        (emps) =>
        {
          this.employees = emps;
          // console.log(emps);
        });
      });
    this.clientService.getUserInfo().subscribe(
        (data) =>
        {
          this.client = data;
          // console.log(this.client);
        }
      );

    this.booking.getBookedDays(this.id).subscribe(
        (data) => {
          console.log(data);
          console.log(data.length);
          for(let i=0; i<data.length; i++)
          {
            if (data[0].availableTimes.length <= 1)
            {
              let d = data[i].date.slice(7, 10);
              console.log(d);
              let asNum = parseInt(d);
              console.log(asNum);
              this.unavailableDays.push(asNum);
              console.log(this.unavailableDays);
            }
          }
      //       var str = "Mon Mar 15 2021"; 
      //       var res = str.slice(7, 10);
          //   alert('No availabilities for this date');
          
        });
  }




  public onAppointSubmit(clientAppointment: IUser['appointment'])
  {
    if (this.addAppointmentForm.status === 'VALID')
    {
      this.clientAppointment = this.addAppointmentForm.value;
      this.clientAppointment.date = clientAppointment.date.toString();
      this.clientAppointment.date = this.setDate;
      this.clientAppointment.bid = this.id;
      console.log(this.clientAppointment.serviceId);
      // this.selectedService.id = this.clientAppointment.serviceId;
      // console.log(this.selectedService.id);
      let theUser = JSON.parse(localStorage.getItem('user'));
      this.clientAppointment.uid = theUser.uid;
      this.clientAppointment.timeStamp = new Date();
      this.clientAppointment.appointmentId = this.firestore.createId();
      // console.log('timeStamp', clientAppointment.timeStamp);
      // console.log(this.clientAppointment);
      this.booking.addClientAppointment(this.clientAppointment);
      this.booking.addBusinessBooking(this.clientAppointment);

      this.booking.getServiceDuration(this.id, this.clientAppointment).subscribe(
        (data) => {
          this.selectedService = data[0];
          let duration = this.selectedService.duration; // duration of service
          let startTime = this.clientAppointment.time; // service start time
          let endTime = moment(startTime, 'HH:mm:ss')
          .add(duration, 'hours').format('HH:mm:ss'); // get service finish time
          let index1 = this.day.indexOf(startTime); // get index that is = to the selected time
          let index2 = this.day.indexOf(endTime); // get index that is = to the service end time
          console.log('endTime', endTime);
          console.log('indexes of start + end time', index1, index2);
          // gets array of the times between the service start and end time
          let newTimes = this.day.slice(index1, index2);
          console.log('new day hours', newTimes);
          if (index1 === -1 || index2 === -1)
          {
            alert('The duration of this service exceeds the available hours');
          }

          let oldTimes = Array.from(this.day); // store array from associative array
          console.log('old day hours', oldTimes);

          const theDayHours = oldTimes.filter(a => !newTimes.includes(a)); // removes unavailable hours from the array
          console.log(theDayHours); // new schedule for booked date
          console.log(this.clientAppointment.date);
          this.schedule.date = this.clientAppointment.date; // set the date of the booked date
          this.schedule.availableTimes = [];
          this.schedule.availableTimes = theDayHours; // set the new hours of the booked date
          this.booking.addBookingSchedule(clientAppointment.bid, this.schedule);
          this.router.navigate(['/booking-confirmed/', clientAppointment.appointmentId]); // display business dash

        }
      );
    }
  }

  // dateFilter = (m: moment.Moment | null): boolean => {
  //   const day = (m || moment()).day(); // get the day num
  //     // disable hours not available
  //   return day !== 0 ; // disable sunday
  // }

  dateFilter = (d: moment.Moment) => {
    const filter = this.unavailableDays.indexOf(+ d.date()) === -1;
    return filter;
    // return true value index
  }


// get duration of serv, disable time for duration when the selected dat is selected
  newInput(event)
  {

    this.date = moment(event.value);
    const selectedDay = this.date.day();
    this.setDate = this.date.format('ddd MMM DD YYYY');
    console.log(this.date); // moment obj
    console.log(selectedDay); // index of day
    console.log(this.setDate); // the selected day
          // let duration = moment.duration(finishTime.diff(startTime));
          // let diff = duration.hours();
          // // console.log('thediff', diff);
    if (selectedDay)
    {
      this.booking.getBookingSchedule(this.id, this.setDate).subscribe(
      (data) => {
        console.log(data);
        if (data)
        {
          console.log(data.availableTimes.length);
          this.day = Array.from(data.availableTimes);
          console.log('a booked date', this.day);
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
                console.log(mon);
                this.day = Array.from(mon[0][0]);
                console.log('non booked date', this.day);
                // if the hourslist = 0, get date index and disable date
              });
          }
          else if (selectedDay === 2)
          {
            this.hourService.getTue(this.id).subscribe(
              (tues) =>
              {
                // get tuesday hours
                console.log(tues);
                this.day = Array.from(tues[0][0]);
                console.log('non booked date', this.day);
                console.log('its tuesday', selectedDay);
              });
          }
          else if (selectedDay === 3)
          {
            this.hourService.getWed(this.id).subscribe(
              (wed) =>
              {
                // get wednesday hours
                console.log(wed);
                this.day = Array.from(wed[0][0]);
                console.log('non booked date', this.day);
                console.log('its wednesday', selectedDay);
              });
          }
          else if (selectedDay === 4)
          {
            this.hourService.getThur(this.id).subscribe(
              (thur) =>
              {
                // get thursday hours
                console.log(thur);
                this.day = Array.from(thur[0][0]);
                console.log('non booked date', this.day);
                console.log('its thursday', selectedDay);
              });
          }
          else if (selectedDay === 5)
          {
            this.hourService.getFri(this.id).subscribe(
              (fri) =>
              {
                // get firday hours
                console.log(fri);
                this.day = Array.from(fri[0][0]);
                console.log('non booked date', this.day);
                console.log('its friday', selectedDay);
              });
          }
          else if (selectedDay === 6)
          {
            this.hourService.getSat(this.id).subscribe(
              (sat) =>
              {
                // get saturday hours
                console.log(sat);
                this.day = Array.from(sat[0][0]);
                console.log('non booked date', this.day);
                console.log('its saturday', selectedDay);
              });
          }
          else if (selectedDay === 0)
          {
            this.hourService.getSun(this.id).subscribe(
              (sun) =>
              {
                // get sunday hours
                console.log(sun);
                this.day = Array.from(sun[0][0]);
                console.log('non booked date', this.day);
                console.log('its sunday', selectedDay);
              });
          }
        }
      });
    }
  }
}
