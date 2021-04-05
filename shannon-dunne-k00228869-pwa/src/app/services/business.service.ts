import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable, of } from 'rxjs';
import { IUser } from 'src/app/interfaces/i-user';
import { IDays } from '../interfaces/idays';
import { IBusiness } from '../interfaces/i-business';

@Injectable({
  providedIn: 'root',
})
export class BusinessService {
  public uid: string;
  public id: string;

  constructor(public firestore: AngularFirestore) {}

  // add the business selected start end time data to collection
  public addHours(
    selectedHours // add a business hoirs to the db
  ) {
    console.log('addHours called');

    let theUser = JSON.parse(localStorage.getItem('user'));
    this.uid = theUser.uid;
    return from(
      this.firestore
        .collection<IUser>('users')
        .doc<IUser['user']>(this.uid)
        .collection<IUser>('hours')
        .doc<IUser['hours']>('theHours')
        .set(Object.assign({}, selectedHours))
    );
  }

  // get the times template from db
  public getHoursList(): Observable<IDays['1']> {
    console.log('getHoursList called');

    // get the hours template
    return this.firestore
      .collection<IDays>('days')
      .doc<IDays['1']>('monday')
      .valueChanges();
  }

  // adds the business's profile details to the db
  public addBusiness(newProfile) {
    console.log('addBusiness called');

    let theUser = JSON.parse(localStorage.getItem('user'));
    newProfile.id = theUser.uid;
    return from(
      this.firestore
        .collection<IBusiness>('businesses')
        .doc<IBusiness['business']>(newProfile.id)
        .set(newProfile)
    );
  }

  // add a business service doc to their services collection
  public addServices(adService: IUser['service']) {
    console.log('addServices called');

    let theUser = JSON.parse(localStorage.getItem('user'));
    this.uid = theUser.uid;
    return from(
      this.firestore
        .collection('users')
        .doc<IUser['user']>(this.uid)
        .collection<IUser>('services')
        .doc<IUser['service']>(adService.id)
        .set(adService)
    );
  }

  // add business user's images doc to images collection
  public addImages(images) {
    console.log('addImages called');
    let theUser = JSON.parse(localStorage.getItem('user'));
    this.uid = theUser.uid;
    return from(
      this.firestore
        .collection('users')
        .doc<IUser['user']>(this.uid)
        .collection<IUser>('images')
        .doc<IUser['slides']>('images')
        .set(Object.assign({}, images))
    );
  }

  // add business user's employee doc to employees collection
  public addEmployees(adEmployee: IUser['employee']) {
    console.log('addEmployees called');
    // get the user data from localstorage
    let theUser = JSON.parse(localStorage.getItem('user'));
    this.uid = theUser.uid; // store the user id
    return from(
      this.firestore
        .collection('users')
        .doc<IUser['user']>(this.uid)
        .collection<IUser>('employees')
        .doc<IUser['employee']>(adEmployee.id)
        .set(adEmployee)
    );
  }

  // get the business profile doc from the businesses collection
  public getBusiness(): Observable<IBusiness['business']> {
    console.log('getBusiness called');

    // get business user's business info
    let theUser = JSON.parse(localStorage.getItem('user'));
    this.id = theUser.uid;
    let docRef = this.firestore
      .collection<IBusiness>('businesses')
      .doc<IBusiness['business']>(this.id);
    return docRef.valueChanges();
  }

  // get the business's hours collection
  public getBusinessHours(): Observable<any> {
    console.log('getBusinessHours called');
    // get the business users data from local storage
    let theUser = JSON.parse(localStorage.getItem('user'));
    this.uid = theUser.uid; // set the user id
    let docRef = this.firestore
      .collection<IUser>('users')
      .doc<IUser['user']>(this.uid)
      .collection<IUser>('hours');
    return docRef.valueChanges(); // returns the hours collection
  }

  // get the business user's employees collection
  // this is returned once the promise resolves
  public async getEmployees(): Promise<Observable<IUser['employee']>> {
    console.log('getEmployees called');
    // get the users data from localstorage
    let theUser = JSON.parse(localStorage.getItem('user'));
    this.uid = theUser.uid; // store the user id
    let docRef;
    docRef = await this.firestore
      .collection('users')
      .doc<IUser['user']>(this.uid)
      .collection<IUser>('employees');
    return docRef.valueChanges(); // return the employees collection
  }

  // get the business user's services collection
  // this is returned once the promise resolves
  public async getServices(): Promise<Observable<IUser['service'][]>> {
    console.log('getServices called');
    // get the users data from localstorage
    let theUser = JSON.parse(localStorage.getItem('user'));
    this.uid = theUser.uid; // store the user id
    let docRef;
    docRef = await this.firestore
      .collection('users')
      .doc<IUser['user']>(this.uid)
      .collection<IUser>('services');
    return docRef.valueChanges(); // return the services collection
  }

  // The functions below adds/gets data for a business profile, that is available to other users

  // get a business profile doc from the businesses collection with the id passed in
  getABusiness(id: string): Observable<IBusiness['business']> {
    console.log('getABusiness called');

    let docRef;
    docRef = this.firestore
      .collection<IBusiness>('businesses')
      .doc<IBusiness['business']>(id);
    return docRef.valueChanges(); // return the business doc
  }

  // get the business's hours doc from the hours collection
  public getHours(id: string) {
    console.log('getHours called');

    let docRef = this.firestore
      .collection<IUser>('users')
      .doc<IUser['user']>(id)
      .collection<IUser>('hours')
      .doc<IUser['hours']>('theHours');
    return docRef.valueChanges(); // returns the hours doc
  }

  // get the services collection from a business with the matching id passed in
  getBusServices(id: string): Observable<IUser['service']> {
    console.log('getBusServices called');

    let docRef;
    // const service = [];
    docRef = this.firestore
      .collection('users')
      .doc<IUser['user']>(id)
      .collection<IUser>('services');
    return docRef.valueChanges(); // return the services collection
  }

  // get the employees collection from a business with the matching id passed in
  getBusEmployees(id: string): Observable<IUser['employee']> {
    console.log('getBusEmployees called');
    let docRef;
    docRef = this.firestore
      .collection('users')
      .doc<IUser['user']>(id)
      .collection<IUser>('employees');
    return docRef.valueChanges(); // return the employees collection
  }
}
