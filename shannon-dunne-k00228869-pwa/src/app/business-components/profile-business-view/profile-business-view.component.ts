import { Component, OnInit } from '@angular/core';
import { IUser } from 'src/app/interfaces/i-user';
import { BusinessService } from 'src/app/services/business.service';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { FeedbackService } from 'src/app/services/feedback.service';
import { take } from 'rxjs/operators';
import { UploadsService } from 'src/app/services/uploads.service';
import { IBusiness } from 'src/app/interfaces/i-business';

@Component({
  selector: 'app-profile-business-view',
  templateUrl: './profile-business-view.component.html',
  styleUrls: ['./profile-business-view.component.css'],
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
    private uploads: UploadsService
  ) {}

  ngOnInit() {
    // call func to get the business users profile
    this.business
      .getBusiness()
      .pipe(take(1))
      .subscribe(
        // get bus doc
        (bus) => {
          this.profileInfo = bus; // store profile data
          if (this.profileInfo.profileCreated) {
            // if the business user has created a profile
            this.isCreated = true; // show profile ui
          } else {
            this.isCreated = false; // hide profile ui
          }
          this.getProfile(); // call func to get employees and services
        }
      );
    // call func to get user data
    this.authService
      .getUserInfo()
      .pipe(take(1))
      .subscribe((data) => {
        this.user = data; // store user data
      });

    // call func to get business working hours
    this.business
      .getBusinessHours()
      .pipe(take(1))
      .subscribe((data) => {
        this.theHours = data[0]; // store business hours array
      });

    // call func to get business reviews
    this.feedback
      .getBusinessReviews(this.user.uid)
      .pipe(take(1))
      .subscribe((data) => {
        this.reviews = data; // store business reviews
      });

    // call func to get business images
    this.uploads
      .getBusinessSlideshow(this.user.uid)
      .pipe(take(1))
      .subscribe((data) => {
        this.slides = data.imageURL; // store business images
        console.log(this.slides);
      });
  }

  async getProfile() {
    // call func to get business employess
    (await this.business.getEmployees()).subscribe((emps) => {
      this.employees = emps; // store employees
    });
    // call func to get business services
    (await this.business.getServices()).subscribe((servs) => {
      this.services = servs; // store services
    });
  }
}
