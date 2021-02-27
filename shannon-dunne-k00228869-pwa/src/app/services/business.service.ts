import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreModule } from '@angular/fire/firestore';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { from, observable, Observable, of } from 'rxjs';
import { IUser } from 'src/app/i-user';
import { map } from 'rxjs/operators';
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

  constructor(
    public firestore: AngularFirestore,
    public authenticate: AngularFireAuth,
    public db: AuthenticateService,
    public imgStorage: AngularFirestoreModule,
  ) { }


  public addBusinessHours(newHours: IUser['hours']) // add a business details to the db
  {
    let theUser = JSON.parse(localStorage.getItem('user'));
    this.uid = theUser.uid;
    // newHours.id = this.uid;
    return from (this.firestore.collection<IUser>('users').doc<IUser['user']>(this.uid)   // returns promise not observable
    .collection<IUser['hours']>('hours').add(newHours)); // add user to the db
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


  public addHours(newHours: IUser['hours']) // add a business details to the db
  {
    let theUser = JSON.parse(localStorage.getItem('user'));
    this.uid = theUser.uid;
    return from (this.firestore.collection<IUser>('users').doc<IUser['user']>(this.uid)   // returns promise not observable
    .collection<IUser['hours']>('hours').add(newHours)); // add user to the db
  }

  public getBusinessHours(): Observable<any> // add a business details to the db
  {
    let theUser = JSON.parse(localStorage.getItem('user'));
    this.uid = theUser.uid;
    let docRef = this.firestore.collection<IUser>('users').doc<IUser['user']>(this.uid)   // returns promise not observable
    .collection<IUser['hours']>('hours'); // add user to the db
    return docRef.valueChanges();
  }



  public getHours(id: string): Observable<any> // add a business details to the db
  {
    let docRef = this.firestore.collection<IUser>('users').doc<IUser['user']>(id)   // returns promise not observable
    .collection<IUser['hours']>('hours'); // add user to the db
    return docRef.valueChanges();
  }

  public getBusiness(): Observable<IUser['business']>  // if a page change occurs can the system tell whos id i want to track?
  {
    let theUser = JSON.parse(localStorage.getItem('user'));
    this.uid = theUser.uid;
    let docRef;
    docRef = this.firestore.collection('users').doc<IUser['user']>(this.uid)
    .collection<IUser['business']>('business');
    return docRef.valueChanges();
  }


  public addServices(adService: IUser['service'] )
{
    let theUser = JSON.parse(localStorage.getItem('user'));
    this.uid = theUser.uid;
    return from (this.firestore.collection('users').doc<IUser['user']>(this.uid)
    .collection<IUser['service']>('services').add(adService));
  }

  public addImages(profileImages: IUser['slides'])
{
    let theUser = JSON.parse(localStorage.getItem('user'));
    this.uid = theUser.uid;
    console.log(profileImages);
    return from (this.firestore.collection('users').doc<IUser['user']>(this.uid)
    .collection<IUser['slides']>('Images').add(profileImages));
}

  public addEmployees(adEmployee: IUser['employee'])
{
    let theUser = JSON.parse(localStorage.getItem('user'));
    this.uid = theUser.uid;
    return from (this.firestore.collection('users').doc<IUser['user']>(this.uid)
    .collection<IUser['employee']>('employees').add(adEmployee));
  }

  public async getEmployees(): Promise<Observable<IUser['employee']>>
    {
      let theUser = JSON.parse(localStorage.getItem('user'));
      this.uid = theUser.uid;
      let docRef;
      docRef = await this.firestore.collection('users').doc<IUser['user']>(this.uid)
      .collection<IUser['employee']>('employees');
      return docRef.valueChanges();
    }

  public async getServices(): Promise<Observable<IUser['service']>>
  {
    let theUser = JSON.parse(localStorage.getItem('user'));
    this.uid = theUser.uid;
    const services = [];
    let docRef;
    docRef = await this.firestore.collection('users').doc<IUser['user']>(this.uid)
    .collection<IUser['service']>('services');
    return docRef.valueChanges();
  }



getABusiness(id: string): Observable<IUser['business']>
  {
    let docRef;
    docRef = this.firestore.collection('users').doc<IUser['user']>(id)
    .collection<IUser['business']>('business');
    return docRef.valueChanges();
  }

getBusServices(id: string): Observable<IUser['service']>
  {
    let docRef;
    // const service = [];
    docRef = this.firestore.collection('users').doc<IUser['user']>(id)
    .collection<IUser['service']>('services');
    return docRef.valueChanges();
  }

getBusEmployees(id: string): Observable<IUser['employee']>
  {
    let docRef;
    docRef = this.firestore.collection('users').doc<IUser['user']>(id)
    .collection<IUser['employee']>('employees');
    return docRef.valueChanges();
  }


getUserInfo(): Observable<IUser['user']> // gets the user doc with the passed id
  {
    let theUser = JSON.parse(localStorage.getItem('user'));
    this.uid = theUser.uid;
    return this.firestore.collection<IUser>('users')
    .doc<IUser['user']>(this.uid).valueChanges(); // returns the users doc to check if admin is true
  }

}
