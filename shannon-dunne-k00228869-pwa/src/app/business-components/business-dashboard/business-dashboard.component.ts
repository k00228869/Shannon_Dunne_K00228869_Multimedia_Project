import { Component, OnInit } from '@angular/core';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { IUser } from 'src/app/interfaces/i-user';
import { BusinessService } from 'src/app/services/business.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { BookingService } from 'src/app/services/booking.service';
import { FeedbackService } from 'src/app/services/feedback.service';

@Component({
  selector: 'app-business-dashboard',
  templateUrl: './business-dashboard.component.html',
  styleUrls: ['./business-dashboard.component.css'],
})
export class BusinessDashboardComponent implements OnInit {
  public isSignedIn = false;
  panelOpenState = false;
  public user: IUser['user'];
  allBookings: IUser['appointment'][];
  reviews: IUser['review'][];
  public noAppointments: boolean = false;
  public noReviews: boolean = false;

  constructor(
    public authService: AuthenticateService,
    public business: BusinessService,
    private router: Router,
    public booking: BookingService,
    private feedback: FeedbackService
  ) {}

  ngOnInit() {
    if (localStorage.getItem('user') !== null) {
      // if user is not empty
      this.isSignedIn = true; // user is signed in
    } else {
      this.isSignedIn = false; // user is signed out
      this.router.navigate(['/login']); // display business dash
    }

    this.business.getUserInfo().subscribe(async (data) => {
      this.user = data; // get users data
      await this.booking.getBusinessAppointment().subscribe((data) => {
        this.allBookings = data; // get all appointments
        if (this.reviews.length === 0)
          {
            this.noAppointments = true; // no appointments
          }
          else{
            this.noAppointments = false; // there is appointments
          }
      });
      await this.feedback.someReviews(this.user.uid).subscribe(
        // get  new reviews (reviews without a reply property)
        (reviewList) => {
          this.reviews = reviewList;
          if (this.reviews.length === 0)
          {
            this.noReviews = true; // no appointments
          }
          else{
            this.noReviews = false; // there is appointments
          }
        }
      );
    });
  }
}
