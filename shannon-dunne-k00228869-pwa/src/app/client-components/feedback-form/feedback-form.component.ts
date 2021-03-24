import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IUser } from 'src/app/i-user';
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
  submittedFeedback: IUser['review'];
  allRatings: IUser['review'][];
  public client: IUser['user'];
  public id: string;
  constructor(
    private addFeedback: FormBuilder,
    public clientService: ClientUserService,
    private firestore: AngularFirestore,
    public feedbackService: FeedbackService,
    private route: ActivatedRoute,
    private router: Router,
    private notif: NotificationsService,
    private feedback: FeedbackService
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

  public onSubmit()
  {
    this.submittedFeedback = this.addFeedbackForm.value;
    this.submittedFeedback.timestamp = new Date();
    this.submittedFeedback.uid = this.client.uid;
    this.submittedFeedback.name = this.client.firstName + ' ' + this.client.lastName;
    this.submittedFeedback.id = this.firestore.createId();
    this.submittedFeedback.bid = this.id;
    this.submittedFeedback.reply = null;
    console.log('review', this.submittedFeedback);

    this.feedback.getBusinessReviews(this.submittedFeedback.bid).subscribe(
      (reviewCollection) => {
        this.allRatings = reviewCollection;
        let numberOfRatings = this.allRatings.length;
        let sum;

        for (let i = 0; i <= this.allRatings.length; i++)
        {
          sum = sum + this.allRatings[i].rating; // add ratings
        }
        sum = sum / numberOfRatings; // divide by number of ratings to get average
        sum = sum.toString(); // convert to string
        console.log(sum);
        this.feedback.averageRating(sum, this.submittedFeedback.bid); // add average rating to bus doc

      }
    )
    this.feedbackService.addReview(this.submittedFeedback, this.id);
    this.notif.deleteRNotifications(this.submittedFeedback.bid);
    this.changeRoute();
  }


  changeRoute(){
    this.router.navigate(['/business-profile/', this.id]);
  }

}
