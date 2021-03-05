import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { from } from 'rxjs';
import { IUser } from '../i-user';

@Injectable({
  providedIn: 'root'
})
export class WorkingDaysService {
  uid: string;

  constructor(
    public firestore: AngularFirestore,

  ) { }

  public addMon(  mon: IUser['scheduleOfDays']['monday']) // add a business details to the db
  {
    let theUser = JSON.parse(localStorage.getItem('user'));
    this.uid = theUser.uid;
    return from (this.firestore.collection<IUser>('users').doc<IUser['user']>(this.uid)   // returns promise not observable
    .collection<IUser['scheduleOfDays']['monday']>('hoursOfWorkingDays').add(Object.assign({}, mon))); // add user to the db
  }


  public addTue(  tues: IUser['scheduleOfDays']['tuesday']  ) // add a business details to the db
  {
    let theUser = JSON.parse(localStorage.getItem('user'));
    this.uid = theUser.uid;
    return from (this.firestore.collection<IUser>('users').doc<IUser['user']>(this.uid)   // returns promise not observable
    .collection<IUser['scheduleOfDays']['tuesday']>('hoursOfWorkingDays').add(Object.assign({},tues))); // add user to the db
  }
  public addWed(wed: IUser['scheduleOfDays']['wednesday']) // add a business details to the db
  {
    let theUser = JSON.parse(localStorage.getItem('user'));
    this.uid = theUser.uid;
    return from (this.firestore.collection<IUser>('users').doc<IUser['user']>(this.uid)   // returns promise not observable
    .collection<IUser['scheduleOfDays']['wednesday']>('hoursOfWorkingDays').add(Object.assign({},wed))); // add user to the db
  }
  public addThur(thur: IUser['scheduleOfDays']['thursday']) // add a business details to the db
  {
    let theUser = JSON.parse(localStorage.getItem('user'));
    this.uid = theUser.uid;
    return from (this.firestore.collection<IUser>('users').doc<IUser['user']>(this.uid)   // returns promise not observable
    .collection<IUser['scheduleOfDays']['thursday']>('hoursOfWorkingDays').add(Object.assign({},thur))); // add user to the db
  }
  public addFri(fri: IUser['scheduleOfDays']['friday']) // add a business details to the db
  {
    let theUser = JSON.parse(localStorage.getItem('user'));
    this.uid = theUser.uid;
    return from (this.firestore.collection<IUser>('users').doc<IUser['user']>(this.uid)   // returns promise not observable
    .collection<IUser['scheduleOfDays']['friday']>('hoursOfWorkingDays').add(Object.assign({},fri))); // add user to the db
  }
  public addSat(sat: IUser['scheduleOfDays']['saturday']) // add a business details to the db
  {
    let theUser = JSON.parse(localStorage.getItem('user'));
    this.uid = theUser.uid;
    return from (this.firestore.collection<IUser>('users').doc<IUser['user']>(this.uid)   // returns promise not observable
    .collection<IUser['scheduleOfDays']['saturday']>('hoursOfWorkingDays').add(Object.assign({},sat))); // add user to the db
  }
  public addSun(sun: IUser['scheduleOfDays']['sunday']) // add a business details to the db
  {
    let theUser = JSON.parse(localStorage.getItem('user'));
    this.uid = theUser.uid;
    return from (this.firestore.collection<IUser>('users').doc<IUser['user']>(this.uid)   // returns promise not observable
    .collection<IUser['scheduleOfDays']['sunday']>('hoursOfWorkingDays').add(Object.assign({},sun))); // add user to the db
  }
}
