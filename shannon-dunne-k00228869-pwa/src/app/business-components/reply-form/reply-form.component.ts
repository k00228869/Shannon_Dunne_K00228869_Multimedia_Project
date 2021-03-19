import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IUser } from 'src/app/i-user';
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
  public client: IUser['user'];

  constructor(
    private replyMessage: FormBuilder,
    public clientService: ClientUserService,
    public feedbackService: FeedbackService,
    private route: ActivatedRoute,

  ) { }

  ngOnInit(){
    this.addReplyForm = this.replyMessage.group({
      reply: new FormControl('', Validators.required),
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
    this.submittedReply = this.addReplyForm.value;

    this.feedbackService.addReply(this.submittedReply, this.id);

  }
}
