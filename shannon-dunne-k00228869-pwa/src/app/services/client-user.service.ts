import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { IUser } from '../i-user';

@Injectable({
  providedIn: 'root'
})
export class ClientUserService {
  public uid: string;

  constructor(
    public firestore: AngularFirestore
  ) { }


  getUserInfo(): Observable<IUser['user']> // gets the user doc with the passed id
  {
    let theUser = JSON.parse(localStorage.getItem('user'));
    this.uid = theUser.uid;
    return this.firestore.collection<IUser>('users')
    .doc<IUser['user']>(this.uid).valueChanges(); // returns the users doc to check if admin is true
  }
}
