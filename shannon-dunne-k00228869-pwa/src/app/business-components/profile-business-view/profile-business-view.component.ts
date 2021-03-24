import { Component, OnInit } from '@angular/core';
import { IUser } from 'src/app/i-user';
import { Observable } from 'rxjs';
import { BusinessService } from 'src/app/services/business.service';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FeedbackService } from 'src/app/services/feedback.service';
import { take } from 'rxjs/operators';


@Component({
  selector: 'app-profile-business-view',
  templateUrl: './profile-business-view.component.html',
  styleUrls: ['./profile-business-view.component.css']
})
export class ProfileBusinessViewComponent implements OnInit {
  profileInfo: IUser['business'];
  employees: IUser['employee'];
  services: IUser['service'];
  public user: IUser['user'];
  theHours: IUser['hours'];
  public panelOpenState = false;
  isSignedIn = false;
  // public uid: string;
  public id: string;
  reviews: IUser['review'][];


  public isCreated: boolean;

  constructor(
    public business: BusinessService,
    public authService: AuthenticateService,
    private route: ActivatedRoute,
    private feedback: FeedbackService


  ) { }

  ngOnInit()
  {
    if (localStorage.getItem('user') !== null) { // check if user is not empty
      this.isSignedIn = true; // if user is not empty they are signed in
    }
    else {
      this.isSignedIn = false; // if user is empty they are signed out
    }
    this.business.getBusiness().pipe(take(1)).subscribe( // get bus doc
        (bus) =>
        {
          this.profileInfo = bus;
          console.log(bus);
          console.log(this.profileInfo);
          if (this.profileInfo.profileCreated)
          {
            this.isCreated = true;
            console.log('true', this.isCreated);
          }
          else{
            this.isCreated = false;
            console.log('false', this.isCreated);
          }
          this.getProfile();
        }
    );

    this.business.getUserInfo().subscribe(
      (data) =>
      {
        this.user = data;
      });

    this.business.getBusinessHours().subscribe(
      (data) =>
      {
        this.theHours = data[0];
        // console.log(this.theHours.monday[0].startT);
      });

    // this.feedback.getReviews().subscribe(
    //     (data) => {
    //       this.reviews = data;
    //     });

    this.feedback.completeReview(this.user.uid).subscribe(
        (data) => {
          console.log(data);
          this.reviews = data;
        });
    }

  async getProfile()
    {
      (await this.business.getEmployees()).subscribe(
        (emps) =>
        {
          this.employees = emps;
        }
      );
      (await this.business.getServices()).subscribe(
        (servs) =>
        {
          this.services = servs;
        }
      );
    }

}
