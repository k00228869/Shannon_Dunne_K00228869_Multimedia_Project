import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
  schedule: IUser['bookingSchedule'];
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
  public id: string;
  // date = new FormControl(moment());
  datesNotAvailable;
  public day: string[] = [];
  public newDay: string[] = [];
  date = moment();

  constructor(
    private addAppointment: FormBuilder,
    private route: ActivatedRoute,
    public business: BusinessService,
    public clientService: ClientUserService,
    public booking: BookingService,
    public firestore: AngularFirestore,
    public hourService: WorkingDaysService


  ) { }

  ngOnInit(){
    this.addAppointmentForm = this.addAppointment.group({
      employeeId: new FormControl('', Validators.required),
      serviceId: new FormControl('', [Validators.minLength(7)]),
      date: new FormControl('', [Validators.required]),
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
  }




  public onAppointSubmit(clientAppointment: IUser['appointment'])
  {
    if (this.addAppointmentForm.status === 'VALID')
    {
      this.clientAppointment = this.addAppointmentForm.value;
      this.clientAppointment.date = clientAppointment.date.toString();
      this.clientAppointment.bid = this.id;
      console.log(this.clientAppointment.serviceId);
      // this.selectedService.id = this.clientAppointment.serviceId;
      // console.log(this.selectedService.id);
      let theUser = JSON.parse(localStorage.getItem('user'));
      this.clientAppointment.uid = theUser.uid;
      this.clientAppointment.timeStamp = new Date();
      // console.log('timeStamp', clientAppointment.timeStamp);
      this.clientAppointment.appointmentId = this.firestore.createId();
      // console.log(this.clientAppointment);
      this.booking.addClientAppointment(this.clientAppointment);
      this.booking.addBusinessBooking(this.clientAppointment);

      this.booking.getServiceDuration(this.id, this.clientAppointment).subscribe(
        (data) => {
          // console.log('service', data);
          // const service = data[0];
          
          this.selectedService = data[0];
          // console.log(this.selectedService.duration);
          let duration = this.selectedService.duration; // duration of service
          let startTime = this.clientAppointment.time; // service start time
          let endTime = moment(startTime, 'HH:mm:ss')
          .add(duration, 'hours').format('HH:mm:ss'); // get service finish time
          let index1 = this.day[0].indexOf(startTime); // get index that is = to the selected time
          let index2 = this.day[0].indexOf(endTime); // get index that is = to the service end time

          // gets array of the times between the service start and end time
          let newTimes = Array.from(this.day[0].slice(index1, index2 + 1));
          let oldTimes = Array.from(this.day[0]); // store array from associative array
          const theDayHours = oldTimes.filter(a => !newTimes.includes(a)); // removes unavailable hours from the array
          console.log(theDayHours); // new shcedule for booked date
          console.log(this.clientAppointment.date);
          // this.schedule.date = this.clientAppointment.date;
          // this.schedule.availableTimes = this.day;

          // this.booking.addBookingSchedule(this.id, this.schedule);


        }
      )
    }
  }

  dateFilter = (m: moment.Moment | null): boolean => {
    const day = (m || moment()).day();
      // disable hours not available
      // disable sunday
    return day !== 0 ;
  }

// get duration of serv, disable time for duration when the selected dat is selected
  newInput(event)
  {

    this.date = moment(event.value);
    const selectedDay = this.date.day();
    let setDate = this.date.format('ddd MMM DD YYYY');
    


    // const date = moment(event.value).format('ddd MMM DD YYYY');
    // const s: moment.Moment = event.value;
    // const date = (d || moment(d, 'ddd MMM DD YYYY'));
    console.log(this.date);
    // const selectedDay = (s || moment()).day();
    console.log(selectedDay);
    console.log(setDate);
        // let startTime = moment(this.start, 'HH:mm:ss'); // formating time
          // let finishTime = moment(this.end, 'HH:mm:ss'); // formating time
          // let duration = moment.duration(finishTime.diff(startTime));
          // let diff = duration.hours();
          // // console.log('thediff', diff);
          // this.dailyWorkHours.push(diff);
          // this.dailyHours = this.dailyWorkHours;
    if (selectedDay)
    {
      // console.log(m.toString());

      // let selectedDate = d.toString();
      this.booking.getBookingSchedule(this.id, setDate).subscribe(
          (data) => {
            if (data! == null)
            {
              this.day = data[0].availableTimes;
              console.log('a booked date', this.day);
            }
            else
            {
              if (selectedDay === 1)
              {
                this.hourService.getMon(this.id).subscribe(
                  (data) =>
                  {
                    // get monday hours
                    console.log(data);
                    this.day.push(data[0][0]);
                    // console.log('non booked date', this.day);
                    // console.log('its monday', selectedDay);
                  });
              }
              else if (selectedDay === 2)
              {
                this.hourService.getTue(this.id).subscribe(
                  (data) =>
                  {
                    // get tuesday hours
                    console.log(data);
                    this.day.push(data[0][0]);
                    console.log('non booked date', this.day);
                    console.log('its tuesday', selectedDay);
                  });
              }
              else if (selectedDay === 3)
              {
                this.hourService.getWed(this.id).subscribe(
                  (data) =>
                  {
                    // get wednesday hours
                    console.log(data);
                    this.day.push(data[0][0]);
                    console.log('non booked date', this.day);
                    console.log('its wednesday', selectedDay);
                  });
              }
              else if (selectedDay === 4)
              {
                this.hourService.getThur(this.id).subscribe(
                  (data) =>
                  {
                    // get thursday hours
                    console.log(data);
                    this.day.push(data[0][0]);
                    console.log('non booked date', this.day);
                    console.log('its thursday', selectedDay);
                  });
              }
              else if (selectedDay === 5)
              {
                this.hourService.getFri(this.id).subscribe(
                  (data) =>
                  {
                    // get firday hours
                    console.log(data);
                    this.day.push(data[0][0]);
                    console.log('non booked date', this.day);
                    console.log('its friday', selectedDay);
                  });
              }
              else if (selectedDay === 6)
              {
                this.hourService.getSat(this.id).subscribe(
                  (data) =>
                  {
                    // get saturday hours
                    console.log(data);
                    this.day.push(data[0][0]);
                    console.log('non booked date', this.day);
                    console.log('its saturday', selectedDay);
                  });
              }
              else if (selectedDay === 0)
              {
                this.hourService.getSun(this.id).subscribe(
                  (data) =>
                  {
                    // get sunday hours
                    console.log(data);
                    this.day.push(data[0][0]);
                    console.log('non booked date', this.day);
                    console.log('its sunday', selectedDay);
                  });
              }
            }
          }
        );
    }
  }
  // gettheHours = (d: moment.Moment | null): number =>
  // {
  //   console.log('i was called');
  //   const selectedDay = (d || moment()).day();
  // }


 







}
