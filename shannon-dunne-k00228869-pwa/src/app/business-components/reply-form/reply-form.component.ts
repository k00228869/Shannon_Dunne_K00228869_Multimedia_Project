import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IUser } from 'src/app/i-user';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { ClientUserService } from 'src/app/services/client-user.service';
import { FeedbackService } from 'src/app/services/feedback.service';

@Component({
  selector: 'app-reply-form',
  templateUrl: './reply-form.component.html',
  styleUrls: ['./reply-form.component.css']
})
export class ReplyFormComponent implements OnInit {
  addReplyForm: FormGroup;
  submittedReply: IUser['review'];
  public id: string;
  public user: IUser['user'];

  constructor(
    private replyMessage: FormBuilder,
    public clientService: ClientUserService,
    public feedbackService: FeedbackService,
    private route: ActivatedRoute,
    public authService: AuthenticateService,


  ) { }

  ngOnInit(){
    this.addReplyForm = this.replyMessage.group({
      reply: new FormControl('', Validators.required),
    });

    this.clientService.getUserInfo().subscribe(
      (data) =>
      {
        this.user = data;
      });

    this.route.paramMap.subscribe(
      (params) =>
      {
        this.id = params.get('id');
      });
  }


  public onSubmit()
  {
    this.submittedReply = this.addReplyForm.value;
    console.log('reply message', this.submittedReply);
    this.feedbackService.addReply(this.submittedReply, this.id);
        // this.route.navigate(['/business-view/', this.appointmentInfo.bid]);


  }
}
