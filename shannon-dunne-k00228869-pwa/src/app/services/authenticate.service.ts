import { ThrowStmt } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { IUser } from 'src/app/i-user';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';
// import { IUser } from 'src/app/i-user';
@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {
  user: Observable<IUser>;
  isLoggedIn = false;
  constructor(
    public authenticate: AngularFireAuth,
    private router: Router
  ){}

  signin(email, password)
    {
      this.authenticate.signInWithEmailAndPassword(email, password)// sign the user in
    .then(res => {
      this.isLoggedIn = true;
      localStorage.setItem('user', JSON.stringify(res.user)); // store current user
      this.router.navigate(['/home']);
    });
  }

  signup(email, password)
  {
    this.authenticate.createUserWithEmailAndPassword(email, password)// create a user with the details passed
    .then(res => {
      console.log('your are logged in');
      this.isLoggedIn = true; // set the user to logged in
      localStorage.setItem('user', JSON.stringify(res.user)); // store the user
      return this.authenticate.currentUser.then(u => u.sendEmailVerification()) // get email address and send verification email
      .then(() => {
        this.router.navigate(['home']);
      });
    });
  }

  logout()
  {
    this.authenticate.signOut()
    .then(() => {
      localStorage.removeItem('user');
     }).then(() => {
      console.log('you are now logged out');
      this.router.navigate(['login']);
     });
  }


// authenticate.sendPasswordResetEmail(email);
}
