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
  radioButton: string;

  constructor(private signUp: FormBuilder, public auth: AuthenticateService) {}

  ngOnInit() {
    // build signup formgroup with validators
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
  }

  // submit form data
  onSubmit(newUser: IUser['user']) {
    // if form date is valid
    if (this.signUpForm.status === 'VALID') {
      // set the value of the form equal to the object
      this.newUser = this.signUpForm.value;
      // pass the values to the signUp function in the service
      this.auth.signup(newUser);
    } else {
      // if form data is not valid show alert
      alert('Correct the invalid fields before submitting');
      return;
    }
  }
}
