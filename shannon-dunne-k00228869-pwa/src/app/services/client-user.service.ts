import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { IUser } from '../interfaces/i-user';

@Injectable({
  providedIn: 'root',
})
export class ClientUserService {
  public uid: string;
  showButton = false;
  deferredPrompt: any;


  constructor(public firestore: AngularFirestore) {}

  getUserInfo(): Observable<IUser['user']> { // gets the user doc with the passed id
    let theUser = JSON.parse(localStorage.getItem('user'));
    this.uid = theUser.uid;
    return this.firestore
      .collection<IUser>('users')
      .doc<IUser['user']>(this.uid)
      .valueChanges(); // returns the users doc to check if admin is true
  }

  downloadApp() {
    // when download button is clicked
    // hide download button
    this.showButton = false;
    // Show prompt
    // console.log('theStashed response', this.deferredPrompt);
    this.deferredPrompt.prompt();
    // Wait for user to respond
    this.deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted add prompt');
      } else {
        console.log('User dismissed add prompt');
      }
      this.deferredPrompt = null;
    });
  }
}
