import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { IBusiness } from 'src/app/interfaces/i-business';
import { IUser } from 'src/app/interfaces/i-user';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { BusinessService } from 'src/app/services/business.service';
import { FeedbackService } from 'src/app/services/feedback.service';
import { UploadsService } from 'src/app/services/uploads.service';

@Component({
  selector: 'app-business-profile',
  templateUrl: './business-profile.component.html',
  styleUrls: ['./business-profile.component.css'],
})
export class BusinessProfileComponent implements OnInit {
  profileInfo: IBusiness['business'];
  theHours: IUser['hours'];
  employees: IUser['employee'];
  services: IUser['service'];
  public client: IUser['user'];
  public id: string;
  panelOpenState: boolean;
  reviews: IUser['review'][];
  public slides: string[] = [];

  constructor(
    private route: ActivatedRoute,
    public business: BusinessService,
    private feedback: FeedbackService,
    private uploads: UploadsService,
    public authService: AuthenticateService
  ) {}

  ngOnInit() {
    // subscribe to route param to get id from url
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id'); // store id

      // call func to get business images
      this.uploads
        .getBusinessSlideshow(this.id)
        .pipe(take(1))
        .subscribe((data) => {
          this.slides = data.imageURL; // store business images
        });
      // call func to get the business details
      this.business
        .getABusiness(this.id)
        .pipe(take(1))
        .subscribe((bus) => {
          this.profileInfo = bus; // store the business details
        });
      // call func to get the busines hours
      this.business
        .getHours(this.id)
        .pipe(take(1))
        .subscribe((data) => {
          this.theHours = data; // store the business hours
        });

      // call func to get the business' services
      this.business
        .getBusServices(this.id)
        .pipe(take(1))
        .subscribe((servs) => {
          this.services = servs; // store the services
        });

      // call func to get the business employees
      this.business
        .getBusEmployees(this.id)
        .pipe(take(1))
        .subscribe((emps) => {
          this.employees = emps; // sotre business employees
        });
      // call func to get the business' reviews
      this.feedback
        .getBusinessReviews(this.id)
        .pipe(take(1))
        .subscribe((data) => {
          this.reviews = data; // store business reviews
        });
    });
    // call func to get client data
    this.authService
      .getUserInfo()
      .pipe(take(1))
      .subscribe((data) => {
        this.client = data; // store client data
      });
  }
}
