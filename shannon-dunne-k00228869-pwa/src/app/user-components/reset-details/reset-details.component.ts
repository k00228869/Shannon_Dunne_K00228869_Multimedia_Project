import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IUser } from 'src/app/interfaces/i-user';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { ClientUserService } from 'src/app/services/client-user.service';

@Component({
  selector: 'app-reset-details',
  templateUrl: './reset-details.component.html',
  styleUrls: ['./reset-details.component.css'],
})
export class ResetDetailsComponent implements OnInit {
  userReset: string;
  resetForm: FormGroup;
  client: IUser['user'];
  constructor(
    private auth: AuthenticateService,
    private reset: FormBuilder,
    private clientService: ClientUserService
  ) {}

  ngOnInit() {
    this.clientService.getUserInfo().subscribe((data) => {
      this.client = data;
    });

    this.resetForm = this.reset.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    if (this.resetForm.status === 'VALID') {
      // if fields are valid
      this.userReset = this.resetForm.controls.email.value; // get email value and set to userReset
      this.auth.resetPassword(this.userReset);
    }
  }
}
