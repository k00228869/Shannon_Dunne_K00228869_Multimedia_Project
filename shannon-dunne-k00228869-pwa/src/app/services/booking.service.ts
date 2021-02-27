import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { from } from 'rxjs';
import { IUser } from '../i-user';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  public uid: string;

  constructor(
    public firestore: AngularFirestore,

  ) { }


  public addClientAppointment(clientAppointment: IUser['appointment'])
  {
    clientAppointment.appointmentId = this.firestore.createId();
    return from (this.firestore.collection<IUser>('users').doc<IUser['user']>(clientAppointment.uid)   // returns promise not observable
    .collection<IUser['appointment']>('appointments').add(clientAppointment)); // add user to the db
  }

  public addBusinessBooking(clientAppointment: IUser['appointment'])
  {

    return from (this.firestore.collection<IUser>('users').doc<IUser['user']>(clientAppointment.bid)   // returns promise not observable
    .collection<IUser['appointment']>('appointments').add(clientAppointment)); // add user to the db
  }
}
