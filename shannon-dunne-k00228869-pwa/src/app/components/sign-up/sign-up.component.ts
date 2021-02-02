import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { IUser } from 'src/app/i-user';
import firebase from 'firebase/app';
import {auth} from 'firebase/app';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  user: Observable<IUser>;
  signUpForm: FormGroup;

  constructor(
    private signUp: FormBuilder,
    private authorisation: AngularFireAuth
  ) { }

  ngOnInit() {
    this.signUpForm = this.signUp.group({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      phone: new FormControl('', [Validators.minLength(7), Validators.maxLength(10)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.minLength(6), Validators.maxLength(25)]),
    });
  }

  createUser()
  {
    // this.authorisation.
    // console.log(this.signUpForm.value);
  }

}
