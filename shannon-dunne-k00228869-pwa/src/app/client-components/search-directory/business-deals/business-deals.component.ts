import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { IBusiness } from 'src/app/interfaces/i-business';
import { IDeals } from 'src/app/interfaces/i-deals';
import { IUser } from 'src/app/interfaces/i-user';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { BusinessService } from 'src/app/services/business.service';
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
    private router: Router,
    public auth: AuthenticateService,
    private business: BusinessService,
    private notif: NotificationsService
  ) {}

  async ngOnInit() {
    // call func to get deal appointments from db
    this.reschedule
      .getDeals()
      .pipe(take(1))
      .subscribe((data) => {
        this.appointAdverts = data; // store deals
      });

    // call func to get user data
    this.auth
      .getUserInfo()
      .pipe(take(1))
      .subscribe((data) => {
        this.client = data; // store user data
      });
  }

  // call func to book deal
  public async addBooking(appoint: IDeals['deal']) {
    // set deal obj data
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
      phone: this.client.phone.toString(),
    };
    // call func to update the booked appointment
    this.reschedule.updateDealappointment(this.dealBooking);
    // call func to store appointment for client
    this.reschedule.storeDealAppointment(this.dealBooking);
    // call func to delete the advert from the deal collection
    this.reschedule.deleteDealAdvert(this.dealBooking.appointmentId);
    // call func to get business data
    this.business.getABusiness(this.dealBooking.bid).subscribe(async (data) => {
      this.bookedBusiness = data; // store business data
      // call func to add appointment notification to db
      this.notif.appoinmtentReminder(this.dealBooking, this.bookedBusiness); // call func to add review notification to db
      this.notif.reviewReminder(this.dealBooking, this.bookedBusiness);
      // call func to change route
      this.changeRoute(appoint);
    });
  }

  // pass in appointment id and display confirmation page
  changeRoute(appoint: IDeals['deal']) {
    this.router.navigate(['/booking-confirmed/', appoint.appointmentId]);
  }
}
