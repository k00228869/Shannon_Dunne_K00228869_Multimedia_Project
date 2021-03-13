import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { IUser } from '../i-user';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AngularFireModule } from '@angular/fire';
import {firebase} from '@firebase/app';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  public uid: string;
  public userSub: IUser['subscription'];
  private subscrip: IUser['subscription'];

  constructor(
    private firestore: AngularFirestore,
  ) { }

  addPushSubscriber(subOj)
  {
    let theUser = JSON.parse(localStorage.getItem('user'));
    console.log(theUser.uid);
    console.log('add sub obj to db', subOj);
    this.uid = theUser.uid;
    this.subscrip = JSON.parse(JSON.stringify(subOj));
    this.subscrip.userId = this.uid;
    console.log('saved subscription', this.subscrip);
    return from (this.firestore.collection<IUser['user']>('users')
    .doc<IUser['user']>(this.uid)
    .collection<IUser['subscription']>('subscriptions').add(this.subscrip));
  }

  getPushSubcriber(): Observable<IUser['subscription']>
  {
    let theUser = JSON.parse(localStorage.getItem('user'));
    this.uid = theUser.uid;
    let docRef;
    docRef = this.firestore.collection<IUser['user']>('users')
    .doc<IUser['user']>(this.uid)
    .collection<IUser['subscription']>('subscriptions');
    return docRef.valueChanges();
  }

//   const reminderMessage = {}
//    reminderMessage = notification: {
//         title: 'Appointment Reminder',
//         body: 'You have an appointment tomorrow at 2 pm',
//         icon:   'https://www.pngkit.com/png/detail/220-2207568_notify-clients-purple-notification-bell-png',
//         vibrate: [100, 50, 100],
//         data: {
//             dateOfArrival: Date.now(),
//             primaryKey: 1
//         },
//         actions: [{
//             action: 'explore',
//             title: 'check your appointment details'
//         }]
//     }


// webpush.sendNotification(

// )



}


