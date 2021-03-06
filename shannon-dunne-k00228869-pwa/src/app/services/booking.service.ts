import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
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

  public getServiceDuration(id: string, clientAppointment: IUser['appointment']): Observable<IUser['service']>
  {
    let serId = clientAppointment.serviceId;
    console.log('id', serId);
    // let theSer = await this.firestore.doc<IUser>('users/${id}')
    // .collection<IUser['service']>('services', ref => ref.where('id', '==', serId));
    // return theSer.valueChanges();
    let docRef;
    docRef = this.firestore.collection('users').doc<IUser['user']>(id)
    .collection<IUser['service']>('services', ref => ref.where('id', '==', serId));
    return docRef.valueChanges();
  }

  addBookingSchedule(id: string, schedule: IUser['bookingSchedule'])
  {
    return from (this.firestore.collection<IUser>('users').doc<IUser['user']>(id)   // returns promise not observable
    .collection<IUser['bookingSchedule']>('schedule').add(schedule)); // add user to the db
  }

  getBookingSchedule(id: string, selectedDate)
  {
    return this.firestore.doc<IUser>('users/${id}')
    .collection<IUser['bookingSchedule']>('schedule', ref => ref.where('date', '==', selectedDate)).valueChanges();
  }
}
