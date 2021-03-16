import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BookingConfirmationComponent} from 'src/app/client-components/booking-confirmation/booking-confirmation.component';
import { IUser } from 'src/app/i-user';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { AngularFirestore } from '@angular/fire/firestore';
import { ClientUserService } from 'src/app/services/client-user.service';
import { BookingService } from 'src/app/services/booking.service';
import { BusinessService } from 'src/app/services/business.service';
import { RescheduleService } from 'src/app/services/reschedule.service';
import { WorkingDaysService } from 'src/app/services/working-days.service';
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
  selector: 'app-reschedule-form',
  templateUrl: './reschedule-form.component.html',
  styleUrls: ['./reschedule-form.component.css'],
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
export class RescheduleFormComponent implements OnInit {
  editAppointmentForm: FormGroup;
  public newAppointment: IUser['appointment'];
  public setDate: string;
  public client: IUser['user'];
  public unavailableDays: number[] = [];
  profileInfo: IUser['business'];
  services: IUser['service'];
  theHourOfDay: IUser['hours'];
  employees: IUser['employee'];
  public selectedService: IUser['service'];
  public selectedEmployee: IUser['employee'];
  public duration: string;
  public day: string[] = [];
  schedule: IUser['bookingSchedule'] = {};
  user: IUser['user'];
  date = moment();

  constructor(
    private editAppointment: FormBuilder,
    public parent: BookingConfirmationComponent,
    public firestore: AngularFirestore,
    public clientService: ClientUserService,
    public bookingService: BookingService,
    public business: BusinessService,
    public reschedule: RescheduleService,
    public hourService: WorkingDaysService,




  ) { }

  ngOnInit(){


    this.editAppointmentForm = this.editAppointment.group({
      employeeId: new FormControl('', Validators.required),
      serviceId: new FormControl('', [Validators.minLength(7)]),
      date: new FormControl(moment(), [Validators.required]),
      time: new FormControl(moment().toString(), [Validators.required]),
      note: new FormControl('', [Validators.required]),
    });

    this.business.getABusiness(this.parent.appointmentInfo.bid).subscribe(
      (bus) =>
      {
        this.profileInfo = bus[0];
      });
    this.business.getBusServices(this.parent.appointmentInfo.bid).subscribe(
      (servs) =>
      {
        this.services = servs;
      });
    this.business.getHours(this.parent.appointmentInfo.bid).subscribe(
      (data) =>
      {
        this.theHourOfDay = data[0];
      });
    this.business.getBusEmployees(this.parent.appointmentInfo.bid).subscribe(
      (emps) =>
      {
        this.employees = emps;
      });

    this.clientService.getUserInfo().subscribe(
      (data) =>
      {
        this.client = data;
      }
    );

    this.bookingService.getBookedDays(this.parent.appointmentInfo.bid).subscribe(
          (data) => {
            for(let i=0; i<data.length; i++)
            {
              if (data[0].availableTimes.length <= 1)
              {
                let d = data[i].date.slice(7, 10);
                let asNum = parseInt(d);
                this.unavailableDays.push(asNum);
              }
            }
          });
  }




  public async editAppointSubmit(newAppointment: IUser['appointment'])
  {
    this.newAppointment = this.editAppointmentForm.value;
    this.newAppointment.date = newAppointment.date.toString();
    this.newAppointment.date = this.setDate;
    this.newAppointment.timeStamp = new Date();
    this.bookingService.getServiceDuration(this.parent.appointmentInfo.bid, newAppointment).subscribe(
      (ser) => {
        this.selectedService = ser[0];
        this.newAppointment.serName = this.selectedService.serviceName; // store service name
        this.duration = this.selectedService.duration; // duration of service
        const startTime = this.newAppointment.time; // service start time
        const endTime = moment(startTime, 'HH:mm:ss')
          .add(this.duration, 'hours').format('HH:mm:ss'); // get service finish time
        const index1 = this.day.indexOf(startTime); // get index that is = to the selected time
        const index2 = this.day.indexOf(endTime); // get index that is = to the service end time
          // gets array of the times between the service start and end time
        const newTimes = this.day.slice(index1, index2);
        const oldTimes = Array.from(this.day); // store array from associative array
        const theDayHours = oldTimes.filter(a => !newTimes.includes(a)); // removes unavailable hours from the array
        this.schedule.date = this.newAppointment.date; // set the date of the booked date
        this.schedule.availableTimes = [];
        this.schedule.availableTimes = theDayHours; // set the new hours of the booked date
      });
    this.bookingService.getEmployeeName(this.parent.appointmentInfo.bid, newAppointment).subscribe(
        (emp) => {
          this.selectedEmployee = emp[0];
          this.newAppointment.empName = this.selectedEmployee.firstName + ' ' + this.selectedEmployee.lastName; // store employee name
        });
    this.business.getUserInfo().subscribe(
      async (user) => {
        this.user = user;
        this.newAppointment.clientName = this.user.firstName + ' ' + this.user.lastName; // store client name
        // console.log('appointment info', this.clientAppointment);
        await this.bookingService.addBookingSchedule(newAppointment.bid, this.schedule);
        this.reschedule.editBookingSchedule(this.parent.appointmentInfo, this.schedule);
        this.reschedule.updateBusAppointment(this.parent.appointmentInfo, newAppointment);
        this.reschedule.updateClientAppointment(this.parent.appointmentInfo, newAppointment);
      });
  }


  dateFilter = (d: moment.Moment) => {
    const filter = this.unavailableDays.indexOf(+ d.date()) === -1;
    return filter;
  }


// get duration of serv, disable time for duration when the selected dat is selected
newInput(event)
{
this.date = moment(event.value);
const selectedDay = this.date.day();
this.setDate = this.date.format('ddd MMM DD YYYY');
// console.log(this.date); // moment obj
// console.log(selectedDay); // index of day
// console.log(this.setDate); // the selected day
      // let duration = moment.duration(finishTime.diff(startTime));
      // let diff = duration.hours();
if (selectedDay)
{
  this.bookingService.getBookingSchedule(this.parent.appointmentInfo.bid, this.setDate).subscribe(
  (data) => {
    if (data)
    {
      // console.log(data.availableTimes.length);
      this.day = Array.from(data.availableTimes);
      //   alert('No availabilities for this date');
    }
    else if (!data)
    {
      if (selectedDay === 1)
      {
        this.hourService.getMon(this.parent.appointmentInfo.bid).subscribe(
          (mon) =>
          {
            // get monday hours
            this.day = Array.from(mon[0][0]);
          });
      }
      else if (selectedDay === 2)
      {
        this.hourService.getTue(this.parent.appointmentInfo.bid).subscribe(
          (tues) =>
          {
            // get tuesday hours
            this.day = Array.from(tues[0][0]);
          });
      }
      else if (selectedDay === 3)
      {
        this.hourService.getWed(this.parent.appointmentInfo.bid).subscribe(
          (wed) =>
          {
            // get wednesday hours
            this.day = Array.from(wed[0][0]);
          });
      }
      else if (selectedDay === 4)
      {
        this.hourService.getThur(this.parent.appointmentInfo.bid).subscribe(
          (thur) =>
          {
            // get thursday hours
            // console.log(thur);
            this.day = Array.from(thur[0][0]);
          });
      }
      else if (selectedDay === 5)
      {
        this.hourService.getFri(this.parent.appointmentInfo.bid).subscribe(
          (fri) =>
          {
            // get firday hours
            this.day = Array.from(fri[0][0]);
          });
      }
      else if (selectedDay === 6)
      {
        this.hourService.getSat(this.parent.appointmentInfo.bid).subscribe(
          (sat) =>
          {
            // get saturday hours
            this.day = Array.from(sat[0][0]);
          });
      }
      else if (selectedDay === 0)
      {
        this.hourService.getSun(this.parent.appointmentInfo.bid).subscribe(
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
