import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-reply-form',
  templateUrl: './reply-form.component.html',
  styleUrls: ['./reply-form.component.css'],
})
export class ReplyFormComponent implements OnInit {
  addReplyForm: FormGroup;
  submittedReply: IUser['review'];
  public id: string;
  public user: IUser['user'];

  constructor(
    private replyMessage: FormBuilder,
    public feedbackService: FeedbackService,
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthenticateService
  ) {}

  ngOnInit() {
    // build review formgroup
    this.addReplyForm = this.replyMessage.group({
      reply: new FormControl('', Validators.required),
    });

    // cal + subscribe to func to get user data
    this.authService
      .getUserInfo()
      .pipe(take(1))
      .subscribe((data) => {
        this.user = data; // store user data
      });

    // get route id
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id'); // store route id
    });
  }

  // submit form data
  public onSubmit() {
    // if form data is valid
    if (this.addReplyForm.status === 'VALID') {
      this.submittedReply = this.addReplyForm.value; // store form data
      this.feedbackService.addReply(this.submittedReply, this.id); // call func to add reply to review
      this.changeRoute(); // call func to change route
    } else {
      alert('Correct the invalid fields before submitting');
      return;
    }
  }

  changeRoute() {
    // change route
    this.router.navigate(['/business-view/', this.user.uid]);
  }
}
