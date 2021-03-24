import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { from } from 'rxjs';
import { IDeals } from '../i-deals';
import { IUser } from '../i-user';

@Injectable({
  providedIn: 'root',
})
export class RescheduleService {
  uid: string;
  cancellation: IUser['cancellation'] = {};
  appointAdvert: IDeals['deal'];
  dealBooking: IUser['appointment'];
  constructor(public firestore: AngularFirestore) {}

  // get a users business details
  // getBusiness(id: string) {
  //   let Business;
  //   Business = this.firestore.collection<IUser>(
  //     'businesses',
  //     (ref) => ref.where('id', '==', id)
  //   );
  //   return Business.valueChanges();
  // }

  // update client appointment with rescheduled appointment info
  public updateClientAppointment(
    appointmentInfo: IUser['appointment'],
    newAppointment: IUser['appointment'] // get single appoinment data for confirmation
  ) {
    return from(
      this.firestore
        .collection<IUser>('users')
        .doc<IUser['user']>(appointmentInfo.uid)
        .collection<IUser['appointment']>('appointments')
        .doc(appointmentInfo.appointmentId)
        .update({
          // appointmentId: newAppointment.appointmentId,
          date: newAppointment.date,
          note: newAppointment.note,
          time: newAppointment.time,
          timeStamp: newAppointment.timeStamp,
        })
    );
  }

  // update business appointment with the resceduled appointment info
  public updateBusAppointment(
    appointmentInfo: IUser['appointment'],
    newAppointment: IUser['appointment'] // get single appoinment data for confirmation
  ) {
    return from(
      this.firestore
        .collection<IUser>('users')
        .doc<IUser['user']>(appointmentInfo.bid)
        .collection<IUser['appointment']>('appointments')
        .doc(appointmentInfo.appointmentId)
        .update({
          // appointmentId: newAppointment.appointmentId,
          date: newAppointment.date,
          note: newAppointment.note,
          time: newAppointment.time,
          timeStamp: newAppointment.timeStamp,
        })
    );
  }

  // update schedule for a booked date
  public editBookingSchedule(
    appointmentInfo: IUser['appointment'],
    newSchedule: IUser['bookingSchedule']
  ) {
    // update date schedule with new available times
    console.log('editBookingSchedule called', appointmentInfo, newSchedule );

    return from(
      this.firestore
        .collection<IUser>('users')
        .doc<IUser['user']>(appointmentInfo.bid)
        .collection<IUser['bookingSchedule']>('schedule')
        .doc<IUser['bookingSchedule']>(appointmentInfo.date)
        .update({
          availableTimes: newSchedule.availableTimes,
        })
    );
  }

  // remove client booking from db
  public cancelClientBooking(id: string, uid: string) {
    return from(
      this.firestore
        .collection<IUser>('users')
        .doc<IUser['user']>(uid)
        .collection<IUser['appointment']>('appointments')
        .doc(id)
        .delete()
    );
  }

  // remove business booking from db
  public cancelBusBooking(id: string, bid: string) {
    console.log('cancelBusBooking called', id, bid );
    return from(
      this.firestore
        .collection<IUser>('users')
        .doc<IUser['user']>(bid)
        .collection<IUser['appointment']>('appointments')
        .doc(id)
        .delete()
    );
  }

  // store the users booked deal
  storeDealAppointment(dealBooking: IUser['appointment']) {
    return from(
      this.firestore
        .collection<IUser>('users')
        .doc<IUser['user']>(dealBooking.uid)
        .collection<IUser['appointment']>('appointments')
        .doc(dealBooking.appointmentId)
        .set(dealBooking)
    );
  }

  // update businesses appointment
  updateDealappointment(appointDeal: IUser['appointment']) {
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

  // delete deal advert
  deleteDealAdvert(id: string) {
    return from(this.firestore.collection<IDeals>('deals').doc<IDeals['deal']>(id).delete());
  }

  // duplicate advertised appointment to root of db so that it can be displayed as a deal
  public moveBusAppointment(
    newAppointInfo: IUser['appointment'],
    businessName: string
  ) {
    this.appointAdvert = newAppointInfo;
    this.appointAdvert.provider = businessName;
    return from(
      this.firestore
        .collection<IDeals>('deals')
        .doc<IDeals['deal']>(this.appointAdvert.appointmentId)
        .set(this.appointAdvert)
    );
  }

  public getDeals() { // get all deal appointments
    let docRef = this.firestore.collection<IDeals['deal']>('deals');
    return docRef.valueChanges();
  }


  // update the businesses appointment doc with the deals info and clear old client details
  public editBusAppointment(newAppointInfo: IUser['appointment']) {
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

  public addToCancelList(
    id: string,
    busId: string // ad appointment id to cancellation list
  ) {
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

  public getCancellationList(
    id: string // get document of cancelled appointment id
  ) {
    let docRef = this.firestore
      .collection<IUser>('users')
      .doc<IUser['user']>(id)
      .collection<IUser['cancellation']>('cancellations');
    return docRef.valueChanges();
  }

  public deleteCancellation(
    id: string,
    bid: string // delete appointment id from business cancellation doc
  ) {
      console.log('deleteCancellation called', id, bid);
      return from(
        this.firestore
        .collection<IUser>('users')
        .doc<IUser['user']>(bid)
        .collection<IUser['cancellation']>('cancellations')
        .doc(id).delete());
  }

  // public createRescheduleNotif()
  // {

  //   const dateA = moment('01-01-2900', 'DD-MM-YYYY');
  //   const dateB = moment('01-01-2000', 'DD-MM-YYYY');
  //   console.log(dateA.from(dateB));

  // }
}
