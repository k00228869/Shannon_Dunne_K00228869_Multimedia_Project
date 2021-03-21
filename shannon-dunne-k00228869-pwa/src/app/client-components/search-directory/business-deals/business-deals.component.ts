import { Component, OnInit } from '@angular/core';
import { IDeals } from 'src/app/i-deals';
import { RescheduleService } from 'src/app/services/reschedule.service';

@Component({
  selector: 'app-business-deals',
  templateUrl: './business-deals.component.html',
  styleUrls: ['./business-deals.component.css']
})
export class BusinessDealsComponent implements OnInit {
  public appointAdverts: IDeals['deal'][];

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


}
