import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IUser } from 'src/app/interfaces/i-user';
import { AuthenticateService } from 'src/app/services/authenticate.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  userSignIn: IUser['user'];

  constructor(private login: FormBuilder, public auth: AuthenticateService) {}

  ngOnInit() {
    // build login formgroup
    this.loginForm = this.login.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6), Validators.maxLength(25)]],
    });
  }

  // submit form data
  onSubmit(userSignIn: IUser['user']) {
     // if form data is valid
    if (this.loginForm.status === 'VALID') {
      this.userSignIn = this.loginForm.value; // set form data to userSignIn
      this.auth.signin(userSignIn); // pass the values to the signupform in the service
    } else { // if from data is not valid show alert
      alert('Correct the invalid fields before submitting');
      return;
    }
  }
}
