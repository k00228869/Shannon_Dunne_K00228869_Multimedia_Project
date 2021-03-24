import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, from, merge, Observable } from 'rxjs';
import { IUser } from '../i-user';
import { AngularFireModule } from '@angular/fire';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { mergeMap, tap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { take } from 'rxjs/operators';
import { identifierModuleUrl } from '@angular/compiler';
@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  currentMessage = new BehaviorSubject(null); // observable for new data

  token = null;
  public uid: string;
  public userSub: IUser['subscription'];
  private subscrip: IUser['subscription'] = {};
  private notifObj: IUser['notificationMessage'] = {};

  notificationMessage = {
    //   to: '',
    // notification : {
    //   title: '',
    //   body: '',
    //   icon: '',
    // }
  };

  constructor(
    private firestore: AngularFirestore,
    private afm: AngularFireMessaging,
    private auth: AngularFireAuth,
    private db: AngularFireDatabase
  ) {
  }

  requestPermission() {
    return this.afm.requestToken.pipe(
      // get token when permission allowed
      tap((token) => {
        // console.log('store token', token);
        let theUser = JSON.parse(localStorage.getItem('user'));
        // console.log('uid', theUser.uid);
        this.subscrip.token = token; // set token + user id
        this.subscrip.id = theUser.uid;
        // console.log('saved subscription', this.subscrip);
        return from(
          // store token + user id
          this.firestore
            .collection<IUser>('users')
            .doc<IUser['user']>(theUser.uid)
            .collection<IUser>('subscriptions')
            .doc<IUser['subscription']>(theUser.uid)
            .set(this.subscrip)
        );
      },
      (err) =>
      {
        console.log('no permission', err);
      })
    );
  }
// this.afm.tokenChanges(());


  // removeToken() {
  //   this.afm.getToken // get user token
  //     .pipe(mergeMap((token) => this.afm.deleteToken(token))) // delete token
  //     .subscribe((token) => {
  //       // delete from db func
  //       console.log('token deleted');
  //     });
  // }


onTokenRefresh(){
  this.afm.requestToken.pipe( // get token
    tap(token => {
      let theUser = JSON.parse(localStorage.getItem('user'));
      console.log(theUser.uid);
      console.log('add token to db', token);
      this.subscrip = {};
      this.subscrip.token = token;
      this.subscrip.id = this.uid;
      console.log('saved subscription', this.subscrip);
      return from (this.firestore
      .collection<IUser>('users')
      .doc<IUser['user']>(theUser.uid)
      .collection<IUser>(theUser.uid)
      .doc<IUser['subscription']>(theUser.uid)
      .update({token: this.subscrip.token})); // store token + user id
    })
  );
 
};


receiveMessages() { // when message received, store it in the currentMessage obj
    // handle message when app has browser focus
    return this.afm.onMessage((payload) => {
      console.log('mess payload received', payload);
      // this.saveNotification(payload);
      this.currentMessage.next(payload); // log and get next message
    });
  }

saveNotification(payload) {
    this.notifObj.message.notification.title = payload.notification.title;
    this.notifObj.message.notification.body = payload.notification.body;
    this.notifObj.message.notification.icon = payload.notification.icon;
    // this.notifObj.click_action = payload.notification.click_action;
    // console.log('saved notification', this.notifObj);
    // let theUser = JSON.parse(localStorage.getItem('user'));
    // return from (this.firestore.collection<IUser['user']>('users')
    // .doc<IUser['user']>(theUser.uid)
    // .collection<IUser>('notifications').doc<IUser['notification']>(theUser.uid).set(this.notifObj)); // store token + user id
  }

getToken(id: string): Observable<IUser['subscription']> {
    // retrieve token from db
    let docRef;
    docRef = this.firestore
      .collection<IUser['user']>('users')
      .doc<IUser['user']>(id)
      .collection<IUser>('subscriptions').doc<IUser['subscription']>(id);
    return docRef.valueChanges();
  }

  // call delete notification when user deletes an appoinment
  // call delete notification when user rescedules an appoinment, call add notification when user reschedules an appointment

  // CLOUD FUNCTIONS NEED TO BE IMPLEMENTED HERE TO SEND THE NOTIFICATIONS

appoinmtentReminder(
    clientAppointment: IUser['appointment'],
    profileInfo: IUser['business'] // reminder set and store
  ) {
    // get the appoint date, calculate time between now and booking time,
    // remove 24hrs from result and set as reminder time
    this.getToken(clientAppointment.uid).subscribe((data) => {
      this.token = data.token;
      this.notificationMessage = {
        // set notification message
        infoId: clientAppointment.appointmentId,
        message: {
          token: this.token,
          notification: {
            title: 'Appointment Reminder',
            body: `You have an appointment with ${profileInfo.businessName} on ${clientAppointment.date}
             at ${clientAppointment.time}. Please Note:  ${profileInfo.reminderMessage}`,
            icon:
              'https://firebasestorage.googleapis.com/v0/b/appointment-pwa.appspot.com/o/slideshow%2Ficon-72x72.png?alt=media&token=bad03671-e38c-45bd-b606-64cd198f9792',
          },
        },
      };
      console.log(this.notificationMessage);
      // add message to db, when cloud functions are implemented,
      // then the notification data will be stored after it has been received,
      // rather than stored after it has created

      return from(
        // store appoinment notification
         this.firestore
          .collection<IUser>('users') // adNotification to notificationlist
          .doc<IUser['user']>(clientAppointment.uid)
          .collection<IUser>('appointment-notification')
          .doc<IUser['notificationMessage']>(clientAppointment.date)
          .set(this.notificationMessage)
      );
    });
  }

getANotifications(): Observable<IUser['notificationMessage'][]> {
    // get appoinment notifications collection
    let theUser = JSON.parse(localStorage.getItem('user'));
    return from(
      this.firestore
        .collection<IUser>('users')
        .doc<IUser['user']>(theUser.uid)
        .collection<IUser['notificationMessage']>('appointment-notification')
        .valueChanges()
    );
  }

deleteANotifications(id: string): Observable<void> {
    // delete appoinment notifications document by date
    // cloud function here to remove notification from FCM
    let theUser = JSON.parse(localStorage.getItem('user'));
    return from(
      this.firestore
        .collection<IUser>('users')
        .doc<IUser['user']>(theUser.uid)
        .collection<IUser>('appointment-notification')
        .doc<IUser['notificationMessage']>(id)
        .delete()
    );
  }

reviewReminder(clientAppointment: IUser['appointment'], profileInfo) {
    // TO DO::
    // get the appoint date, calculate time between now and booking time,
    // add 48hrs to result and set as reminder time

    this.getToken(clientAppointment.uid).subscribe(
      // get user token
      (data) => {
        this.token = data.token;

        // set message data
        this.notificationMessage = {
          infoId: clientAppointment.bid,
          message: {
            token: this.token,
            notification: {
              title: 'Review Request',
              body: `We'd love to hear about your last booking experience with ${profileInfo.businessName}`,
              icon:
                'https://firebasestorage.googleapis.com/v0/b/appointment-pwa.appspot.com/o/slideshow%2Ficon-72x72.png?alt=media&token=bad03671-e38c-45bd-b606-64cd198f9792',
            },
          },
        };

        console.log(this.notificationMessage);
        return from(
          // store review notification message
          this.firestore
            .collection<IUser>('users')
            .doc<IUser['user']>(clientAppointment.uid)
            .collection<IUser>('review-notification')
            .doc<IUser['notificationMessage']>(clientAppointment.bid) // pass in business id as doc name
            .set(this.notificationMessage)
        );
      }
    );
  }

getRNotifications(): Observable<IUser['notificationMessage'][]> {
    // get review notifications collection
    let theUser = JSON.parse(localStorage.getItem('user'));
    return from(
      this.firestore
        .collection<IUser>('users')
        .doc<IUser['user']>(theUser.uid)
        .collection<IUser['notificationMessage']>('review-notification')
        .valueChanges()
    );
  }

deleteRNotifications(id: string): Observable<void> {
    // delete review notifications document by bus id
    // cloud function here to remove notification from FCM
    let theUser = JSON.parse(localStorage.getItem('user'));
    return from(
      this.firestore
        .collection<IUser>('users')
        .doc<IUser['user']>(theUser.uid)
        .collection<IUser>('review-notification')
        .doc<IUser['notificationMessage']>(id) // pass in business id as doc name
        .delete()
    );
  }
}