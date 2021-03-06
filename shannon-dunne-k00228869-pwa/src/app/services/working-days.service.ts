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






  public getMon(id: string): Observable<IUser['scheduleOfDays']['monday']>
  {
    // monday = this.firestore.collection<IUser['scheduleOfDays']>('hoursOfWorkingDays', ref => ref.where('1', '==', 'monday'));
    // return monday.valueChanges();
    let monday;
    monday = this.firestore.collection<IUser>('users').doc<IUser['user']>(id)
    .collection<IUser['scheduleOfDays']['monday']>('hoursOfWorkingDays', ref => ref.where('1', '==', 'monday'));
    return monday.valueChanges();
  }

  public getTue(id: string)
  {
    return this.firestore.doc<IUser>('users/${id}')
    .collection<IUser['scheduleOfDays']['tuesday']>('hoursOfWorkingDays', ref => ref.where('1', '==', 'tuesday'))
    .valueChanges();
  }

  public getWed(id: string)
  {
    return this.firestore.doc<IUser>('users/$id')
    .collection<IUser['scheduleOfDays']['wednesday']>('hoursOfWorkingDays', ref => ref.where('1', '==', 'wednesday'))
    .valueChanges();
  }

  public getThur(id: string)
  {
    return this.firestore.doc<IUser>('users/$id')
    .collection<IUser['scheduleOfDays']['thursday']>('hoursOfWorkingDays', ref => ref.where('1', '==', 'thursday'))
    .valueChanges();
  }

  public getFri(id: string)
  {
    return this.firestore.doc<IUser>('users/$id')
    .collection<IUser['scheduleOfDays']['friday']>('hoursOfWorkingDays', ref => ref.where('1', '==', 'friday'))
    .valueChanges();
  }

  public getSat(id: string)
  {
    return this.firestore.doc<IUser>('users/$id')
    .collection<IUser['scheduleOfDays']['saturday']>('hoursOfWorkingDays', ref => ref.where('1', '==', 'saturday'))
    .valueChanges();
  }

  public getSun(id: string)
  {
    return this.firestore.doc<IUser>('users/$id')
    .collection<IUser['scheduleOfDays']['sunday']>('hoursOfWorkingDays', ref => ref.where('1', '==', 'sunday'))
    .valueChanges();
  }
}
