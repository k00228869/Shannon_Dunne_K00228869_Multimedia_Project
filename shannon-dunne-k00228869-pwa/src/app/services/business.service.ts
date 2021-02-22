import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/firestore';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { from, Observable } from 'rxjs';
import { IUser } from 'src/app/i-user';
import { map } from 'rxjs/operators';
// import { AngularFireStorageModule} from ''

@Injectable({
  providedIn: 'root'
})
export class BusinessService {
  public uid: string;
  public userId: string[];

  public id: string;

  users: Observable<IUser['user']>;
  businesses: Observable<IUser['business']>;

  
  // profileImages: IUser['slides'];
  public profileImages: string[];


  constructor(
    public firestore: AngularFirestore,
    public authenticate: AngularFireAuth,
    public db: AuthenticateService,
    public imgStorage: AngularFirestoreModule
  ) { }


  public addBusiness(newProfile: IUser['business']) // add a business details to the db
  {
    let theUser = JSON.parse(localStorage.getItem('user'));
    this.uid = theUser.uid;
    newProfile.id = this.uid;
    return from (this.firestore.collection<IUser>('users').doc<IUser['user']>(this.uid)   // returns promise not observable
    .collection<IUser['business']>('business').add(newProfile)); // add user to the db
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


  public getAllBusinesses(): Observable<IUser['business']>
  {
    let business;
    let aUser;
    aUser = this.firestore.collection<IUser['user']>('users', ref => ref.where('admin', '==', true)).valueChanges();
    return aUser.subscribe(
       (data) => {
         for (let i = 0; i < data.length; i++) // loop through data observable
         {
           // get all userids of data and store in id array
          //loop through array and get subcoll of userid
          this.userId = data[i].uid;
          // this.userId = this.users
          // this.userId = this.users[i].uid;
          console.log(this.userId);
          this.userId.forEach(user => {
            console.log(this.userId[0]);
            console.log(user);
            business = this.firestore.collection<IUser['business']>(`users/${user}/business`).valueChanges();
            return business;
          });
        //  this.userId = data.uid;
        //  console.log('stored ids ', this.users);
        // // business = this.firestore.collection<IUser['business']>('business', ref => ref.where('profileCreated', '==', true));
        //  business = this.firestore.collection<IUser['business']>(`users/{this.users.uid}/business`).valueChanges();
        //  return business;
        // // this.uid = this.users.uid;
      }
    });



    // business = this.firestore.collection<IUser['business']>('business', ref => ref.where('profileCreated', '==', true));
    // return business.valueChanges();
  }


  public addSlides(newImages: IUser['slides'])
  {
    let theUser = JSON.parse(localStorage.getItem('user'));
    this.uid = theUser.uid;
    return from (this.firestore.collection('users')
    .doc<IUser['user']>(this.uid).collection<IUser['slides']>('profileImages').add(newImages));
  }

  public addServices(adService: IUser['service'] )
  {
    let theUser = JSON.parse(localStorage.getItem('user'));
    this.uid = theUser.uid;
    return from (this.firestore.collection('users').doc<IUser['user']>(this.uid)
    .collection<IUser['service']>('services').add(adService));
  }

  public addEmployees(adEmployee: IUser['employee'])
  {
    let theUser = JSON.parse(localStorage.getItem('user'));
    this.uid = theUser.uid;
    console.log(adEmployee);
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

  addImages(profileImages)
  {
    let theUser = JSON.parse(localStorage.getItem('user'));
    this.uid = theUser.uid;
    return from (this.firestore.collection('users').doc<IUser['user']>(this.uid)
    .collection<IUser['slides']>('Account Images').add(profileImages));
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
    docRef = await this.firestore.collection('users').doc<IUser['user']>(id)
    .collection<IUser['service']>('service');
    return docRef.valueChanges();
  }

  async getBusEmployees(id: string): Promise<Observable<IUser['business']>>
  {
    let docRef;
    docRef = await this.firestore.collection('users').doc<IUser['user']>(id)
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
