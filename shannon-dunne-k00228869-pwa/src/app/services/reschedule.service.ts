import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { from } from 'rxjs';
import { IUser } from '../i-user';

@Injectable({
  providedIn: 'root'
})
export class RescheduleService {
uid: string;
cancellation: IUser['cancellation'] = {};
  constructor(
    public firestore: AngularFirestore,
  ) { }

// update client appointment with rescheduled appointment info
public updateClientAppointment(appointmentInfo: IUser['appointment'], newAppointment: IUser['appointment']) // get single appoinment data for confirmation
  {
    return from (this.firestore.collection<IUser>('users').doc<IUser['user']>(appointmentInfo.uid)
    .collection<IUser['appointment']>('appointments').doc(appointmentInfo.appointmentId).update(
      {
        // appointmentId: newAppointment.appointmentId,
        date: newAppointment.date,
        note: newAppointment.note,
        time: newAppointment.time,
        timeStamp: newAppointment.timeStamp
      },
    ));
  }


  // update business appointment with the resceduled appointment info
public updateBusAppointment(appointmentInfo: IUser['appointment'], newAppointment: IUser['appointment']) // get single appoinment data for confirmation
  {
    return from (this.firestore.collection<IUser>('users').doc<IUser['user']>(appointmentInfo.bid)
    .collection<IUser['appointment']>('appointments').doc(appointmentInfo.appointmentId).update(
      {
        // appointmentId: newAppointment.appointmentId,
        date: newAppointment.date,
        note: newAppointment.note,
        time: newAppointment.time,
        timeStamp: newAppointment.timeStamp
      },
    ));
  }

// update schedule for a booked date
  public editBookingSchedule(appointmentInfo: IUser['appointment'], newSchedule: IUser['bookingSchedule']) 
  {
    // update date schedule with new available times
     return from (this.firestore.collection<IUser>('users').doc<IUser['user']>(appointmentInfo.bid)
    .collection<IUser['bookingSchedule']>('schedule').doc<IUser['bookingSchedule']>(appointmentInfo.date).update(
      {
        availableTimes: newSchedule.availableTimes
      }
    ));
  }

// remove client booking from db
  public cancelClientBooking(id: string, uid: string)
  {
    return from (this.firestore.collection<IUser>('users').doc<IUser['user']>(uid)
    .collection<IUser['appointment']>('appointments').doc(id).delete());
  }


  // remove business booking from db
  public cancelBusBooking(id: string, bid: string)
  {
    return from (this.firestore.collection<IUser>('users').doc<IUser['user']>(bid)
    .collection<IUser['appointment']>('appointments').doc(id).delete());
  }


  // duplicate advertised appointment to root of db so that it can be displayed as a deal
  public moveBusAppointment(newAppointInfo: IUser['appointment'])
  {
    return from (this.firestore.collection<IUser>('deals').doc<IUser['appointment']>(newAppointInfo.bid)
    .collection<IUser['appointment']>('appointments').doc(newAppointInfo.appointmentId).set(newAppointInfo));
  }


 // update the businesses appointment doc with the deals info and clear old client details
  public editBusAppointment(newAppointInfo: IUser['appointment'])
  {

    return from(this.firestore.collection<IUser>('users').doc<IUser['user']>(newAppointInfo.bid)
    .collection<IUser['appointment']>('appointments').doc(newAppointInfo.appointmentId).update(
      {
        serPrice: newAppointInfo.serPrice,
        clientName: newAppointInfo.clientName,
        note: newAppointInfo.note,
        uid: newAppointInfo.uid,
        timeStamp: newAppointInfo.timeStamp

      },
    ));
  }

  public addToCancelList(id: string, busId: string) // ad appointment id to cancellation list
  {
    this.cancellation.id = id;
    return from(this.firestore.collection<IUser>('users').doc<IUser['user']>(busId)
    .collection<IUser['cancellation']>('cancellations').add(this.cancellation));
  }

  public getCancellationList(id: string) // get document of cancelled appointment id's
  {
    console.log('getting ids funct');
    let docRef = this.firestore.collection<IUser['user']>('users')
    .doc<IUser['user']>(id)
    .collection<IUser['cancellation']>('cancellations');
    return docRef.valueChanges();
  }

  public deleteCancellation(id: string, uid: string) // delete appointment id from cancellation doc
  {
    let cancelledAppointment;
    cancelledAppointment = this.firestore.collection<IUser>('users').doc<IUser['user']>(uid)
    .collection<string>('cancellations', ref => ref.where('id', '==', id));
    cancelledAppointment.get().subscribe(item => item
    .forEach(doc => doc.ref.delete()));
    alert('cancellation erased');
    // return from(cancelledAppointment).delete();
  }



  // public createRescheduleNotif()
  // {

  //   const dateA = moment('01-01-2900', 'DD-MM-YYYY');
  //   const dateB = moment('01-01-2000', 'DD-MM-YYYY');
  //   console.log(dateA.from(dateB));

  // }



}



