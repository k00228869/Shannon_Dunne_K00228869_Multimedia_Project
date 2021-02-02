import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { IUser } from 'src/app/i-user';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  user: Observable<IUser>;
  newUser: FormGroup;

  constructor(
    private signUp: FormBuilder
  ) { }

  ngOnInit() {
    this.newUser = this.signUp.group({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      phone: new FormControl(Validators.minLength(7), Validators.maxLength(10)),
      email: new FormControl(Validators.required, Validators.email),
      password: (Validators.minLength(6), Validators.maxLength(25)),

    })
  }

}
