import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { IUser } from '../i-user';

@Injectable({
  providedIn: 'root',
})
export class WorkingDaysService {
  uid: string;

  constructor(public firestore: AngularFirestore) {}

  // adds a business's working hours for each day
  public addMon(
    mon: IUser['scheduleOfDays']['monday'] // add a business details to the db
  ) {
    let theUser = JSON.parse(localStorage.getItem('user'));
    this.uid = theUser.uid;
    return from(
      this.firestore
        .collection<IUser>('users')
        .doc<IUser['user']>(this.uid)
        .collection<IUser['scheduleOfDays']>('hoursOfWorkingDays')
        .doc<IUser['scheduleOfDays']['monday']>('mon')
        .set(Object.assign({}, mon))
    ); // add user to the db
  }

  public addTue(
    tues: IUser['scheduleOfDays']['tuesday'] // add a business details to the db
  ) {
    let theUser = JSON.parse(localStorage.getItem('user'));
    this.uid = theUser.uid;
    return from(
      this.firestore
        .collection<IUser>('users')
        .doc<IUser['user']>(this.uid)
        .collection<IUser['scheduleOfDays']>('hoursOfWorkingDays')
        .doc<IUser['scheduleOfDays']['tuesday']>('tue')
        .set(Object.assign({}, tues))
    ); // add user to the db
  }
  public addWed(
    wed: IUser['scheduleOfDays']['wednesday'] // add a business details to the db
  ) {
    let theUser = JSON.parse(localStorage.getItem('user'));
    this.uid = theUser.uid;
    return from(
      this.firestore
        .collection<IUser>('users')
        .doc<IUser['user']>(this.uid) // returns promise not observable
        .collection<IUser['scheduleOfDays']>('hoursOfWorkingDays')
        .doc<IUser['scheduleOfDays']['wednesday']>('wed')
        .set(Object.assign({}, wed))
    ); // add user to the db
  }
  public addThur(
    thur: IUser['scheduleOfDays']['thursday'] // add a business details to the db
  ) {
    let theUser = JSON.parse(localStorage.getItem('user'));
    this.uid = theUser.uid;
    return from(
      this.firestore
        .collection<IUser>('users')
        .doc<IUser['user']>(this.uid) // returns promise not observable
        .collection<IUser['scheduleOfDays']>('hoursOfWorkingDays')
        .doc<IUser['scheduleOfDays']['thursday']>('thur')
        .set(Object.assign({}, thur))
    ); // add user to the db
  }
  public addFri(
    fri: IUser['scheduleOfDays']['friday'] // add a business details to the db
  ) {
    let theUser = JSON.parse(localStorage.getItem('user'));
    this.uid = theUser.uid;
    return from(
      this.firestore
        .collection<IUser>('users')
        .doc<IUser['user']>(this.uid) // returns promise not observable
        .collection<IUser['scheduleOfDays']>('hoursOfWorkingDays')
        .doc<IUser['scheduleOfDays']['friday']>('fri')
        .set(Object.assign({}, fri))
    ); // add user to the db
  }
  public addSat(
    sat: IUser['scheduleOfDays']['saturday'] // add a business details to the db
  ) {
    let theUser = JSON.parse(localStorage.getItem('user'));
    this.uid = theUser.uid;
    return from(
      this.firestore
        .collection<IUser>('users')
        .doc<IUser['user']>(this.uid) // returns promise not observable
        .collection<IUser['scheduleOfDays']>('hoursOfWorkingDays')
        .doc<IUser['scheduleOfDays']['saturday']>('sat')
        .set(Object.assign({}, sat))
    ); // add user to the db
  }
  public addSun(
    sun: IUser['scheduleOfDays']['sunday'] // add a business details to the db
  ) {
    let theUser = JSON.parse(localStorage.getItem('user'));
    this.uid = theUser.uid;
    return from(
      this.firestore
        .collection<IUser>('users')
        .doc<IUser['user']>(this.uid) // returns promise not observable
        .collection<IUser['scheduleOfDays']>('hoursOfWorkingDays')
        .doc<IUser['scheduleOfDays']['sunday']>('sun')
        .set(Object.assign({}, sun))
    ); // add user to the db
  }

  // gets a business's working hours for each day
  public getMon(id: string): Observable<IUser['scheduleOfDays']> {
    let monday;
    monday = this.firestore
      .collection<IUser>('users')
      .doc<IUser['user']>(id)
      .collection<IUser['scheduleOfDays']>('hoursOfWorkingDays', (ref) =>
        ref.where('1', '==', 'monday')
      );
    return monday.valueChanges();
  }

  public getTue(id: string): Observable<IUser['scheduleOfDays']> {
    let tuesday;
    tuesday = this.firestore
      .collection<IUser>('users')
      .doc<IUser['user']>(id)
      .collection<IUser['scheduleOfDays']>('hoursOfWorkingDays', (ref) =>
        ref.where('1', '==', 'tuesday')
      );
    return tuesday.valueChanges();
  }

  public getWed(id: string): Observable<IUser['scheduleOfDays']> {
    let wednesday;
    wednesday = this.firestore
      .collection<IUser>('users')
      .doc<IUser['user']>(id)
      .collection<IUser['scheduleOfDays']>('hoursOfWorkingDays', (ref) =>
        ref.where('1', '==', 'wednesday')
      );
    return wednesday.valueChanges();
  }

  public getThur(id: string): Observable<IUser['scheduleOfDays']> {
    let thursday;
    thursday = this.firestore
      .collection<IUser>('users')
      .doc<IUser['user']>(id)
      .collection<IUser['scheduleOfDays']>('hoursOfWorkingDays', (ref) =>
        ref.where('1', '==', 'thursday')
      );
    return thursday.valueChanges();
  }

  public getFri(id: string): Observable<IUser['scheduleOfDays']> {
    let friday;
    friday = this.firestore
      .collection<IUser>('users')
      .doc<IUser['user']>(id)
      .collection<IUser['scheduleOfDays']>('hoursOfWorkingDays', (ref) =>
        ref.where('1', '==', 'friday')
      );
    return friday.valueChanges();
  }

  public getSat(id: string): Observable<IUser['scheduleOfDays']> {
    let saturday;
    saturday = this.firestore
      .collection<IUser>('users')
      .doc<IUser['user']>(id)
      .collection<IUser['scheduleOfDays']>('hoursOfWorkingDays', (ref) =>
        ref.where('1', '==', 'saturday')
      );
    return saturday.valueChanges();
  }

  public getSun(id: string): Observable<IUser['scheduleOfDays']> {
    let sunday;
    sunday = this.firestore
      .collection<IUser>('users')
      .doc<IUser['user']>(id)
      .collection<IUser['scheduleOfDays']>('hoursOfWorkingDays', (ref) =>
        ref.where('1', '==', 'sunday')
      );
    return sunday.valueChanges();
  }

  public getAll(id: string): Observable<IUser['scheduleOfDays'][]> {
    let all;
    all = this.firestore
      .collection<IUser>('users')
      .doc<IUser['user']>(id)
      .collection<IUser['scheduleOfDays']>('hoursOfWorkingDays'); // get selected day
    return all.valueChanges();
  }
}
