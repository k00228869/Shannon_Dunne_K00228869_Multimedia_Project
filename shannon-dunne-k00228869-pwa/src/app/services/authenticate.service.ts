import { ThrowStmt } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { from, Observable } from 'rxjs';
import { IUser } from 'src/app/i-user';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';
import { AngularFirestore, fromCollectionRef } from '@angular/fire/firestore';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// import { IUser } from 'src/app/i-user';
@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {
  user: Observable<IUser>;
  uData: IUser['user'];
  theUser: any;
  uid: string;
  admin: boolean;
  isLoggedIn = false;
  role: boolean;

  httpOptions = {
    // specifying content format is json
    headers: new HttpHeaders({ 'Content-Type': 'application/json'})
  };

  constructor(
    // private http: HttpClient,
    public authenticate: AngularFireAuth,
    private router: Router,
    public firestore: AngularFirestore
  ){
    // this.authenticate.authState.subscribe(user => user.uid){
    //   this.uid = user.uid;
    // }
  }


  // USER SIGN IN FUNCTION
  signin(userSignIn: IUser['user'])
  {
      this.authenticate.signInWithEmailAndPassword(userSignIn.email, userSignIn.password)// sign the user in
      .then(res => {
      this.uid = res.user.uid; // set the id of the user equal to the current users id
      localStorage.setItem('user', JSON.stringify(res.user)); // store current user
      this.isLoggedIn = true; // set the user to logged in
      this.getUserData(this.uid)
      .subscribe((data) =>   // subscribe to the data
        {
          this.uData = data; // set data to IUser type
          if (this.uData.admin === true) // check if the user is an admin
          {
            this.router.navigate(['/dashboard/{{uid}}']); // display business dash
          }
          else
          {
            this.router.navigate(['/client-profile/{{uid}}']); // display client profile
          }
        });
   });
  }





  getUserData(uid: string): Observable<IUser['user']>
  {
    return this.firestore.collection<IUser>('users').doc<IUser['user']>(this.uid).valueChanges(); // get the current users data
  }

// USER SIGN UP
signup(newUser: IUser['user'])
{
    this.authenticate.createUserWithEmailAndPassword(newUser.email, newUser.password)// create a user with the details passed

    .then((credentials) => {
      newUser.uid = credentials.user.uid;
      this.firestore.collection<IUser>('users').doc<IUser['user']>(newUser.uid).set(newUser); // add user to the db
      localStorage.setItem('user', JSON.stringify(credentials.user)); // store the user
      this.isLoggedIn = true; // set the user to logged in
      return this.authenticate.currentUser.then(user => user.sendEmailVerification())
      // get email address of signed in user, send verification mail
      .then(() => {
        this.checkUser(newUser);
      });
    });
  }

  // CHECK WHETHER THE USER IS A BUSINESS USER AND DISPLAY APPRORIATE PAGE
checkUser(newUser: IUser['user'])
{
    if (newUser.admin === true)
    {
      this.router.navigate(['/dashboard/{{uid}}']);
    }
    else if (newUser.admin === false)
    {
      this.router.navigate(['/client-profile/{{uid}}']);
    }
  }


  // USER SIGN OUT
  logout()
  {
    this.authenticate.signOut()
    .then(() => {
      localStorage.removeItem('user');
      this.isLoggedIn = false; // set the user to logged in
     }).then(() => {
      this.router.navigate(['login']);
     });
  }

  public addBusiness(newProfile: IUser['business'])
  {
    this.authenticate.authState
    .subscribe(user => user.uid);
    return from (this.firestore.collection<IUser>('users').doc<IUser['user']>(this.uid)
    .collection<IUser['business']>('business').add(newProfile)); // add user to the db
  }
    // return from (this.firestore.collection<IUser['user']>('users').doc(newProfile.id).set(newProfile)); // add user to the db
  

  // public getBusiness(id: string): Observable<IUser['business']>
  // {
  //   return this.firestore.collection<IUser['business']>('users').doc(newProfile.id).set(newProfile); // add user to the db
  // }


}

// authenticate.sendPasswordResetEmail(email);

