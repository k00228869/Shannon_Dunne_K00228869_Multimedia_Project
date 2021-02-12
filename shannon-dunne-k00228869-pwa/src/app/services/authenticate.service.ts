import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { from, Observable } from 'rxjs';
import { IUser } from 'src/app/i-user';
// import { AngularFireAuthGuard } from '@angular/fire/auth-guard';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, fromCollectionRef } from '@angular/fire/firestore';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { DocumentData, DocumentReference } from '@firebase/firestore-types';
import { User} from '@firebase/auth-types';

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {
  uData: IUser['user'];
  userState: Observable<User>;
  user: Observable<User>;
  public uid: string;
  admin: boolean;
  isLoggedIn = false;
  // public user: Observable<firebase.User>;
  // user: Observable<User>;
  // public currentUser: firebase.User = null;
  // httpOptions = {
  //   // specifying content format is json
  //   headers: new HttpHeaders({ 'Content-Type': 'application/json'})
  // };

  constructor(
    // private http: HttpClient,
    public authenticate: AngularFireAuth,
    private router: Router,
    public firestore: AngularFirestore
  ){}



  // USER SIGN IN FUNCTION
  signin(userSignIn: IUser['user'])
  {
    this.authenticate.signInWithEmailAndPassword(userSignIn.email, userSignIn.password)// sign the user in
    .then(Credentials =>
    {
      this.uid = Credentials.user.uid; // set the id of the user equal to the current users id
      localStorage.setItem('user', JSON.stringify(Credentials.user)); // store current user in local storaage
      this.isLoggedIn = true; // set the user to logged in

      this.getUserData(this.uid) // pass the user id to get the users doc
      .subscribe((data) =>   // subscribe to the data return
      {
        this.uData = data; // set data to IUser type
        if (this.uData.admin === true) // check if the user is an admin
        {
          this.router.navigate(['/dashboard/{{uid}}']); // display business dash
        }else
        {
          this.router.navigate(['/client-profile/{{uid}}']); // display client profile
        }
      });
    });
  }


  getUserData(uid: string): Observable<IUser['user']> // gets the user doc with the passed id
  {
    return this.firestore.collection<IUser>('users')
    .doc<IUser['user']>(this.uid).valueChanges(); // returns the users doc to check if admin is true
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




  // public getUserState(): Observable<User>
  // {
  //   let user;
  //   user = JSON.parse(localStorage.getItem('user'));
  //   return user;
  // }
}

// authenticate.sendPasswordResetEmail(email);

