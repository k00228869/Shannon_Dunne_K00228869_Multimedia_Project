import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { from, Observable } from 'rxjs';
import { IUser } from 'src/app/interfaces/i-user';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '@firebase/auth-types';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AuthenticateService {
  // uData: IUser['user'];
  // theUser: IUser['user'];
  // userState: any;
  curUser: User;
  // private uid: string;
  admin: boolean;
  public isLoggedIn: boolean;
  constructor(
    public firestore: AngularFirestore,
    public authenticate: AngularFireAuth,
    private router: Router,
    public toastr: ToastrService,
    private location: Location,
    private route: ActivatedRoute
  ) {
  }
clearStorage(){
  window.localStorage.clear();
}

  // USER SIGN IN FUNCTION
  signin(userSignIn: IUser['user']) {
    this.authenticate.signInWithEmailAndPassword(userSignIn.email, userSignIn.password) // sign the user in with form data
      .then(async (Credentials) => {
        this.curUser = Credentials.user; // save user
        window.localStorage.setItem('user', JSON.stringify(this.curUser)); // set auth data in local storage
        // pass the user id to get the users doc
        (await this.getUserData(this.curUser.uid)).subscribe(
          (
            data // subscribe to the user data returned
          ) => {
            if (data.admin === true) {
              // check if the user is an admin
              this.router.navigate(['/dashboard/', this.curUser.uid]); // display business dash
              return this.isLoggedIn = true; // set the user to logged in
            } else if (data.admin === false) {
              this.router.navigate(['/client-profile/', this.curUser.uid]); // display client profile
              return this.isLoggedIn = true; // set the user to logged in
            }
          }
        );
      })
      .catch(err =>
        {
          this.toastr.info(err.message, 'SignIn Error', {
            positionClass: 'toast-bottom',
            timeOut: 5000,
            closeButton: true,
          });
        });
  }

  getUserData(uid: string): Observable<IUser['user']> {
    // gets the user doc with the passed id
    return this.firestore
      .collection<IUser>('users')
      .doc<IUser['user']>(uid)
      .valueChanges(); // returns the users doc to check if admin is true
  }

  // USER SIGN UP
  signup(newUser: IUser['user']) {
    this.authenticate
      .createUserWithEmailAndPassword(newUser.email, newUser.password) // create a user with the details passed
      .then((credentials) => {
        newUser.uid = credentials.user.uid;
        newUser.password = '';
        this.firestore
          .collection<IUser>('users')
          .doc<IUser['user']>(newUser.uid)
          .set(newUser); // add user to the db
        window.localStorage.setItem('user', JSON.stringify(credentials.user)); // store the user
        this.isLoggedIn = true; // set the user to logged in
        return (
          this.authenticate.currentUser
            .then((user) => user.sendEmailVerification())
            // get email address of signed in user, send verification mail
            .then(() => {
              this.checkUser(newUser);
            })
        );
      });
  }

  // CHECK WHETHER THE USER IS A BUSINESS USER AND DISPLAY APPRORIATE PAGE
  async checkUser(newUser: IUser['user']) {
    if (newUser.admin === true) {
      await this.router.navigate(['/dashboard/', newUser.uid]);
    } else if (newUser.admin === false) {
      await this.router.navigate(['/client-profile/', newUser.uid]);
    }
  }

  resetPassword(email: string) {
    this.authenticate.sendPasswordResetEmail(email);
    alert('A link to reset your details, has been sent to your email address');
  }

  // USER SIGN OUT
  logout() {
    window.localStorage.removeItem('user');
    this.clearStorage();
    this.authenticate.signOut().then(() =>
    {
      this.curUser = null;
      this.isLoggedIn = false;
      this.router.navigate(['login']);
    })
    .catch(error => {
      console.log(error);
    });
  }

  cancel() {
    this.location.back();
  }
}
