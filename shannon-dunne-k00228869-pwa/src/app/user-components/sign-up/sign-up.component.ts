import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { IUser } from 'src/app/interfaces/i-user';
import { AuthenticateService } from 'src/app/services/authenticate.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnInit {
  newUser: IUser['user'];
  signUpForm: FormGroup;
  isSignedIn = false;

  constructor(
    private signUp: FormBuilder,
    private auth: AuthenticateService
  ) {}

  ngOnInit() {
    this.signUpForm = this.signUp.group({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      phone: new FormControl('', [
        Validators.minLength(7),
        Validators.maxLength(10),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.minLength(6),
        Validators.maxLength(25),
      ]),
      admin: new FormControl([Validators.required]),
    });

    if (localStorage.getItem('user') !== null) {
      // check if user is not empty
      this.isSignedIn = true; // if user is not empty they are signed in
    } else {
      this.isSignedIn = false; // if user is  empty they are signed out
    }
  }

  onSubmit(newUser: IUser['user']) {
    if (this.signUpForm.status === 'VALID') {
      // if fields are valid
      this.newUser = this.signUpForm.value; // set the value of the form equal to object of type userInterface
      this.auth.signup(newUser); // pass the values to the signUp function in the service
      if (this.auth.isLoggedIn) {
        // if the boolean in the service is true
        console.log('you are signed in');
        this.isSignedIn = true; // set boolean to true as user is signed in
      }
    }
    else{
      alert('Correct the invalid fields before submitting');
      return;
    }
  }
}
