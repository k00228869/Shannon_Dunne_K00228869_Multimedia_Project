import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { IBusiness } from 'src/app/interfaces/i-business';
import { IDeals } from 'src/app/interfaces/i-deals';
import { IUser } from 'src/app/interfaces/i-user';
import { BusinessService } from 'src/app/services/business.service';
import { ClientUserService } from 'src/app/services/client-user.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { RescheduleService } from 'src/app/services/reschedule.service';

@Component({
  selector: 'app-business-deals',
  templateUrl: './business-deals.component.html',
  styleUrls: ['./business-deals.component.css'],
})
export class BusinessDealsComponent implements OnInit {
  public appointAdverts: IDeals['deal'][];
  dealBooking: IUser['appointment'];
  client: IUser['user'];
  bookedBusiness: IBusiness['business'];

  constructor(
    private reschedule: RescheduleService,
    private clientService: ClientUserService,
    private router: Router,
    private business: BusinessService,
    private notif: NotificationsService
  ) {}

  async ngOnInit() {
    this.reschedule.getDeals().pipe(take(1)).subscribe((data) => {
      this.appointAdverts = data;
    });

    this.clientService.getUserInfo().pipe(take(1)).subscribe((data) => {
      this.client = data;
    });
  }

  public async addBooking(appoint: IDeals['deal']) {
    this.dealBooking = {
      appointmentId: appoint.appointmentId,
      bid: appoint.bid,
      uid: this.client.uid,
      time: appoint.time,
      date: appoint.date,
      serName: appoint.serName,
      serPrice: appoint.serPrice,
      clientName: this.client.firstName + ' ' + this.client.lastName,
      employeeId: appoint.employeeId,
      empName: appoint.empName,
      serviceId: appoint.serviceId,
      serDuration: appoint.serDuration,
      timeStamp: new Date(),
      phone: this.client.phone.toString()
    };
    this.reschedule.updateDealappointment(this.dealBooking); // update business appointment
    this.reschedule.storeDealAppointment(this.dealBooking); // store client appointment
    this.reschedule.deleteDealAdvert(this.dealBooking.appointmentId); // remove advert for appointment
    this.business.getABusiness(this.dealBooking.bid).subscribe(async (data) => {
      this.bookedBusiness = data;
      this.notif.appoinmtentReminder(
        this.dealBooking,
        this.bookedBusiness
      ); // create appointment notification
      this.notif.reviewReminder(this.dealBooking, this.bookedBusiness); // create review notification
      this.changeRoute(appoint);
    });
  }

  changeRoute(appoint: IDeals['deal']) {
    this.router.navigate(['/booking-confirmed/', appoint.appointmentId]);
  }
}
