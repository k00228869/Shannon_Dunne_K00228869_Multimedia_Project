import { Component, OnInit } from '@angular/core';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { IUser } from 'src/app/i-user';
import { BusinessService } from 'src/app/services/business.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { BookingService } from 'src/app/services/booking.service';
import { FeedbackService } from 'src/app/services/feedback.service';

@Component({
  selector: 'app-business-dashboard',
  templateUrl: './business-dashboard.component.html',
  styleUrls: ['./business-dashboard.component.css']
})
export class BusinessDashboardComponent implements OnInit {
  businessProfile: IUser['business'];
  public isSignedIn = false;
  public id: string;
  panelOpenState = false;
  public user: IUser['user'];
  allBookings: IUser['appointment'][];
  public serInfo: IUser['service'];
  public empInfo: IUser['employee'];
  allAppoint: string[] = [];
  reviews: IUser['review'][];
  constructor(
    public authService: AuthenticateService,
    public business: BusinessService,
    private route: ActivatedRoute,
    private router: Router,
    public booking: BookingService,
    private feedback: FeedbackService

  ) { }

  ngOnInit()
 {
    if (localStorage.getItem('user') !== null) // if user is not empty
    {
      this.isSignedIn = true; // user is signed in
    }
    else {
      this.isSignedIn = false; // user is signed out
      this.router.navigate(['/login']); // display business dash
    }

    this.business.getUserInfo().subscribe(
      async (data) =>
      {
        this.user = data; // get users data
        await this.booking.getBusinessAppointment().subscribe(
          (data) => {
            this.allBookings = data; // get all appointments
          }
        );
        await this.feedback.someReviews(this.user.uid).subscribe(
          (reviewList) => {
            this.reviews = reviewList; // get all reviews
            console.log(this.reviews);
          });
      }
    );
    // this.feedback.getReviews().subscribe(
    //   (data) => {
    //     this.reviews = data; // get all reviews
    //   });
  }
}


