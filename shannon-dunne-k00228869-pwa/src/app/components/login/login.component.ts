import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
loginForm: FormGroup;

  constructor(
    private login: FormBuilder
  ) { }

  ngOnInit() {
    this.loginForm = this.login.group({
      email: (Validators.required, Validators.email),
      password: (Validators.minLength(6), Validators.maxLength(25))
    });
  }



}
