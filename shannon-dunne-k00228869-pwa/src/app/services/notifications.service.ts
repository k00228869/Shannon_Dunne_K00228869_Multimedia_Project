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


  addPushSubscriber(sub)
  {
    let theUser = JSON.parse(localStorage.getItem('user'));
    this.uid = theUser.uid;
    this.subscrip = sub;
    console.log(sub);
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
}
