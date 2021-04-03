import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { from, Observable } from 'rxjs';
import { IUser } from 'src/app/interfaces/i-user';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '@firebase/auth-types';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthenticateService {
  // uData: IUser['user'];
  // theUser: IUser['user'];
  // userState: any;
  // user: Observable<User>;
  // private uid: string;
  admin: boolean;
  isLoggedIn: boolean;
  constructor(
    public firestore: AngularFirestore,
    public authenticate: AngularFireAuth,
    private router: Router,
    private location: Location,
    private route: ActivatedRoute
  ) {
    // this.authenticate.authState.subscribe((user) => {
    //   // check for user logged in
    //   if (user) {
    //     // if there is a user
    //     this.userState = user; // store the user
    //     localStorage.setItem('user', JSON.stringify(this.userState)); // set the user in local storage
    //   }
    // });
  }

  // USER SIGN IN FUNCTION
  signin(userSignIn: IUser['user']) {
    this.authenticate
      .signInWithEmailAndPassword(userSignIn.email, userSignIn.password) // sign the user in
      .then(async (Credentials) => {
        window.localStorage.setItem('user', JSON.stringify(Credentials.user)); // store current user in local storage
        let user = JSON.parse(localStorage.getItem('user')); // get user from ls
        // this.uid = Credentials.user.uid; // set the id of the user equal to the current users id
        this.isLoggedIn = true; // set the user to logged in
        // pass the user id to get the users doc
        (await this.getUserData(user.uid)).subscribe(
          (
            data // subscribe to the user data returned
          ) => {
            // this.uData = data; // set data to IUser type
            if (data.admin === true) {
              // check if the user is an admin
              this.router.navigate(['/dashboard/', user.uid]); // display business dash
            } else if (data.admin === false) {
              this.router.navigate(['/client-profile/', user.uid]); // display client profile
            }
          }
        );
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
    this.authenticate.signOut()
      .then(() => {
        window.localStorage.removeItem('user');
        // window.localStorage.clear();
        // window.localStorage.setItem('user', null); // set user to null
        this.isLoggedIn = false; // set the user to logged out
      })
      .then(() => {
        this.router.navigate(['login']);
      });
  }

  // async getUserId(): Promise<Observable<IUser['user']>> {
  //   let user = JSON.parse(localStorage.getItem('user'));
  //   let docRef = await this.firestore
  //     .collection<IUser>('users')
  //     .doc<IUser['user']>(user.uid)
  //     .valueChanges();
  //   return docRef;
  // }

  cancel() {
    this.location.back();
  }
}
