import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { IUser } from '../interfaces/i-user';

@Injectable({
  providedIn: 'root',
})
export class WorkingDaysService {
  user: IUser['user'];

  constructor(public firestore: AngularFirestore) {}

  // adds a business's working hours doc for each day to the hoursOfWorkingDays collection
  public addMon(
    mon: IUser['scheduleOfDays']['monday'] // add a business details to the db
  ) {
    console.log('addMon called');

    // get user data from local storage
    this.user = JSON.parse(localStorage.getItem('user'));
    // add monday doc to hoursOfWorkingDays collection
    return from(
      this.firestore
        .collection<IUser>('users')
        .doc<IUser['user']>(this.user.uid)
        .collection<IUser['scheduleOfDays']>('hoursOfWorkingDays')
        .doc<IUser['scheduleOfDays']['monday']>('mon')
        .set(Object.assign({}, mon))
    );
  }

  // adds a business's working hours doc for each day to the hoursOfWorkingDays collection
  public addTue(
    tues: IUser['scheduleOfDays']['tuesday'] // add a business details to the db
  ) {
    console.log('addTue called');

    // get user data from local storage
    this.user = JSON.parse(localStorage.getItem('user'));
    // add tuesday doc to hoursOfWorkingDays collection
    return from(
      this.firestore
        .collection<IUser>('users')
        .doc<IUser['user']>(this.user.uid)
        .collection<IUser['scheduleOfDays']>('hoursOfWorkingDays')
        .doc<IUser['scheduleOfDays']['tuesday']>('tue')
        .set(Object.assign({}, tues))
    );
  }

  // adds a business's working hours doc for each day to the hoursOfWorkingDays collection
  public addWed(
    wed: IUser['scheduleOfDays']['wednesday'] // add a business details to the db
  ) {
    console.log('addWed called');

    // get user data from local storage
    this.user = JSON.parse(localStorage.getItem('user'));
    // add wednesday doc to hoursOfWorkingDays collection
    return from(
      this.firestore
        .collection<IUser>('users')
        .doc<IUser['user']>(this.user.uid) // returns promise not observable
        .collection<IUser['scheduleOfDays']>('hoursOfWorkingDays')
        .doc<IUser['scheduleOfDays']['wednesday']>('wed')
        .set(Object.assign({}, wed))
    );
  }

  // adds a business's working hours doc for each day to the hoursOfWorkingDays collection
  public addThur(
    thur: IUser['scheduleOfDays']['thursday'] // add a business details to the db
  ) {
    console.log('addThur called');

    // get user data from local storage
    this.user = JSON.parse(localStorage.getItem('user'));
    // add thursday doc to hoursOfWorkingDays collection
    return from(
      this.firestore
        .collection<IUser>('users')
        .doc<IUser['user']>(this.user.uid) // returns promise not observable
        .collection<IUser['scheduleOfDays']>('hoursOfWorkingDays')
        .doc<IUser['scheduleOfDays']['thursday']>('thur')
        .set(Object.assign({}, thur))
    );
  }

  // adds a business's working hours doc for each day to the hoursOfWorkingDays collection
  public addFri(
    fri: IUser['scheduleOfDays']['friday'] // add a business details to the db
  ) {
    console.log('addFri called');

    // get user data from local storage
    this.user = JSON.parse(localStorage.getItem('user'));
    // add friday doc to hoursOfWorkingDays collection
    return from(
      this.firestore
        .collection<IUser>('users')
        .doc<IUser['user']>(this.user.uid) // returns promise not observable
        .collection<IUser['scheduleOfDays']>('hoursOfWorkingDays')
        .doc<IUser['scheduleOfDays']['friday']>('fri')
        .set(Object.assign({}, fri))
    );
  }

  // adds a business's working hours doc for each day to the hoursOfWorkingDays collection
  public addSat(
    sat: IUser['scheduleOfDays']['saturday'] // add a business details to the db
  ) {
    console.log('addSat called');

    // get user data from local storage
    this.user = JSON.parse(localStorage.getItem('user'));
    // add saturday doc to hoursOfWorkingDays collection
    return from(
      this.firestore
        .collection<IUser>('users')
        .doc<IUser['user']>(this.user.uid) // returns promise not observable
        .collection<IUser['scheduleOfDays']>('hoursOfWorkingDays')
        .doc<IUser['scheduleOfDays']['saturday']>('sat')
        .set(Object.assign({}, sat))
    );
  }

  // adds a business's working hours doc for each day to the hoursOfWorkingDays collection
  public addSun(
    sun: IUser['scheduleOfDays']['sunday'] // add a business details to the db
  ) {
    console.log('addSun called');

    // get user data from local storage
    this.user = JSON.parse(localStorage.getItem('user'));
    // add sunday doc to hoursOfWorkingDays collection
    return from(
      this.firestore
        .collection<IUser>('users')
        .doc<IUser['user']>(this.user.uid) // returns promise not observable
        .collection<IUser['scheduleOfDays']>('hoursOfWorkingDays')
        .doc<IUser['scheduleOfDays']['sunday']>('sun')
        .set(Object.assign({}, sun))
    );
  }

  // get the hoursOfWorkingDays collection with the working hours array for each day
  public getAll(id: string): Observable<IUser['scheduleOfDays'][]> {
    console.log('getAll called');

    let all;
    all = this.firestore
      .collection<IUser>('users')
      .doc<IUser['user']>(id)
      .collection<IUser['scheduleOfDays']>('hoursOfWorkingDays');
    return all.valueChanges();
  }

  // old code to remove

  // // gets a business's working hours for each day
  // public getMon(id: string): Observable<IUser['scheduleOfDays']> {
  //   let monday;
  //   monday = this.firestore
  //     .collection<IUser>('users')
  //     .doc<IUser['user']>(id)
  //     .collection<IUser['scheduleOfDays']>('hoursOfWorkingDays', (ref) =>
  //       ref.where('1', '==', 'monday')
  //     );
  //   return monday.valueChanges();
  // }

  // public getTue(id: string): Observable<IUser['scheduleOfDays']> {
  //   let tuesday;
  //   tuesday = this.firestore
  //     .collection<IUser>('users')
  //     .doc<IUser['user']>(id)
  //     .collection<IUser['scheduleOfDays']>('hoursOfWorkingDays', (ref) =>
  //       ref.where('1', '==', 'tuesday')
  //     );
  //   return tuesday.valueChanges();
  // }

  // public getWed(id: string): Observable<IUser['scheduleOfDays']> {
  //   let wednesday;
  //   wednesday = this.firestore
  //     .collection<IUser>('users')
  //     .doc<IUser['user']>(id)
  //     .collection<IUser['scheduleOfDays']>('hoursOfWorkingDays', (ref) =>
  //       ref.where('1', '==', 'wednesday')
  //     );
  //   return wednesday.valueChanges();
  // }

  // public getThur(id: string): Observable<IUser['scheduleOfDays']> {
  //   let thursday;
  //   thursday = this.firestore
  //     .collection<IUser>('users')
  //     .doc<IUser['user']>(id)
  //     .collection<IUser['scheduleOfDays']>('hoursOfWorkingDays', (ref) =>
  //       ref.where('1', '==', 'thursday')
  //     );
  //   return thursday.valueChanges();
  // }

  // public getFri(id: string): Observable<IUser['scheduleOfDays']> {
  //   let friday;
  //   friday = this.firestore
  //     .collection<IUser>('users')
  //     .doc<IUser['user']>(id)
  //     .collection<IUser['scheduleOfDays']>('hoursOfWorkingDays', (ref) =>
  //       ref.where('1', '==', 'friday')
  //     );
  //   return friday.valueChanges();
  // }

  // public getSat(id: string): Observable<IUser['scheduleOfDays']> {
  //   let saturday;
  //   saturday = this.firestore
  //     .collection<IUser>('users')
  //     .doc<IUser['user']>(id)
  //     .collection<IUser['scheduleOfDays']>('hoursOfWorkingDays', (ref) =>
  //       ref.where('1', '==', 'saturday')
  //     );
  //   return saturday.valueChanges();
  // }

  // public getSun(id: string): Observable<IUser['scheduleOfDays']> {
  //   let sunday;
  //   sunday = this.firestore
  //     .collection<IUser>('users')
  //     .doc<IUser['user']>(id)
  //     .collection<IUser['scheduleOfDays']>('hoursOfWorkingDays', (ref) =>
  //       ref.where('1', '==', 'sunday')
  //     );
  //   return sunday.valueChanges();
  // }
}
