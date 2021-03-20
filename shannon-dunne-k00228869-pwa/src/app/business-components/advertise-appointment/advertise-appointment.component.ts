import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IUser } from 'src/app/i-user';
import { BookingService } from 'src/app/services/booking.service';
import { RescheduleService } from 'src/app/services/reschedule.service';

@Component({
  selector: 'app-advertise-appointment',
  templateUrl: './advertise-appointment.component.html',
  styleUrls: ['./advertise-appointment.component.css']
})
export class AdvertiseAppointmentComponent implements OnInit {
  advertiseForm: FormGroup;
  public id: string;
  public newAppointInfo: IUser['appointment'];
  public appointmentInfo: IUser['appointment'];
  deal: string;



  constructor(
    private dealAppointment: FormBuilder,
    private route: ActivatedRoute,
    public bookingService: BookingService,
    public reschedule: RescheduleService
  ) { }


  ngOnInit(){
    this.advertiseForm = this.dealAppointment.group({
      discount: new FormControl('', [Validators.required]),
    });

    this.route.paramMap.subscribe(
      (params) =>
      {
        this.id = params.get('id');

        this.bookingService.getAppointment(this.id).subscribe(
        (appoint) =>
        {
          this.appointmentInfo = appoint[0];
          console.log('appointInfo', this.appointmentInfo);
        });
    });
  }


  public  onSubmit(){
    this.deal = this.advertiseForm.value;
    this.newAppointInfo = this.appointmentInfo;
    let theDiscount = parseFloat(this.deal); // convert to float
    let percent = (theDiscount / 100) * this.appointmentInfo.serPrice; // get price after discount
    this.newAppointInfo.serPrice = percent; // set price
    this.newAppointInfo.uid = '';
    this.newAppointInfo.clientName = '';
    this.newAppointInfo.note = '';
    this.newAppointInfo.timeStamp = null;
    this.reschedule.editBusAppointment(this.newAppointInfo);
    this.reschedule.moveBusAppointment(this.newAppointInfo);
  }

}
