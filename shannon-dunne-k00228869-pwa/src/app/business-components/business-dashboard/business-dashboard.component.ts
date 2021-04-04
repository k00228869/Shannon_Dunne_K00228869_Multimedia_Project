import { Component, OnInit } from '@angular/core';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { IUser } from 'src/app/interfaces/i-user';
import { BusinessService } from 'src/app/services/business.service';
import { BookingService } from 'src/app/services/booking.service';
import { FeedbackService } from 'src/app/services/feedback.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-business-dashboard',
  templateUrl: './business-dashboard.component.html',
  styleUrls: ['./business-dashboard.component.css'],
})
export class BusinessDashboardComponent implements OnInit {
  panelOpenState = false;
  public user: IUser['user'];
  allBookings: IUser['appointment'][];
  reviews: IUser['review'][];
  public noAppointments: boolean = false;
  public noReviews: boolean = false;

  constructor(
    public authService: AuthenticateService,
    public business: BusinessService,
    public booking: BookingService,
    private feedback: FeedbackService
  ) {}

  ngOnInit() {

    // cal func to get user doc
    this.authService.getUserInfo().subscribe(async (data) => {
      this.user = data; // store users data

      // call func to get all of the businesses appointments
      this.booking
        .getBusinessAppointment()
        .pipe(take(1))
        .subscribe((data) => {
          this.allBookings = data; // store all appointments

          // if their is not appointments, or the variable is undefined
          if (
            this.allBookings.length === 0 ||
            this.allBookings.length === undefined
          ) {
            this.noAppointments = true; // show message for no appointments
          } else {
            this.noAppointments = false; // hide message for no appoinments
          }
        });
      // get  new reviews (reviews without a reply property)
      await this.feedback
        .someReviews(this.user.uid)
        .pipe(take(1))
        .subscribe((reviewList) => {
          this.reviews = reviewList; //store reviews

          // if their is not reviews, or the variable is undefined
          if (this.reviews.length === 0 || this.reviews.length === undefined) {
            this.noReviews = true; // show no reviews message
          } else {
            this.noReviews = false; // hide no reviews message
          }
        });
    });
  }
}
