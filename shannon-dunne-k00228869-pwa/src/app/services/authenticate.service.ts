import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { IUser } from 'src/app/interfaces/i-user';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '@firebase/auth-types';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AuthenticateService {
  uid: string;
  curUser: User;
  admin: boolean;
  public isLoggedIn: boolean;
  constructor(
    public firestore: AngularFirestore,
    public authenticate: AngularFireAuth,
    private router: Router,
    public toastr: ToastrService,
    private location: Location,
  ) {}

  // clear the local storage
  clearStorage() {
    window.localStorage.clear();
  }

  // USER SIGN IN FUNCTION

  signin(userSignIn: IUser['user']) {
    // sign the user in with form data
    this.authenticate
      .signInWithEmailAndPassword(userSignIn.email, userSignIn.password)
      .then(async (Credentials) => {
        // firebase user returned
        this.curUser = Credentials.user; // save user
        // set user data in local storage
        window.localStorage.setItem('user', JSON.stringify(this.curUser));
        // pass the user id to get the users doc
        (await this.getUserData(this.curUser.uid)).subscribe(
          // subscribe to the user data returned
          (data) => {
            // if the logged in user is an admin
            if (data.admin === true) {
              // display business dash
              this.router.navigate(['/dashboard/', this.curUser.uid]);
              // set the user to logged in
              return (this.isLoggedIn = true);
            } // if the logged in user is not a client
            else if (data.admin === false) {
              // display client profile
              this.router.navigate(['/client-profile/', this.curUser.uid]);
              // set the user to logged in
              return (this.isLoggedIn = true);
            }
          }
        );
      })
      .catch(
        (
          err // catch sign in errors
        ) => {
          // display error message as toastr
          this.toastr.info(err.message, 'SignIn Error', {
            positionClass: 'toast-bottom',
            timeOut: 5000,
            closeButton: true,
          });
        }
      );
  }

  // get the user doc that matched the id passed in
  getUserInfo(): Observable<IUser['user']> {
    // get the user data from localstorage
    let theUser = JSON.parse(localStorage.getItem('user'));
    this.uid = theUser.uid; // set the user id
    return this.firestore
      .collection<IUser>('users')
      .doc<IUser['user']>(this.uid)
      .valueChanges(); // returns the user doc
  }

  getUserData(uid: string): Observable<IUser['user']> {
    // get the user document from db with correcsponding uid
    return this.firestore
      .collection<IUser>('users')
      .doc<IUser['user']>(uid)
      .valueChanges();
  }

  // USER SIGN UP
  signup(newUser: IUser['user']) {
    // create a user and log them in using the email and password
    this.authenticate
      .createUserWithEmailAndPassword(newUser.email, newUser.password)
      .then((credentials) => {
        newUser.uid = credentials.user.uid; // store the user id
        // store the users data in db
        this.firestore
          .collection<IUser>('users')
          .doc<IUser['user']>(newUser.uid)
          .set(newUser); // add user to the db

        // store the users data in localstorage
        window.localStorage.setItem('user', JSON.stringify(credentials.user));
        // set the user to logged in
        this.isLoggedIn = true;

        // call func to send the user a verification email
        return (
          this.authenticate.currentUser
            .then((user) => user.sendEmailVerification())
            // get email address of signed in user, send verification mail
            .then(() => {
              this.checkUser(newUser); // call func to check if the user is a business user
            })
        );
      });
  }

  // CHECK WHETHER THE USER IS A BUSINESS USER AND DISPLAY APPRORIATE PAGE
  async checkUser(newUser: IUser['user']) {
    if (newUser.admin === true) {
      // if they are a business user
      // display the bus dashboard
      await this.router.navigate(['/dashboard/', newUser.uid]);
    } else if (newUser.admin === false) {
      // if they are a client user
      // display the client profile
      await this.router.navigate(['/client-profile/', newUser.uid]);
    }
  }

  // function to reset user password
  resetPassword(email: string) {
    this.authenticate.sendPasswordResetEmail(email);
    alert('A link to reset your details, has been sent to your email address');
  }

  // USER SIGN OUT
  logout() {
    // remove the user fro  localstorage
    window.localStorage.removeItem('user');
    // clear localstorage
    this.clearStorage();
    // use firebase auth to sign the user out
    this.authenticate
      .signOut()
      .then(() => {
        // set the user data to null
        this.curUser = null;
        // set user to not logged in
        this.isLoggedIn = false;
        // display the login page
        this.router.navigate(['login']);
      })
      .catch((error) => {
        // catch logout errors
        console.log(error);
      });
  }

  cancel() {
    // redirect to last url in location history
    this.location.back();
  }
}
