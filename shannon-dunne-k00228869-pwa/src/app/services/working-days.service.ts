import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
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
    .collection<IUser['scheduleOfDays']['tuesday']>('hoursOfWorkingDays').add(Object.assign({}, tues))); // add user to the db
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






  public getMon(id: string): Observable<IUser['scheduleOfDays']['monday']>
  {
    let monday;
    monday = this.firestore.collection<IUser>('users').doc<IUser['user']>(id)
    .collection<IUser['scheduleOfDays']['monday']>('hoursOfWorkingDays', ref => ref.where('1', '==', 'monday'));
    return monday.valueChanges();
  }

  public getTue(id: string)
  {
    let monday;
    monday = this.firestore.collection<IUser>('users').doc<IUser['user']>(id)
    .collection<IUser['scheduleOfDays']['tuesday']>('hoursOfWorkingDays', ref => ref.where('1', '==', 'tuesday'));
    return monday.valueChanges();
  }

  public getWed(id: string)
  {
    let monday;
    monday = this.firestore.collection<IUser>('users').doc<IUser['user']>(id)
    .collection<IUser['scheduleOfDays']['wednesday']>('hoursOfWorkingDays', ref => ref.where('1', '==', 'wednesday'));
    return monday.valueChanges();
  }

  public getThur(id: string)
  {
    let monday;
    monday = this.firestore.collection<IUser>('users').doc<IUser['user']>(id)
    .collection<IUser['scheduleOfDays']['thursday']>('hoursOfWorkingDays', ref => ref.where('1', '==', 'thursday'));
    return monday.valueChanges();
  }

  public getFri(id: string)
  {
    let monday;
    monday = this.firestore.collection<IUser>('users').doc<IUser['user']>(id)
    .collection<IUser['scheduleOfDays']['friday']>('hoursOfWorkingDays', ref => ref.where('1', '==', 'friday'));
    return monday.valueChanges();
  }

  public getSat(id: string)
  {
    let monday;
    monday = this.firestore.collection<IUser>('users').doc<IUser['user']>(id)
    .collection<IUser['scheduleOfDays']['saturday']>('hoursOfWorkingDays', ref => ref.where('1', '==', 'saturday'));
    return monday.valueChanges();
  }

  public getSun(id: string)
  {
    let monday;
    monday = this.firestore.collection<IUser>('users').doc<IUser['user']>(id)
    .collection<IUser['scheduleOfDays']['sunday']>('hoursOfWorkingDays', ref => ref.where('1', '==', 'sunday'));
    return monday.valueChanges();
  }
}
