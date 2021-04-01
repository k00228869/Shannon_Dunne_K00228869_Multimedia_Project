import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { IUser } from 'src/app/i-user';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { ClientUserService } from 'src/app/services/client-user.service';
import { FeedbackService } from 'src/app/services/feedback.service';
import { NotificationsService } from 'src/app/services/notifications.service';

@Component({
  selector: 'app-feedback-form',
  templateUrl: './feedback-form.component.html',
  styleUrls: ['./feedback-form.component.css']
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
    public clientService: ClientUserService,
    private firestore: AngularFirestore,
    public feedbackService: FeedbackService,
    private route: ActivatedRoute,
    private router: Router,
    private notif: NotificationsService,
    private feedback: FeedbackService,
    public authService: AuthenticateService,

  ) { }

  ngOnInit(){
    this.addFeedbackForm = this.addFeedback.group({
      rating: new FormControl('', Validators.required),
      comment: new FormControl('', Validators.required),
    });

    this.clientService.getUserInfo().subscribe(
      (data) =>
      {
        this.client = data;
      });

    this.route.paramMap.subscribe(
        (params) =>
        {
          this.id = params.get('id');
        });
  }

  public async onSubmit()
  {
    let num: number;
    num = Number(this.addFeedbackForm.controls.rating.value);
    this.submittedFeedback.rating = num; // convert rating val to num
    this.submittedFeedback.comment = this.addFeedbackForm.controls.comment.value;
    this.submittedFeedback.timestamp = new Date();
    this.submittedFeedback.uid = this.client.uid;
    this.submittedFeedback.name = this.client.firstName + ' ' + this.client.lastName;
    this.submittedFeedback.id = this.firestore.createId();
    this.submittedFeedback.bid = this.id;
    this.submittedFeedback.reply = null;

    (await this.feedback.getBusinessReviews(this.submittedFeedback.bid)).pipe(take(1)).subscribe(
      async (reviewCollection) => {
        this.allRatings = reviewCollection;
        let numberOfRatings = this.allRatings.length; // number of review docs
        for (let i = 0; i < this.allRatings.length; i++)
        {
          this.ratingNum = this.allRatings[i].rating; // store rating value of doc
          this.newSum = (+this.newSum) + (+this.ratingNum); // add each rating to newSum, brackets and + prevents concating
        }
        this.newSum = (+this.newSum) + (+this.submittedFeedback.rating); // add current rating to ratings
        let ratingCount = (+1) + (+numberOfRatings); // adding current rating to number of ratings
        this.total = (this.newSum) / ratingCount; // divide by number of ratings to get average
        this.notif.deleteRNotifications(this.submittedFeedback.bid);
        this.feedback.averageRating(this.total, this.submittedFeedback.bid); // add average rating to bus doc
        this.feedbackService.addReview(this.submittedFeedback, this.id);
        this.changeRoute();
      });
  }


  changeRoute(){
    this.router.navigate(['/business-profile/', this.id]);
  }

}
