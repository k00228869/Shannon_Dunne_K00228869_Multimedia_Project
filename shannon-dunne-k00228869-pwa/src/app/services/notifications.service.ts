import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {BehaviorSubject, from, merge, Observable } from 'rxjs';
import { IUser } from '../i-user';
import { AngularFireModule } from '@angular/fire';
import {AngularFireMessaging} from '@angular/fire/messaging';
import { mergeMap, tap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { take } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  currentMessage = new BehaviorSubject(null); // observable for new data
  token = null;
  public uid: string;
  public userSub: IUser['subscription'];
  private subscrip: IUser['subscription'];

//   notification = {
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
    private afm: AngularFireMessaging,
    private auth: AngularFireAuth,
    private db: AngularFireDatabase,
  ) { }


  requestPermission() { //request permis + store token
    return this.afm.requestToken.pipe( // get token
      tap(token => {
        console.log('store token', token);

        let theUser = JSON.parse(localStorage.getItem('user'));
        console.log('uid', theUser.uid);
        console.log('add token to db', token);
        // this.uid = theUser.uid;
        this.subscrip = {};
        this.subscrip.token = token;
        this.subscrip.id = theUser.uid;
        console.log('saved subscription', this.subscrip);
        return from (this.firestore.collection<IUser['user']>('users')
        .doc<IUser['user']>(theUser.uid)
        .collection<IUser['subscription']>('subscriptions').add(this.subscrip)); // store token + user id
      })
    );
  }


  removeToken()
  {
    this.afm.getToken // get user token
    .pipe(mergeMap(token => this.afm.deleteToken(token))) // delete token
    .subscribe(
      (token) => {
        // delete from db func
        console.log('token deleted');
      });
  }

  listenForMessages() // listen for foreground messages
  {
    // return this.afm.messages;
    this.afm.messages.subscribe(
      (message) => {
        console.log('listen func', message);
      });
  }


  receiveMessages() // handle message when app has browser focus
  {
    this.afm.onMessage((payload) => { // return message
      console.log('mess received', payload);
      this.currentMessage.next(payload); //get meesage
    });
  }



  getToken(): Observable<IUser['subscription']> // retrieve token from db
  {
    let theUser = JSON.parse(localStorage.getItem('user'));
    this.uid = theUser.uid;
    let docRef;
    docRef = this.firestore.collection<IUser['user']>('users')
    .doc<IUser['user']>(this.uid)
    .collection<IUser['subscription']>('subscriptions');
    return docRef.valueChanges();
  }

// updateToken(token) //2nd method of updating token
// {
//   this.auth.authState.pipe(take(1)).subscribe(user => { // subscribe to authstate
//       if (!user){
//         return;
//       }
//       const data = { [user.uid]: token } // save uid as key, token as value
//       this.db.object('fcmTokens/').update(data); // the collection
//     });
// }
}


