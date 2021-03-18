import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IUser } from 'src/app/i-user';
import { ClientUserService } from 'src/app/services/client-user.service';
import { FeedbackService } from 'src/app/services/feedback.service';

@Component({
  selector: 'app-feedback-form',
  templateUrl: './feedback-form.component.html',
  styleUrls: ['./feedback-form.component.css']
})
export class FeedbackFormComponent implements OnInit {
  selectedRating: number;
  addFeedbackForm: FormGroup;
  submittedFeedback: IUser['review'];
  public client: IUser['user'];
  public id: string;
  constructor(
    private addFeedback: FormBuilder,
    public clientService: ClientUserService,
    private firestore: AngularFirestore,
    public feedbackService: FeedbackService,
    private route: ActivatedRoute,

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
    console.log('review', this.submittedFeedback);
    this.feedbackService.addReview(this.submittedFeedback, this.id);
  }

}
