import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IUser } from 'src/app/i-user';
import { BusinessService } from 'src/app/services/business.service';

@Component({
  selector: 'app-business-profile',
  templateUrl: './business-profile.component.html',
  styleUrls: ['./business-profile.component.css']
})
export class BusinessProfileComponent implements OnInit {
  profileInfo: IUser['business'];
  employees: IUser['employee'];
  services: IUser['service'];
  
  constructor(
    private route: ActivatedRoute,
    public business: BusinessService,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(
      async (params) =>
      {
        console.log(params);
        this.business.getABusiness(params.get('id')).subscribe(
          (bus) =>
          {
            this.profileInfo = bus[0];
            // console.log(this.profileInfo);
          });


        (await this.business.getBusEmployees(params.get('id'))).subscribe(
        (emps) =>
        {
          this.employees = emps[0];
          // console.log(this.employees);
        });


        (await this.business.getBusServices(params.get('id'))).subscribe(
        (servs) =>
        {
          this.services = servs[0];
          console.log(this.services);
        });
      });
  }
}
