import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreModule } from '@angular/fire/firestore';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { from, observable, Observable, of } from 'rxjs';
import { IUser } from 'src/app/i-user';
import { map } from 'rxjs/operators';
import { BusinessListComponent } from '../client-components/search-directory/business-list/business-list.component';
import { UploadsService } from './uploads.service';
import { ActionSequence } from 'protractor';

@Injectable({
  providedIn: 'root'
})
export class BusinessService {
  public uid: string;
  public userId: Observable<string[]>;
  

  public id: string;

  users: Observable<IUser['user']>;
  // businesses: Observable<IUser['business']>;
  public bus: Observable<IUser['business'][]>;
  public businesses: Observable<IUser['business']>;
  // public profiles: Observable<any[]>;
  
  // public profileImages: string[];
    // public profileImages: IUser['slides'];
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


  public getHours(): Observable<any> // add a business details to the db
  {
    let theUser = JSON.parse(localStorage.getItem('user'));
    this.uid = theUser.uid;
    let docRef = this.firestore.collection<IUser>('users').doc<IUser['user']>(this.uid)   // returns promise not observable
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

  public getAllBusinessUsers(): Observable<IUser['user']>
  {
    let aUsers;
    aUsers = this.firestore.collection<IUser['user']>('users', ref => ref.where('admin', '==', true));
    return aUsers.valueChanges();
  }


  public getAllBusinesses(userIds): Observable<IUser['business']>
  {
    let business;
    // for (let i = 0; i < userIds.length; i++)
    // {
    //   business = this.firestore.collection('users').doc<IUser['user']>(userIds[i])
    //   .collection<IUser['business']>('business');
    //   // .collection<IUser['business']>('business').valueChanges();
    //   // this.businesses.push(business.value);
    // }
    // return business.valueChanges();
    // Object.keys(userIds).length;
    let key, count = 0;
      // tslint:disable-next-line: forin
    for (key in userIds)
        {
        if (userIds.hasOwnProperty(key))
        {
          business = this.firestore.collection('users').doc<IUser['user']>(userIds[key])
          .collection<IUser['business']>('business').valueChanges();
          // this.businesses[0].push(business);
        }
        // return this.businesses;
        return business;
      }
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
    // console.log(adEmployee);
    console.log(adEmployee.emloyeeImg);
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

async getBusServices(id: string): Promise<Observable<IUser['business']>>
  {
    let docRef;
    docRef = this.firestore.collection('users').doc<IUser['user']>(id)
    .collection<IUser['service']>('service');
    return docRef.valueChanges();
  }

async getBusEmployees(id: string): Promise<Observable<IUser['business']>>
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
