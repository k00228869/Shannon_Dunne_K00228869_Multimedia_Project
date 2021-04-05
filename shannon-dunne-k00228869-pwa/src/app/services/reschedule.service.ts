import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { from } from 'rxjs';
import { IDeals } from '../interfaces/i-deals';
import { IUser } from '../interfaces/i-user';

@Injectable({
  providedIn: 'root',
})
export class RescheduleService {
  cancellation: IUser['cancellation'] = {};
  appointAdvert: IDeals['deal'];

  constructor(public firestore: AngularFirestore) {}

  // update client appointment doc with rescheduled appointment info
  public updateClientAppointment(
    appointmentInfo: IUser['appointment'],
    newAppointment: IUser['appointment']
  ) {
    console.log('updateClientAppointment called');

    return from(
      this.firestore
        .collection<IUser>('users')
        .doc<IUser['user']>(appointmentInfo.uid)
        .collection<IUser['appointment']>('appointments')
        .doc(appointmentInfo.appointmentId)
        .update({
          // data to update
          date: newAppointment.date,
          note: newAppointment.note,
          time: newAppointment.time,
          timeStamp: newAppointment.timeStamp,
        })
    );
  }

  // update business appointment doc with the resceduled appointment info
  public updateBusAppointment(
    appointmentInfo: IUser['appointment'],
    newAppointment: IUser['appointment']
  ) {
    console.log('updateBusAppointment called');

    return from(
      this.firestore
        .collection<IUser>('users')
        .doc<IUser['user']>(appointmentInfo.bid)
        .collection<IUser['appointment']>('appointments')
        .doc(appointmentInfo.appointmentId)
        .update({
          // data to update
          date: newAppointment.date,
          note: newAppointment.note,
          time: newAppointment.time,
          timeStamp: newAppointment.timeStamp,
        })
    );
  }

  // update schedule doc with new available times for a booked date
  public editBookingSchedule(
    appointmentInfo: IUser['appointment'],
    newSchedule: IUser['bookingSchedule']
  ) {
    console.log('editBookingSchedule called');

    return from(
      this.firestore
        .collection<IUser>('users')
        .doc<IUser['user']>(appointmentInfo.bid)
        .collection<IUser['bookingSchedule']>('schedule')
        .doc<IUser['bookingSchedule']>(appointmentInfo.date)
        .update({
          // update the available times array
          availableTimes: newSchedule.availableTimes,
        })
    );
  }

  // updates a businesses schedule doc for a rescheduled/cancelled date
  public editSchedule(
    appointmentInfo: IUser['appointment'],
    newSchedule: IUser['bookingSchedule']
  ) {
    console.log('editSchedule called');

    let docRef = this.firestore
      .collection<IUser>('users')
      .doc<IUser['user']>(appointmentInfo.bid)
      .collection<IUser['bookingSchedule']>('schedule')
      .doc<IUser['bookingSchedule']>(appointmentInfo.date);
    return from(docRef.set(newSchedule));
  }

  // removes a clients appointment doc from their appointments collection
  public cancelClientBooking(id: string, uid: string) {
    console.log('cancelClientBooking called');

    return from(
      this.firestore
        .collection<IUser>('users')
        .doc<IUser['user']>(uid)
        .collection<IUser['appointment']>('appointments')
        .doc(id)
        .delete()
    );
  }

  // remove a business appointment doc from their appointments collection
  public cancelBusBooking(id: string, bid: string) {
    console.log('cancelBusBooking called');

    return from(
      this.firestore
        .collection<IUser>('users')
        .doc<IUser['user']>(bid)
        .collection<IUser['appointment']>('appointments')
        .doc(id)
        .delete()
    );
  }

  // store a users appointment deal doc in their appointments collection
  storeDealAppointment(dealBooking: IUser['appointment']) {
    console.log('storeDealAppointment called');

    return from(
      this.firestore
        .collection<IUser>('users')
        .doc<IUser['user']>(dealBooking.uid)
        .collection<IUser['appointment']>('appointments')
        .doc(dealBooking.appointmentId)
        .set(dealBooking)
    );
  }

  // updates a businesses appointment doc with the booked deal's data
  updateDealappointment(appointDeal: IUser['appointment']) {
    console.log('updateDealappointment called');

    return from(
      this.firestore
        .collection<IUser>('users')
        .doc<IUser['user']>(appointDeal.bid)
        .collection<IUser['appointment']>('appointments')
        .doc(appointDeal.appointmentId)
        .update({
          timeStamp: appointDeal.timeStamp,
          uid: appointDeal.uid,
          clientName: appointDeal.clientName,
        })
    );
  }

  // deletes a  deal advert from the deals collection
  deleteDealAdvert(id: string) {
    console.log('deleteDealAdvert called');

    return from(
      this.firestore
        .collection<IDeals>('deals')
        .doc<IDeals['deal']>(id)
        .delete()
    );
  }

  // adds advertised appointment data to deals collection
  public moveBusAppointment(
    newAppointInfo: IUser['appointment'],
    businessName: string
  ) {
    console.log('moveBusAppointment called');

    this.appointAdvert = newAppointInfo;
    this.appointAdvert.provider = businessName;
    return from(
      this.firestore
        .collection<IDeals>('deals')
        .doc<IDeals['deal']>(this.appointAdvert.appointmentId)
        .set(this.appointAdvert)
    );
  }

  // gets the deals collection from db
  public getDeals() {
    console.log('getDeals called');

    let docRef = this.firestore.collection<IDeals['deal']>('deals');
    return docRef.valueChanges();
  }

  // updates the business's appointment doc with the deals info and clears old client details
  public editBusAppointment(newAppointInfo: IUser['appointment']) {
    console.log('editBusAppointment called');

    return from(
      this.firestore
        .collection<IUser>('users')
        .doc<IUser['user']>(newAppointInfo.bid)
        .collection<IUser['appointment']>('appointments')
        .doc(newAppointInfo.appointmentId)
        .update({
          serPrice: newAppointInfo.serPrice,
          clientName: newAppointInfo.clientName,
          note: newAppointInfo.note,
          uid: newAppointInfo.uid,
          timeStamp: newAppointInfo.timeStamp,
        })
    );
  }

  // adds the id of a cancelled appointment to a business's cancellation list
  public addToCancelList(id: string, busId: string) {
    console.log('addToCancelList called');

    this.cancellation.id = id;
    return from(
      this.firestore
        .collection<IUser>('users')
        .doc<IUser['user']>(busId)
        .collection<IUser['cancellation']>('cancellations')
        .doc(this.cancellation.id)
        .set(this.cancellation)
    );
  }

  // gets a businesses cancellation collection
  public getCancellationList(id: string) {
    console.log('getCancellationList called');

    let docRef = this.firestore
      .collection<IUser>('users')
      .doc<IUser['user']>(id)
      .collection<IUser['cancellation']>('cancellations');
    return docRef.valueChanges();
  }

  // deletes an appointment id from a businesses cancellation collection
  public deleteCancellation(id: string, bid: string) {
    console.log('deleteCancellation called');

    return from(
      this.firestore
        .collection<IUser>('users')
        .doc<IUser['user']>(bid)
        .collection<IUser['cancellation']>('cancellations')
        .doc(id)
        .delete()
    );
  }
}
