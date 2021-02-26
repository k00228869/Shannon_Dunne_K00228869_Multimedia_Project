import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IUser } from 'src/app/i-user';
import { BusinessService } from 'src/app/services/business.service';
import { ClientUserService } from 'src/app/services/client-user.service';

@Component({
  selector: 'app-business-profile',
  templateUrl: './business-profile.component.html',
  styleUrls: ['./business-profile.component.css']
})
export class BusinessProfileComponent implements OnInit {
  profileInfo: IUser['business'];
  employees: IUser['employee'];
  services: IUser['service'];
  public client: IUser['user'];
  public id: string;
  panelOpenState: boolean;


  constructor(
    private route: ActivatedRoute,
    public business: BusinessService,
    public clientService: ClientUserService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(
      (params) =>
      {
        this.id = params.get('id');
        console.log('params', this.id);
        console.log('paramid', this.id);

        this.business.getABusiness(params.get('id')).subscribe(
          (bus) =>
          {
            this.profileInfo = bus[0];
            // console.log(this.profileInfo);
          });


        this.business.getBusServices(this.id).subscribe(
            (servs) =>
            {
              this.services = servs;
              console.log('services', this.services);
              console.log('called');
            });


        this.business.getBusEmployees(this.id).subscribe(
        (emps) =>
        {
          this.employees = emps;
          console.log(emps);
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
}
