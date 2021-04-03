import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
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
  isSignedIn = false;

  constructor(
    private login: FormBuilder,
    public auth: AuthenticateService
  ) {}

  ngOnInit() {
    this.loginForm = this.login.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6), Validators.maxLength(25)]],
    });
  }

  onSubmit(userSignIn: IUser['user']) {
    if (this.loginForm.status === 'VALID') {
      // if fields are valid
      this.userSignIn = this.loginForm.value; // get email value and set to userSignIn
      this.auth.signin(userSignIn); // pass the values to the signupform
      if (this.auth.isLoggedIn) {
        this.isSignedIn = true; // user is signed in
      }
    }
    else{
      alert('Correct the invalid fields before submitting');
      return;
    }
  }
}
