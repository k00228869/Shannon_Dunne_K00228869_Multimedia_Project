import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { IUser } from 'src/app/interfaces/i-user';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { BookingService } from 'src/app/services/booking.service';
import { BusinessService } from 'src/app/services/business.service';
import { RescheduleService } from 'src/app/services/reschedule.service';

@Component({
  selector: 'app-advertise-appointment',
  templateUrl: './advertise-appointment.component.html',
  styleUrls: ['./advertise-appointment.component.css'],
})
export class AdvertiseAppointmentComponent implements OnInit {
  advertiseForm: FormGroup;
  public id: string;
  public newAppointInfo: IUser['appointment'];
  public appointmentInfo: IUser['appointment'];
  provider: string;

  constructor(
    private dealAppointment: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public bookingService: BookingService,
    public reschedule: RescheduleService,
    private business: BusinessService,
    public authService: AuthenticateService
  ) {}

  ngOnInit() {
    // build form
    this.advertiseForm = this.dealAppointment.group({
      discount: new FormControl('', [Validators.required]),
    });

    // get appointment id from route
    this.route.paramMap.subscribe(async (params) => {
      this.id = params.get('id'); // store appointment id

      // get appointment mattching the appointment id
      (await this.bookingService.getAppointment(this.id))
        .pipe(take(1))
        .subscribe(async (appoint) => {
          this.appointmentInfo = appoint[0]; // store the appointment
          await this.business
            .getBusiness()
            .pipe(take(1))
            .subscribe((busDoc) => {
              this.provider = busDoc.businessName;
            });
        });
    });
  }

  public onSubmit() {
    if (this.advertiseForm.status === 'VALID') {
      this.appointmentInfo.discount = this.advertiseForm.controls.discount.value; // store discount value from form
      this.newAppointInfo = this.appointmentInfo; // store appointment details

      let discount = parseInt(this.newAppointInfo.discount, 10) / 100; // cast discount value to num,and divide by 100 to get percntage val
      let price = this.appointmentInfo.serPrice; // set booking price
      let total = price - price * discount; // get booking price after discount is applied
      this.newAppointInfo.serPrice = total; // set booking price after discount is applied
      this.newAppointInfo.uid = ''; // clear old user id
      this.newAppointInfo.clientName = 'Advertised'; // replace old user name
      this.newAppointInfo.note = '';
      this.newAppointInfo.timeStamp = null; // clear appointment booking time
      this.reschedule.editBusAppointment(this.newAppointInfo); // call func to update the business's appointment
      // call func to add advert to db
      this.reschedule.moveBusAppointment(this.newAppointInfo, this.provider);
      this.reschedule.deleteCancellation(
        // call func to delete the appointment from the cancellation doc
        this.newAppointInfo.appointmentId,
        this.newAppointInfo.bid
      );
      this.changeRoute(this.newAppointInfo.bid); // call func to change route
    } else {
      // if form not valid show alert
      alert('Correct the invalid fields before submitting');
      return;
    }
  }

  changeRoute(busId: string) {
    // pass in the business id and change route
    this.router.navigate(['/business-view/', busId]);
  }
}
