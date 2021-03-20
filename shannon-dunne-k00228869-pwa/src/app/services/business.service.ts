import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreModule } from '@angular/fire/firestore';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { from, observable, Observable, of } from 'rxjs';
import { IUser } from 'src/app/i-user';
import { map } from 'rxjs/operators';
import { IDays } from '../idays';
import { stringify } from '@angular/compiler/src/util';
// import { UploadsService } from './uploads.service';


@Injectable({
  providedIn: 'root'
})

export class BusinessService {
  public uid: string;
  public userId: Observable<string[]>;
  public id: string;
  users: Observable<IUser['user']>;
  busCollection: AngularFirestoreCollection<IUser['business']>;
  business: Observable<IUser['business'][]>;
  hourList: Observable<IDays['1']>[];
  // newHourList: IUser['scheduleOfDays'];

  constructor(
    public firestore: AngularFirestore,
    public authenticate: AngularFireAuth,
    public db: AuthenticateService,
    public imgStorage: AngularFirestoreModule,
  ) { }


  // public addBusinessHours(selectedHours: IUser['hours']) // add a business details to the db
  // {
  //   let theUser = JSON.parse(localStorage.getItem('user'));
  //   this.uid = theUser.uid;
  //   // newHours.id = this.uid;
  //   return from (this.firestore.collection<IUser>('users').doc<IUser['user']>(this.uid)   // returns promise not observable
  //   .collection<IUser['hours']>('hours').add(selectedHours)); // add user to the db
  // }

  public addHours(selectedHours) // add a business details to the db
  {
    let theUser = JSON.parse(localStorage.getItem('user'));
    this.uid = theUser.uid;
    console.log('hours to db', selectedHours);
    return from (this.firestore.collection<IUser>('users').doc<IUser['user']>(this.uid)   // returns promise not observable
    .collection<IUser['hours']>('hours').add(Object.assign({}, selectedHours))); // add user to the db
  }


  public getHoursList( ): Observable<IDays['1']> // get the hours template
  {
    return this.firestore.collection<IDays>('days')
    .doc<IDays['1']>('monday').valueChanges();
  }



// posts/gets data for a business user's profile

public addToBusinessCol(newProfile: IUser['business'])
  {
    let theUser = JSON.parse(localStorage.getItem('user'));
    this.uid = theUser.uid;
    return from (this.firestore.collection('businesses').doc(this.uid).set(newProfile));
  }


  public addBusiness(newProfile: IUser['business']) // add a business details to the db
  {
    let theUser = JSON.parse(localStorage.getItem('user'));
    this.uid = theUser.uid;
    newProfile.id = this.uid;
    // newProfile.hours = dailyHours;
    return from (this.firestore.collection<IUser>('users').doc<IUser['user']>(this.uid)   // returns promise not observable
    .collection<IUser['business']>('business').add(newProfile)); // add user to the db
  }

  public addServices(adService: IUser['service']) // add business user's services
{
    let theUser = JSON.parse(localStorage.getItem('user'));
    this.uid = theUser.uid;
    return from (this.firestore.collection('users').doc<IUser['user']>(this.uid)
    .collection<IUser['service']>('services').add(adService));
  }

  public addImages(profileImages: IUser['slides']) // add business user's images
{
    let theUser = JSON.parse(localStorage.getItem('user'));
    this.uid = theUser.uid;
    console.log(profileImages);
    return from (this.firestore.collection('users').doc<IUser['user']>(this.uid)
    .collection<IUser['slides']>('Images').add(profileImages));
}

  public addEmployees(adEmployee: IUser['employee']) // add business user's employees
{
    let theUser = JSON.parse(localStorage.getItem('user'));
    this.uid = theUser.uid;
    return from (this.firestore.collection('users').doc<IUser['user']>(this.uid)
    .collection<IUser['employee']>('employees').add(adEmployee));
  }

  public getBusiness(): Observable < IUser['business'] > // get business user's business info
  {
    let theUser = JSON.parse(localStorage.getItem('user'));
    this.uid = theUser.uid;
    let docRef;
    docRef = this.firestore.collection('users').doc<IUser['user']>(this.uid)
    .collection<IUser['business']>('business');
    return docRef.valueChanges();
  }

  public getBusinessHours(): Observable < any > // add a business user's hours to the db
  {
    let theUser = JSON.parse(localStorage.getItem('user'));
    this.uid = theUser.uid;
    let docRef = this.firestore.collection<IUser>('users').doc<IUser['user']>(this.uid)   // returns promise not observable
    .collection<IUser['hours']>('hours'); // add user to the db
    return docRef.valueChanges();
  }


  public async getEmployees(): Promise < Observable < IUser['employee'] >> // get business user's employees
    {
      let theUser = JSON.parse(localStorage.getItem('user'));
      this.uid = theUser.uid;
      let docRef;
      docRef = await this.firestore.collection('users').doc<IUser['user']>(this.uid)
      .collection<IUser['employee']>('employees');
      return docRef.valueChanges();
    }

  public async getServices(): Promise < Observable < IUser['service'] >> // get business user's services
  {
    let theUser = JSON.parse(localStorage.getItem('user'));
    this.uid = theUser.uid;
    const services = [];
    let docRef;
    docRef = await this.firestore.collection('users').doc<IUser['user']>(this.uid)
    .collection<IUser['service']>('services');
    return docRef.valueChanges();
  }





// posts/gets data for a business profile available to other users

getABusiness(id: string): Observable < IUser['business'] > // get a business' details
  {
    let docRef;
    docRef = this.firestore.collection('users').doc<IUser['user']>(id)
    .collection<IUser['business']>('business');
    return docRef.valueChanges();
  }

  public getHours(id: string)  // get a the business hours
  {
    let docRef = this.firestore.collection<IUser>('users').doc<IUser['user']>(id)   // returns promise not observable
    .collection<IUser['hours']>('hours'); // add user to the db
    return docRef.valueChanges();
  }

getBusServices(id: string): Observable < IUser['service'] > // get a businesses services
  {
    let docRef;
    // const service = [];
    docRef = this.firestore.collection('users').doc<IUser['user']>(id)
    .collection<IUser['service']>('services');
    return docRef.valueChanges();
  }

getBusEmployees(id: string): Observable < IUser['employee'] > // get a businesses employees
  {
    let docRef;
    docRef = this.firestore.collection('users').doc<IUser['user']>(id)
    .collection<IUser['employee']>('employees');
    return docRef.valueChanges();
  }

getUserInfo(): Observable < IUser['user'] > // gets the user doc with the passed id
  {
    let theUser = JSON.parse(localStorage.getItem('user'));
    this.uid = theUser.uid;
    return this.firestore.collection<IUser>('users')
    .doc<IUser['user']>(this.uid).valueChanges(); // returns the users doc to check if admin is true
  }

}
