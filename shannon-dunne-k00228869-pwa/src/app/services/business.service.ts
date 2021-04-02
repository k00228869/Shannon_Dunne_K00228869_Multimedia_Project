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

  constructor(
    public firestore: AngularFirestore,
  ) {}

  // add business
  public addHours(
    selectedHours // add a business hoirs to the db
  ) {
    let theUser = JSON.parse(localStorage.getItem('user'));
    this.uid = theUser.uid;
    return from(
      this.firestore
        .collection<IUser>('users')
        .doc<IUser['user']>(this.uid) // returns promise not observable
        .collection<IUser>('hours')
        .doc<IUser['hours']>('theHours')
        .set(Object.assign({}, selectedHours))
    ); // add user to the db
  }

  public getHoursList(): Observable<IDays['1']> { // get the hours template
    return this.firestore
      .collection<IDays>('days')
      .doc<IDays['1']>('monday')
      .valueChanges();
  }

  public addBusiness(
    newProfile // add a businesses details to the db
  ) {
    let theUser = JSON.parse(localStorage.getItem('user'));
    newProfile.id = theUser.uid;
    return from(
      this.firestore
        .collection<IBusiness>('businesses')
        .doc<IBusiness['business']>(newProfile.id)
        .set(newProfile));
  }

  public addServices(
    adService: IUser['service'] // add business user's services
  ) {
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

  public addImages(
    images // add business user's images
  ) {
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

  public addEmployees(
    adEmployee: IUser['employee'] // add business user's employees
  ) {
    let theUser = JSON.parse(localStorage.getItem('user'));
    this.uid = theUser.uid;
    return from(
      this.firestore
        .collection('users')
        .doc<IUser['user']>(this.uid)
        .collection<IUser>('employees')
        .doc<IUser['employee']>(adEmployee.id)
        .set(adEmployee)
    );
  }

  public getBusiness(): Observable<IBusiness['business']> { // get business user's business info
    let theUser = JSON.parse(localStorage.getItem('user'));
    this.id = theUser.uid;
    let docRef = this.firestore
      .collection<IBusiness>('businesses')
      .doc<IBusiness['business']>(this.id);
    return docRef.valueChanges();
  }

  public getBusinessHours(): Observable<any> { // add a business user's hours to the db
    let theUser = JSON.parse(localStorage.getItem('user'));
    this.uid = theUser.uid;
    let docRef = this.firestore
      .collection<IUser>('users')
      .doc<IUser['user']>(this.uid) // returns promise not observable
      .collection<IUser>('hours'); // add user to the db
    return docRef.valueChanges();
  }

  public async getEmployees(): Promise<Observable<IUser['employee']>> { // get business user's employees
    let theUser = JSON.parse(localStorage.getItem('user'));
    this.uid = theUser.uid;
    let docRef;
    docRef = await this.firestore
      .collection('users')
      .doc<IUser['user']>(this.uid)
      .collection<IUser>('employees');
    return docRef.valueChanges();
  }

  public async getServices(): Promise<Observable<IUser['service'][]>> { // get business user's services
    let theUser = JSON.parse(localStorage.getItem('user'));
    this.uid = theUser.uid;
    const services = [];
    let docRef;
    docRef = await this.firestore
      .collection('users')
      .doc<IUser['user']>(this.uid)
      .collection<IUser>('services');
    return docRef.valueChanges();
  }

  // posts/gets data for a business profile available to other users
  getABusiness(
    id: string
  ): Observable<IBusiness['business']> { // get a business' details
    let docRef;
    docRef = this.firestore
      .collection<IBusiness>('businesses')
      .doc<IBusiness['business']>(id);
    return docRef.valueChanges();
  }

  public getHours(
    id: string // get a the business' hours
  ) {
    let docRef = this.firestore
      .collection<IUser>('users')
      .doc<IUser['user']>(id) // returns promise not observable
      .collection<IUser>('hours') // add user to the db
      .doc<IUser['hours']>('theHours');
    return docRef.valueChanges();
  }

  getBusServices(
    id: string
  ): Observable<IUser['service']> { // get a businesses services
    let docRef;
    // const service = [];
    docRef = this.firestore
      .collection('users')
      .doc<IUser['user']>(id)
      .collection<IUser>('services');
    return docRef.valueChanges();
  }

  getBusEmployees(
    id: string
  ): Observable<IUser['employee']> { // get a businesses employees
    let docRef;
    docRef = this.firestore
      .collection('users')
      .doc<IUser['user']>(id)
      .collection<IUser>('employees');
    return docRef.valueChanges();
  }

  getUserInfo(): Observable<IUser['user']> { // gets the user doc with the passed id
    let theUser = JSON.parse(localStorage.getItem('user'));
    this.uid = theUser.uid;
    return this.firestore
      .collection<IUser>('users')
      .doc<IUser['user']>(this.uid)
      .valueChanges(); // returns the users doc to check if admin is true
  }
}
