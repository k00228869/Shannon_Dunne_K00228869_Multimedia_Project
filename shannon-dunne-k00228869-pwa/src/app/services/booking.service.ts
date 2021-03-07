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

  addBookingSchedule(id: string, schedule: IUser['bookingSchedule']) // add a booked date
  {
    // update booked date with new available times
    return from (this.firestore.collection<IUser>('users').doc<IUser['user']>(id)   // returns promise not observable
    .collection<IUser['bookingSchedule']>('schedule').doc<IUser['bookingSchedule']>(schedule.date).set(schedule)); // add user to the db
  }

  public getBookingSchedule(id: string, setDate: string): Observable<IUser['bookingSchedule']> // get a booked date
  {
    let docRef;
    // docRef = this.firestore.collection<IUser>('users').doc<IUser['user']>(id)
    // .collection<IUser['bookingSchedule']>('schedule', ref => ref.where('date', '==', setDate));
    // return docRef.valueChanges();
    docRef = this.firestore.collection<IUser>('users').doc<IUser['user']>(id)
    .collection<IUser['bookingSchedule']>('schedule').doc<IUser['bookingSchedule']>(setDate);
    return docRef.valueChanges();
  }

  public getBookedDays(id: string){
    let docRef;
    docRef = this.firestore.collection<IUser>('users').doc<IUser['user']>(id)
    .collection<IUser['bookingSchedule']>('schedule');
    return docRef.valueChanges();
  }
}
