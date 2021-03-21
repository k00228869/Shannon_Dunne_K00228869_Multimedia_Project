import { Component, OnInit } from '@angular/core';
import { IDeals } from 'src/app/i-deals';
import { IUser } from 'src/app/i-user';
import { RescheduleService } from 'src/app/services/reschedule.service';

@Component({
  selector: 'app-business-deals',
  templateUrl: './business-deals.component.html',
  styleUrls: ['./business-deals.component.css']
})
export class BusinessDealsComponent implements OnInit {
  public appointAdverts: IDeals['deal'][];
  dealBooking: IUser['appointment'];
  constructor(
    private reschedule: RescheduleService
  ) { }

  async ngOnInit()
  {
    await this.reschedule.getDeals().subscribe(
      (data) => {
        this.appointAdverts = data;
        console.log('all deals', this.appointAdverts);
      });
  }


  addBooking(appoint: IDeals['deal'])
  {
    this.dealBooking.appointmentId = appoint.appointmentId;
    this.dealBooking.bid = appoint.bid;
    this.dealBooking.uid = appoint.uid;
    this.dealBooking.time = appoint.time;
    this.dealBooking.date = appoint.date;
    this.dealBooking.serName = appoint.serName;
    this.dealBooking.serPrice = appoint.serPrice;
    this.dealBooking.clientName = appoint.clientName;
    this.dealBooking.employeeId = appoint.employeeId;
    this.dealBooking.empName = appoint.empName;
    this.dealBooking.serviceId = appoint.serviceId;
    this.dealBooking.serDuration = appoint.serDuration;
    this.dealBooking.timeStamp = new Date();
    this.reschedule.updateDealappointment(this.dealBooking);
    this.reschedule.storeDealAppointment(this.dealBooking);
    // remove appointment from deals page
    this.reschedule.deleteDealAdvert(this.dealBooking.appointmentId);
  }
}
