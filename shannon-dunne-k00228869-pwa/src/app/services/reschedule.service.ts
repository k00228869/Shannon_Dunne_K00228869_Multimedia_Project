import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { notEqual } from 'assert';
import { timeStamp } from 'console';
import { from } from 'rxjs';
import { IUser } from '../i-user';

@Injectable({
  providedIn: 'root'
})
export class RescheduleService {
uid: string;
  constructor(
    public firestore: AngularFirestore,
  ) { }





// update client appointment
public updateClientAppointment(appointmentInfo: IUser['appointment'], newAppointment: IUser['appointment']) // get single appoinment data for confirmation
  {
    let docRef;
    docRef = this.firestore.collection<IUser>('users').doc<IUser['user']>(appointmentInfo.uid)
    .collection<IUser['appointment']>('appointments', ref => ref.where('appointmentId', '==', appointmentInfo.appointmentId));
    return from (docRef.set(
      {
        appointmentId: newAppointment.appointmentId,
        date: newAppointment.date,
        note: newAppointment.time,
        time: newAppointment.time,
        timeStamp: newAppointment.timeStamp
      }
    ));
  }


  // update business appointment
  public updateBusAppointment(appointmentInfo: IUser['appointment'], newAppointment: IUser['appointment']) // get single appoinment data for confirmation
  {
    let docRef;
    docRef = this.firestore.collection<IUser>('users').doc<IUser['user']>(appointmentInfo.bid)
    .collection<IUser['appointment']>('appointments', ref => ref.where('appointmentId', '==', appointmentInfo.appointmentId));
    return from (docRef.set(
      {
        // appointmentId: newAppointment.appointmentId,
        date: newAppointment.date,
        note: newAppointment.time,
        time: newAppointment.time,
        timeStamp: newAppointment.timeStamp
      }
    ));
  }


  // add rescheduled hour back to business schedule
  public editBookingSchedule(appointmentInfo: IUser['appointment'], newSchedule: IUser['bookingSchedule']) // add a booked date
{
    // update booked date with new available times
     return from (this.firestore.collection<IUser>('users').doc<IUser['user']>(appointmentInfo.bid)   // returns promise not observable
    .collection<IUser['bookingSchedule']>('schedule').doc<IUser['bookingSchedule']>(appointmentInfo.date).update(
      {
        availableTimes: newSchedule.availableTimes
      }
    ));
  }


}



