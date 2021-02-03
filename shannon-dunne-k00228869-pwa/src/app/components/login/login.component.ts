import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { IUser } from 'src/app/i-user';
import { AuthenticateService } from 'src/app/services/authenticate.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
loginForm: FormGroup;
userSignIn: IUser['user'];
isSignedIn = false;

  constructor(
    private login: FormBuilder,
    public athenticationService: AuthenticateService
  ){}

  ngOnInit() {
    this.loginForm = this.login.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6), Validators.maxLength(25)]]
    });

    if (localStorage.getItem('user') !== null) { // if there is a user in the local data storage,
      this.isSignedIn = true;
      } // this user is signed in
      else {
      this.isSignedIn = false;
      } // if there is not a user stored, then user is logged out
  }

   onSubmit(userSignIn: IUser['user'])
{
    if (this.loginForm.status === 'VALID') // if fields are valid
    {
      this.userSignIn = this.loginForm.value; // get email value and set to userSignIn
      this.athenticationService.signin(userSignIn.email, userSignIn.password); // pass the values to the signupform
      console.log(userSignIn.password);
      if (this.athenticationService.isLoggedIn)
      {
        this.isSignedIn = true; // user is signed in
        // this.router.navigate(['/home']);
      }
    }
  }



}
