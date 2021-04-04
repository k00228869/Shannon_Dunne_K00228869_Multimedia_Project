import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IUser } from 'src/app/interfaces/i-user';
import { AuthenticateService } from 'src/app/services/authenticate.service';

@Component({
  selector: 'app-reset-details',
  templateUrl: './reset-details.component.html',
  styleUrls: ['./reset-details.component.css'],
})
export class ResetDetailsComponent implements OnInit {
  userReset: string;
  resetForm: FormGroup;
  client: IUser['user'];
  constructor(private auth: AuthenticateService, private reset: FormBuilder) {}

  ngOnInit() {
    // call func to get user data
    this.auth.getUserInfo().subscribe((data) => {
      this.client = data; // store user data
    });

    // build reset formgroup
    this.resetForm = this.reset.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  // submt form data
  onSubmit() {
    // if form data is valid
    if (this.resetForm.status === 'VALID') {
      // get email value and set to userReset variable
      this.userReset = this.resetForm.controls.email.value;
      this.auth.resetPassword(this.userReset); // call func to reset email in service
    } else {
      // if form data is not valid show alert
      alert('Correct the invalid fields before submitting');
      return;
    }
  }
}
