import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
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
        this.business.getABusiness(this.id).subscribe(
          (bus) =>
          {
            this.profileInfo = bus;
          });

        this.business.getHours(this.id).subscribe(
            (data) =>
            {
              this.theHours = data;
            });

        this.business.getBusServices(this.id).subscribe(
            (servs) =>
            {
              this.services = servs;
            });

        this.business.getBusEmployees(this.id).subscribe(
        (emps) =>
        {
          this.employees = emps;
        });
      });

    this.clientService.getUserInfo().pipe(take(1)).subscribe(
        (data) =>
        {
          this.client = data;
        }
      );


    this.feedback.getBusinessReviews(this.id).subscribe(
      (data) => {
        this.reviews = data;
      }
    );
  }
}


