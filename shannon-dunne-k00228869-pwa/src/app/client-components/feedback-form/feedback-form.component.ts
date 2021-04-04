import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { IUser } from 'src/app/interfaces/i-user';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { FeedbackService } from 'src/app/services/feedback.service';
import { NotificationsService } from 'src/app/services/notifications.service';

@Component({
  selector: 'app-feedback-form',
  templateUrl: './feedback-form.component.html',
  styleUrls: ['./feedback-form.component.css'],
})
export class FeedbackFormComponent implements OnInit {
  selectedRating: number;
  addFeedbackForm: FormGroup;
  submittedFeedback: IUser['review'] = {};
  allRatings: IUser['review'][];
  public client: IUser['user'];
  public id: string;
  newSum: number = 0;
  ratingNum: number = 0;
  total: number = 0;

  constructor(
    private addFeedback: FormBuilder,
    private firestore: AngularFirestore,
    public feedbackService: FeedbackService,
    private route: ActivatedRoute,
    private router: Router,
    private notif: NotificationsService,
    private feedback: FeedbackService,
    public authService: AuthenticateService
  ) {}

  ngOnInit() {
    // buold feedback formgroup with validators
    this.addFeedbackForm = this.addFeedback.group({
      rating: new FormControl('', Validators.required),
      comment: new FormControl('', Validators.required),
    });

    // call func to get client data
    this.authService
      .getUserInfo()
      .pipe(take(1))
      .subscribe((data) => {
        this.client = data; // store client data
      });

    // subscribe to route param to get id from url
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id'); // store business id
    });
  }

  // submit form dat
  public async onSubmit() {
    // if from data is valid
    if (this.addFeedbackForm.status === 'VALID') {
      let num: number;
      // store the rating value from the form
      num = Number(this.addFeedbackForm.controls.rating.value);
      this.submittedFeedback.rating = num; // convert rating val to num
      // store comment from form data
      this.submittedFeedback.comment = this.addFeedbackForm.controls.comment.value;
      // set review timestamp
      this.submittedFeedback.timestamp = new Date().toString();
      this.submittedFeedback.uid = this.client.uid; // set user id
      this.submittedFeedback.name =
        this.client.firstName + ' ' + this.client.lastName; // set client name
      this.submittedFeedback.id = this.firestore.createId(); // create review id
      this.submittedFeedback.bid = this.id; // set business id
      this.submittedFeedback.reply = null; // reply set to null to simplify querying

      // call func to get the business' reviews
      (await this.feedback.getBusinessReviews(this.submittedFeedback.bid))
        .pipe(take(1))
        .subscribe(async (reviewCollection) => {
          this.allRatings = reviewCollection; // store business reviews
          let numberOfRatings = this.allRatings.length; // get number of reviews

          // loop through rating docs
          for (let i = 0; i < this.allRatings.length; i++) {
            this.ratingNum = this.allRatings[i].rating; // store rating value of doc
            this.newSum = +this.newSum + +this.ratingNum; // add each rating to newSum, brackets and + prevents concating
          }
          this.newSum = +this.newSum + +this.submittedFeedback.rating; // add current rating to ratings
          let ratingCount = +1 + +numberOfRatings; // adding current rating to number of ratings
          this.total = this.newSum / ratingCount; // total divided by number of ratings to get average rating
          // call func to delete the review notification
          this.notif.deleteRNotifications(this.submittedFeedback.bid);
          // call func to add average rating to bus doc
          this.feedback.averageRating(this.total, this.submittedFeedback.bid);
          // call func to add review to business
          this.feedbackService.addReview(this.submittedFeedback, this.id);
          // call func to change route
          this.changeRoute();
        });
    } else {
      // if form data is invalid show alert
      alert('Correct the invalid fields before submitting');
      return;
    }
  }

  changeRoute() {
    // go to business profile page
    this.router.navigate(['/business-profile/', this.id]);
  }
}
