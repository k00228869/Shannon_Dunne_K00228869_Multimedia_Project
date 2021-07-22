import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, from, merge, Observable } from 'rxjs';
import { IUser } from '../interfaces/i-user';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { IBusiness } from '../interfaces/i-business';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  // behaviour subject  for notification new data
  public currentMessage = new BehaviorSubject(null);
  notificationMessage = {};
  token = null;
  public uid: string;
  private subscrip: IUser['subscription'] = {};

  constructor(
    private firestore: AngularFirestore,
    private afm: AngularFireMessaging,
    private toastr: ToastrService
  ) {}

  // this function request a subscription token, stores it in an object
  // and adds the object as a doc in the subscription collection
  requestPermission() {
    // request token
    return this.afm.requestToken.pipe(
      tap((token) => {
          // get the user data from localstorage
          this.subscrip = {};
          if (!token || token === undefined) // if no token or token undefined
          {
            this.subscrip.token = 'token'; // set token to string
          }
          else{
            this.subscrip.token = token; // otherwise set it to the token
          }
          let theUser = JSON.parse(localStorage.getItem('user')); // get user data from localhost
          this.subscrip.id = theUser.uid; // set user id

          if (!token){ // if no token
            this.subscrip.token = 'token'; // set token to string
          }
          return from(
            // store token + user id in subscription collection
            this.firestore
              .collection<IUser>('users')
              .doc<IUser['user']>(this.subscrip.id)
              .collection<IUser>('subscriptions')
              .doc<IUser['subscription']>(this.subscrip.id)
              .set(this.subscrip)
          );
        },
        (err) => {
          // catch subscription error
          console.log('no permission', err);
        }
      )
    );
  }

  // this function request a token, stores it in an object
  // and updates the subscription collection with a new token
  onTokenRefresh() {
    this.afm.requestToken.pipe(
      // get permission
      tap((token) => { // returned token
        this.subscrip = {};
        if (!token || token === undefined)
      {
        this.subscrip.token = 'token';
      }
      else{
        this.subscrip.token = token;
      }
        let theUser = JSON.parse(localStorage.getItem('user'));
        this.subscrip.id = theUser.uid;

        // store subscription object
        return from(
          this.firestore
            .collection<IUser>('users')
            .doc<IUser['user']>(this.subscrip.id)
            .collection<IUser>(this.subscrip.id)
            .doc<IUser['subscription']>(this.subscrip.id)
            .update({ token: this.subscrip.token }) // store token + user id
        );
      })
    );
  }

  // this function handles messages when the application is open,
  // it triggers a toast notification to display the data from the pushed notification
  receiveMessage() {
    return this.afm.onMessage((payload) => {
      // when notification functionality is complete the notification will be saved here
      // this.saveNotification(payload);
      // toastr to display notifcation data
      this.toastr.info(payload.notification.body, payload.notification.title, {
        // display centered at the top of the window
        positionClass: 'toast-top-center',
        timeOut: 6000, // hide after 6 secs
        closeButton: true, // show close button
      });
      this.currentMessage.next(payload); // log ,essage and get next message
    });
  }

  // This get the users token, if they are already subscribed to push notifications
  getToken(id: string): Observable<IUser['subscription']> {
    // retrieve token from db
    let docRef;
    docRef = this.firestore
      .collection<IUser['user']>('users')
      .doc<IUser['user']>(id)
      .collection<IUser>('subscriptions')
      .doc<IUser['subscription']>(id);
    return docRef.valueChanges();
  }

  // This creates the notification for an appointment after the user has made an appointment,
  // the reminder would be triggered using Cloud Functions and the Firebase admin SDK to
  // send an appointment to the user, the reminder would need to be sent to 24 hours prior
  // to the users appointment date.
  appoinmtentReminder(
    clientAppointment: IUser['appointment'],
    profileInfo: IBusiness['business'] // reminder set and store
  ) {
    // TO DO::
    // get the appoint date, calculate time between now and booking time,
    // remove 24hrs from result and set as reminder time
    // set time to send and add to firebase messaging
    this.getToken(clientAppointment.uid).subscribe((data) => {
      // get user token
      this.token = data.token;

      if (!data.token || data.token === undefined)
      {
        this.token = 'token';
      }

      // Customising notification message
      this.notificationMessage = {
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
      // this function stores the review notification message,
      // this code will be moved to saveNotification() so that,
      // when notifications are fully implemented,
      // the data will be saved stored after a message is recieved
      // rather than stored after it was created
      return from(
        this.firestore
          .collection<IUser>('users') // adNotification to notificationlist
          .doc<IUser['user']>(clientAppointment.uid)
          .collection<IUser>('appointment-notification')
          .doc<IUser['notificationMessage']>(clientAppointment.appointmentId)
          .set(this.notificationMessage)
      );
    });
  }
  // this function gets the appointment notifications collection for a user
  getANotifications(): Observable<IUser['notificationMessage'][]> {
    let theUser = JSON.parse(localStorage.getItem('user'));
    return from(
      this.firestore
        .collection<IUser>('users')
        .doc<IUser['user']>(theUser.uid)
        .collection<IUser['notificationMessage']>('appointment-notification')
        .valueChanges()
    );
  }

  // this function deletes the appointment notification
  // it's triggered if the user cancels an appointment
  deleteANotifications(id: string): Observable<void> {
    let theUser = JSON.parse(localStorage.getItem('user'));
    // delete appoinment notifications document by appointment id

    // TO DO::
    // cloud function here to remove notification from FCM    let theUser = JSON.parse(localStorage.getItem('user'));
    return from(
      this.firestore
        .collection<IUser>('users')
        .doc<IUser['user']>(theUser.uid)
        .collection<IUser>('appointment-notification')
        .doc<IUser['notificationMessage']>(id)
        .delete()
    );
  }

  // This creates the notification for a review after the user has made an appointment,
  // the reminder would be triggered using Cloud Functions and the Firebase admin SDK to
  // send an appointment to the user, the reminder would need to be sent to the user
  // 48 hours after the users appointment date.
  reviewReminder(clientAppointment: IUser['appointment'], profileInfo) {
    // TO DO::
    // get the appoint date, calculate time between now and booking time,
    // add 48hrs to result and set as reminder time
    // set time to send and add to firebase messaging
    this.getToken(clientAppointment.uid).subscribe(
      // get user token
      (data) => {
        this.token = data.token;
        if (!data.token || data.token === undefined)
      {
        this.token = 'token';
      }

        // customising the notification data
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

        return from(
          // this function stores the review notification message,
          // this code will be moved to saveNotification when notifications are fully implemented,
          // allowing it to trigger after a message is recieved
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

  // this function gets the review notifications collection for a user
  getRNotifications(): Observable<IUser['notificationMessage'][]> {
    let theUser = JSON.parse(localStorage.getItem('user'));
    return from(
      this.firestore
        .collection<IUser>('users')
        .doc<IUser['user']>(theUser.uid)
        .collection<IUser['notificationMessage']>('review-notification')
        .valueChanges()
    );
  }

  // this function deletes the review notification
  // it's triggered if the user cancels an appointment
  deleteRNotifications(id: string): Observable<void> {
    // delete review notifications document by bus id
    // TO DO::
    // cloud function here to remove notification from FCM
    // get user data ffrom loacal storage
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
