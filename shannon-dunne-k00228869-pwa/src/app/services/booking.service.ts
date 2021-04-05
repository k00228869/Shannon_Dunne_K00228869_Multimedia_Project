import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { IUser } from '../interfaces/i-user';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  public uid: string;

  constructor(public firestore: AngularFirestore) {}

  // add appointment data as doc in a user's appointments collection
  public async addClientAppointment(clientAppointment: IUser['appointment']) {
    return await from(
      this.firestore
        .collection<IUser>('users')
        .doc<IUser['user']>(clientAppointment.uid)
        .collection<IUser['appointment']>('appointments')
        .doc(clientAppointment.appointmentId)
        .set(clientAppointment)
    );
  }

    // add appointment data as doc in a business's appointments collection
  public async addBusinessBooking(clientAppointment: IUser['appointment']) {
    return await from(
      this.firestore
        .collection<IUser>('users')
        .doc<IUser['user']>(clientAppointment.bid) // returns promise not observable
        .collection<IUser['appointment']>('appointments')
        .doc(clientAppointment.appointmentId)
        .set(clientAppointment)
    );
  }

  // get a business's service doc with the matching id
  public getServiceDuration(
    id: string,
    clientAppointment: IUser['appointment']
  ): Observable<IUser['service']> {
    const serId = clientAppointment.serviceId;
    let docRef;
    docRef = this.firestore
      .collection('users')
      .doc<IUser['user']>(id)
      .collection<IUser['service']>('services', (ref) =>
        ref.where('id', '==', serId)
      );
    return docRef.valueChanges(); // return appointment doc
  }

  // get a business's employee doc with the matching id
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
    return docRef.valueChanges(); // return employee doc
  }

  // add a booked date doc to the business's schedule collection
  public async addBookingSchedule(
    id: string,
    schedule: IUser['bookingSchedule']
  ) {
    return await from(
      this.firestore
        .collection<IUser>('users')
        .doc<IUser['user']>(id)
        .collection<IUser['bookingSchedule']>('schedule')
        .doc<IUser['bookingSchedule']>(schedule.date)
        .set(schedule)
    );
  }

 // get a booked date doc that has the passed in date as a its doc id
  public getBookingSchedule(
    id: string,
    setDate: string
  ): Observable<IUser['bookingSchedule']> {
    console.log('getBookingSchedule called');

    let docRef;
    docRef = this.firestore
      .collection<IUser>('users')
      .doc<IUser['user']>(id)
      .collection<IUser['bookingSchedule']>('schedule')
      .doc<IUser['bookingSchedule']>(setDate);
    return docRef.valueChanges();
  }

  // get the business's booked date collection
  public getBookedDays(id: string): Observable<IUser['bookingSchedule'][]> {
    console.log('getBookedDays called');

    let docRef;
    docRef = this.firestore
      .collection<IUser>('users')
      .doc<IUser['user']>(id)
      .collection<IUser['bookingSchedule']>('schedule');
    return docRef.valueChanges(); // return all booked days
  }

  // get the appoinment document with the matching appointment id
  public getAppointment(
    id: string
  ): Observable<IUser['appointment']> {
    console.log('getAppointment called');

    let theUser = JSON.parse(localStorage.getItem('user'));
    this.uid = theUser.uid;
    let docRef;
    docRef = this.firestore
      .collection<IUser>('users')
      .doc<IUser['user']>(this.uid)
      .collection<IUser['appointment']>('appointments', (ref) =>
        ref.where('appointmentId', '==', id)
      );
    return docRef.valueChanges(); // return the appointment doc
  }

    // get all of business' appointments
    public getBusinessAppointment(): Observable<IUser['appointment'][]> {
      console.log('getBusinessAppointmentcalled');

      let theUser = JSON.parse(localStorage.getItem('user'));
      let docRef;
      docRef = this.firestore
      .collection<IUser>('users')
      .doc<IUser['user']>(theUser.uid)
      .collection<IUser['appointment']>('appointments');
      return docRef.valueChanges(); // return the appointments
  }
}
