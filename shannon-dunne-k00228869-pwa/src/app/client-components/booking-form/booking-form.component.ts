import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IUser } from 'src/app/i-user';
import { BookingService } from 'src/app/services/booking.service';
import { BusinessService } from 'src/app/services/business.service';
import { ClientUserService } from 'src/app/services/client-user.service';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
// import * as moment from 'moment';
// import {Moment} from 'moment/moment';

import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
const moment = _rollupMoment || _moment;

export const MY_FORMATS = {  // set selected date format
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
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
  clientAppointment: IUser['appointment'];
  employees: IUser['employee'];
  services: IUser['service'];
  theHourOfDay: IUser['hours'];
  public client: IUser['user'];
  addAppointmentForm: FormGroup;
  public id: string;
  // date = new FormControl(moment());
  

  constructor(
    private addAppointment: FormBuilder,
    private route: ActivatedRoute,
    public business: BusinessService,
    public clientService: ClientUserService,
    public booking: BookingService,
    public firestore: AngularFirestore,

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
        console.log('params', this.id);
        console.log('paramid', this.id);

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
    // if (this.addAppointmentForm.status === 'VALID')
    // {
      this.clientAppointment = this.addAppointmentForm.value;
      clientAppointment.date = clientAppointment.date.toString();
      clientAppointment.bid = this.id;
      let theUser = JSON.parse(localStorage.getItem('user'));
      clientAppointment.uid = theUser.uid;
      clientAppointment.appointmentId = this.firestore.createId();
      console.log(this.clientAppointment);
      this.booking.addClientAppointment(this.clientAppointment);
      this.booking.addBusinessBooking(this.clientAppointment);
    // }
  }

  dateFilter = (m: moment.Moment | null): boolean => {
    const day = (m || moment()).day();
      // disable hours not available
      // disable sunday
    return day !== 0 ;
  }


  newInput(event)
  {
    const m: moment.Moment = event.value;
    const selectedDay = (m || moment()).day();
    if (m)
    {
      console.log(m.toDate());
      if(selectedDay === 1){

        // get monday hours
        console.log('its monday', selectedDay);
        // disable hours not available
      }
      else if(selectedDay === 2)
      {
        // get tuesday hours
        console.log('its tuesday', selectedDay);
      }
      else if(selectedDay === 3)
      {
        // get wednesday hours
        console.log('its wednesday', selectedDay);
      }
      else if(selectedDay === 4)
      {
        // get thursday hours
        console.log('its thursday', selectedDay);
      }
      else if(selectedDay === 5)
      {
        // get friday hours
        console.log('its friday', selectedDay);
      }
      else if(selectedDay === 6)
      {
        // get saturday hours
        console.log('its saturday', selectedDay);
      }
    }
  }
  // gettheHours = (d: moment.Moment | null): number =>
  // {
  //   console.log('i was called');
  //   const selectedDay = (d || moment()).day();

    
  // }


 







}
