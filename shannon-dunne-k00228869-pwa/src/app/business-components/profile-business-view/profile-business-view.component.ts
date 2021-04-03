import { Component, OnInit } from '@angular/core';
import { IUser } from 'src/app/interfaces/i-user';
import { Observable } from 'rxjs';
import { BusinessService } from 'src/app/services/business.service';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FeedbackService } from 'src/app/services/feedback.service';
import { take } from 'rxjs/operators';
import { UploadsService } from 'src/app/services/uploads.service';
import { IBusiness } from 'src/app/interfaces/i-business';


@Component({
  selector: 'app-profile-business-view',
  templateUrl: './profile-business-view.component.html',
  styleUrls: ['./profile-business-view.component.css']
})
export class ProfileBusinessViewComponent implements OnInit {
  profileInfo: IBusiness['business'];
  employees: IUser['employee'];
  services: IUser['service'][];
  public user: IUser['user'];
  theHours: IUser['hours'];
  public panelOpenState = false;
  isSignedIn = false;
  public slides: string[] = [];
  reviews: IUser['review'][];


  public isCreated: boolean;

  constructor(
    public business: BusinessService,
    public authService: AuthenticateService,
    private feedback: FeedbackService,
    private uploads: UploadsService,
  ) { }

  ngOnInit()
  {
    // if (localStorage.getItem('user') !== null) { // check if user is not empty
    //   this.isSignedIn = true; // if user is not empty they are signed in
    // }
    // else {
    //   this.isSignedIn = false; // if user is empty they are signed out
    // }
    this.business.getBusiness().pipe(take(1)).subscribe( // get bus doc
        (bus) =>
        {
          this.profileInfo = bus;
          if (this.profileInfo.profileCreated)
          {
            this.isCreated = true;
          }
          else{
            this.isCreated = false;
          }
          this.getProfile();
        });
    this.business.getUserInfo().subscribe(
      (data) =>
      {
        this.user = data;
      });

    this.business.getBusinessHours().subscribe(
      (data) =>
      {
        this.theHours = data[0];
      });
    this.feedback.getBusinessReviews(this.user.uid).subscribe(
        (data) => {
          this.reviews = data;
        });

    this.uploads.getBusinessSlideshow(this.user.uid).subscribe(
      (data) => {
        this.slides = data.imageURL;
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
