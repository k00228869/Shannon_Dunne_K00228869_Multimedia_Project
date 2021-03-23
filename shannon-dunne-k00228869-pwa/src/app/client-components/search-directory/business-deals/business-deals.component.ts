import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IDeals } from 'src/app/i-deals';
import { IUser } from 'src/app/i-user';
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
  bookedBusiness: IUser['business'];

  constructor(
    private reschedule: RescheduleService,
    private clientService: ClientUserService,
    private router: Router,
    private business: BusinessService,
    private notif: NotificationsService
  ) {}

  async ngOnInit() {
    await this.reschedule.getDeals().subscribe((data) => {
      this.appointAdverts = data;
      console.log('all deals', this.appointAdverts);
    });

    await this.clientService.getUserInfo().subscribe((data) => {
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
    };
    this.reschedule.updateDealappointment(this.dealBooking); // update business appointment
    this.reschedule.storeDealAppointment(this.dealBooking); // store client appointment
    this.reschedule.deleteDealAdvert(this.dealBooking.appointmentId); // remove advert for appointment
    this.business.getABusiness(this.dealBooking.bid).subscribe(async (data) => {
      this.bookedBusiness = data;
      await this.notif.appoinmtentReminder(
        this.dealBooking,
        this.bookedBusiness
      ); // create appointment notification
      await this.notif.reviewReminder(this.dealBooking, this.bookedBusiness); // create review notification
      await this.changeRoute(appoint);
    });
  }

  changeRoute(appoint: IDeals['deal']) {
    this.router.navigate(['/booking-confirmed/', appoint.appointmentId]);
  }
}
