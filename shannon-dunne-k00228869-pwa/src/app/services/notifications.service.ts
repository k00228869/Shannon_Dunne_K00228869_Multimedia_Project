import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { IUser } from '../i-user';
import { AngularFireModule } from '@angular/fire';
import {AngularFireMessaging} from '@angular/fire/messaging';
import { tap } from 'rxjs/operators';
// import {firebase} from '@firebase/app';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  token = null;
  public uid: string;
  public userSub: IUser['subscription'];
  private subscrip: IUser['subscription'];

//   notification: {
//     title: 'Appointment Reminder',
//     body: 'You have an appointment tomorrow at 2 pm',
//     icon: 'https://www.pngkit.com/png/detail/220-2207568_notify-clients-purple-notification-bell-png',
//     vibrate: [100, 50, 100],
//     data: {
//         dateOfArrival: Date,
//         primaryKey: 1
//     },
//     actions: [{
//         action: 'explore',
//         title: 'check your appointment details'
//     }]
// }

  constructor(
    private firestore: AngularFirestore,
    private afm: AngularFireMessaging
  ) { }

  requestPermission() {
    return this.afm.requestToken.pipe( // get token
      tap(token => {
        console.log('store token', token);

        let theUser = JSON.parse(localStorage.getItem('user'));
        console.log(theUser.uid);
        console.log('add token to db', token);
        this.uid = theUser.uid;
        this.subscrip = {};
        this.subscrip.token = token;
        this.subscrip.id = this.uid;
        console.log('saved subscription', this.subscrip);
        return from (this.firestore.collection<IUser['user']>('users')
        .doc<IUser['user']>(this.uid)
        .collection<IUser['subscription']>('subscriptions').add(this.subscrip)); // store token + user id
      })
    );
  }
  getMessages()
  {
    return this.afm.messages;
  }

  getToken(): Observable<IUser['subscription']>
  {
    let theUser = JSON.parse(localStorage.getItem('user'));
    this.uid = theUser.uid;
    let docRef;
    docRef = this.firestore.collection<IUser['user']>('users')
    .doc<IUser['user']>(this.uid)
    .collection<IUser['subscription']>('subscriptions');
    return docRef.valueChanges();
  }

  showCustomNotif(){

  }

}


