import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IUser } from 'src/app/i-user';
import { BookingService } from 'src/app/services/booking.service';
import { BusinessService } from 'src/app/services/business.service';
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
  public deal: string;
  provider: string;

  constructor(
    private dealAppointment: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public bookingService: BookingService,
    public reschedule: RescheduleService,
    private business: BusinessService
  ) { }


  ngOnInit(){
    this.advertiseForm = this.dealAppointment.group({
      discount: new FormControl('', [Validators.required]),
    });


    this.route.paramMap.subscribe(
      async (params) =>
      {
        this.id = params.get('id');

        (await this.bookingService.getAppointment(this.id)).subscribe(
        async (appoint) =>
        {
          console.log('appointt', appoint);
          this.appointmentInfo = appoint[0];
          console.log('appointInfo', this.appointmentInfo);

          await this.business.getBusiness().subscribe(
            (busDoc) => {
              console.log(busDoc);
              this.provider = busDoc.businessName;
              console.log(this.provider);
            });
        });
    });
  }


  public onSubmit(){
    this.appointmentInfo.discount = this.advertiseForm.controls.discount.value; // store discount value
    this.newAppointInfo = this.appointmentInfo; // copy appointment details
    let discount =  parseInt(this.newAppointInfo.discount, 10) / 100; // get discount value
    let price = this.appointmentInfo.serPrice; // set booking price
    let total = price - (price * discount); // get booking price after discount
    this.newAppointInfo.serPrice = total; // set booking price after discount is applied
    this.newAppointInfo.uid = ''; // clear old user id
    this.newAppointInfo.clientName = 'Advertised'; // replace old user name
    this.newAppointInfo.note = '';
    this.newAppointInfo.timeStamp = null;
    this.reschedule.editBusAppointment(this.newAppointInfo);
    this.reschedule.moveBusAppointment(this.newAppointInfo, this.provider);
    this.reschedule.deleteCancellation(this.newAppointInfo.appointmentId, this.newAppointInfo.bid);
    this.changeRoute(this.newAppointInfo.bid);
  }



  changeRoute(busId: string){
    this.router.navigate(['/business-view/', busId]);
  }

}