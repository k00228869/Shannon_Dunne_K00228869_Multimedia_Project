import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import moment, { Moment } from 'moment';
import { from, Observable } from 'rxjs';
import { IUser } from '../i-user';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  public uid: string;

  constructor(public firestore: AngularFirestore) {}

  public async addClientAppointment(clientAppointment: IUser['appointment']) {
    return await from(
      this.firestore
        .collection<IUser>('users')
        .doc<IUser['user']>(clientAppointment.uid) // returns promise not observable
        .collection<IUser['appointment']>('appointments')
        .doc(clientAppointment.appointmentId)
        .set(clientAppointment)
    ); // add user to the db
  }

  public async addBusinessBooking(clientAppointment: IUser['appointment']) {
    return await from(
      this.firestore
        .collection<IUser>('users')
        .doc<IUser['user']>(clientAppointment.bid) // returns promise not observable
        .collection<IUser['appointment']>('appointments')
        .doc(clientAppointment.appointmentId)
        .set(clientAppointment)
    ); // add user booking to the db
  }

  public getServiceDuration(
    id: string,
    clientAppointment: IUser['appointment']
  ): Observable<IUser['service']> {
    const serId = clientAppointment.serviceId;
    console.log('id', serId);
    let docRef;
    docRef = this.firestore
      .collection('users')
      .doc<IUser['user']>(id)
      .collection<IUser['service']>('services', (ref) =>
        ref.where('id', '==', serId)
      );
    return docRef.valueChanges();
  }

  public getEmployeeName(
    id: string,
    clientAppointment: IUser['appointment']
  ): Observable<IUser['employee']> {
    let empId = clientAppointment.employeeId;
    let docRef;
    docRef = this.firestore
      .collection('users')
      .doc<IUser['user']>(id)
      .collection<IUser['employee']>('employees', (ref) =>
        ref.where('id', '==', empId)
      );
    return docRef.valueChanges();
  }

  public async addBookingSchedule(
    id: string,
    schedule: IUser['bookingSchedule'] // add a booked date
  ) {
    // update booked date with new available times
    return await from(
      this.firestore
        .collection<IUser>('users')
        .doc<IUser['user']>(id) // returns promise not observable
        .collection<IUser['bookingSchedule']>('schedule')
        .doc<IUser['bookingSchedule']>(schedule.date)
        .set(schedule)
    ); // add user to the db
  }

  public getBookingSchedule(
    id: string,
    setDate: string
  ): Observable<IUser['bookingSchedule']> { // get a booked date
    let docRef;
    docRef = this.firestore
      .collection<IUser>('users')
      .doc<IUser['user']>(id)
      .collection<IUser['bookingSchedule']>('schedule')
      .doc<IUser['bookingSchedule']>(setDate);
    return docRef.valueChanges();
  }

  public getBookedDays(id: string) { // return businesses schedule doc with appointment id
    let docRef;
    docRef = this.firestore
      .collection<IUser>('users')
      .doc<IUser['user']>(id)
      .collection<IUser['bookingSchedule']>('schedule');
    return docRef.valueChanges();
  }

  public getAppointment(// get the appoinment document with the matching appointment id
    id: string
  ) {
    let theUser = JSON.parse(localStorage.getItem('user'));
    this.uid = theUser.uid;
    let docRef;
    docRef = this.firestore
      .collection<IUser>('users')
      .doc<IUser['user']>(this.uid)
      .collection<IUser['appointment']>('appointments', (ref) =>
        ref.where('appointmentId', '==', id)
      );
    return docRef.valueChanges();
  }

  public getBusinessAppointment() { // get all of business' appointments
    let theUser = JSON.parse(localStorage.getItem('user'));
    let docRef;
    docRef = this.firestore
      .collection<IUser>('users')
      .doc<IUser['user']>(theUser.uid)
      .collection<IUser['appointment']>('appointments');
    return docRef.valueChanges();
  }

  // public getABooking() // get a single appointment
  // {
  //   let theUser = JSON.parse(localStorage.getItem('user'));
  //   this.uid = theUser.uid;
  //   let docRef;
  //   docRef = this.firestore.collection<IUser>('users').doc<IUser['user']>(this.uid)
  //   .collection<IUser['appointment']>('appointments');
  //   return docRef.valueChanges();
  // }


  public createRescheduleNotif(dateA: Moment, dateB: Moment)
  {

    // const dateA = moment(timestamp, 'DD-MM-YYYY');
    // const dateB = moment(bookingDate, 'DD-MM-YYYY');
    console.log(dateB.from(dateA));
    console.log(dateB.diff(dateA, 'hours'));
    console.log(dateB.diff(dateA, 'days'));
  }

}

