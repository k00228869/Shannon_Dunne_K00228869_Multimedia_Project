import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IUser } from 'src/app/i-user';
import { BusinessService } from 'src/app/services/business.service';
import { ClientUserService } from 'src/app/services/client-user.service';
import { FeedbackService } from 'src/app/services/feedback.service';

@Component({
  selector: 'app-business-profile',
  templateUrl: './business-profile.component.html',
  styleUrls: ['./business-profile.component.css']
})
export class BusinessProfileComponent implements OnInit {
  profileInfo: IUser['business'];
  theHours: IUser['hours'];
  employees: IUser['employee'];
  services: IUser['service'];
  public client: IUser['user'];
  public id: string;
  panelOpenState: boolean;
  keys: string[];
  reviews: IUser['review'][];


  constructor(
    private route: ActivatedRoute,
    public business: BusinessService,
    public clientService: ClientUserService,
    private feedback: FeedbackService

  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(
      (params) =>
      {
        this.id = params.get('id');
        this.business.getABusiness(params.get('id')).subscribe(
          (bus) =>
          {
            this.profileInfo = bus[0];
          });

        this.business.getHours(params.get('id')).subscribe(
            (data) =>
            {
              this.theHours = data[0];
              // console.log(this.theHours.monday[0].startT);
            });

        this.business.getBusServices(this.id).subscribe(
            (servs) =>
            {
              this.services = servs;
              // console.log('services', this.services);
            });

        this.business.getBusEmployees(this.id).subscribe(
        (emps) =>
        {
          this.employees = emps;
          // console.log(emps);
        });
      });

    this.clientService.getUserInfo().subscribe(
        (data) =>
        {
          this.client = data;
          // console.log(this.client);
        }
      );

    this.feedback.getBusinessReviews(this.id).subscribe(
      (data) => {
        console.log(data);
        this.reviews = data;
      }
    );
  }
}


