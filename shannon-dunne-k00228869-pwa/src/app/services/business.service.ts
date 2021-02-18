import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/firestore';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { from, Observable } from 'rxjs';
import { IUser } from 'src/app/i-user';
// import { AngularFireStorageModule} from ''

@Injectable({
  providedIn: 'root'
})
export class BusinessService {
  public uid: string;
  public id: string;
  
  

  constructor(
    public firestore: AngularFirestore,
    public authenticate: AngularFireAuth,
    public db: AuthenticateService,
  ) { }


  public addBusiness(newProfile: IUser['business']) // add a business details to the db
  {
    let theUser = JSON.parse(localStorage.getItem('user'));
    this.uid = theUser.uid;
    return from (this.firestore.collection<IUser>('users').doc<IUser['user']>(this.uid)   // returns promise not observable
    .collection<IUser['business']>('business' + this.uid).add(newProfile)); // add user to the db
    // profileCreated= true; //set to true so users cannot see the create button to add another business to the db
  }


  public getBusiness(): Observable<IUser['business']>  // if a page change occurs can the system tell whos id i want to track?
  {
    let theUser = JSON.parse(localStorage.getItem('user'));
    this.uid = theUser.uid;
    let docRef;
    docRef = this.firestore.collection('users').doc<IUser['user']>(this.uid)
    .collection<IUser['business']>('business' + this.uid);
    return docRef.valueChanges();
  }

  public addSlides(newImages: IUser['slides'])
  {
    let theUser = JSON.parse(localStorage.getItem('user'));
    this.uid = theUser.uid;
    return from (this.firestore.collection('users')
    .doc<IUser['user']>(this.uid).collection<IUser['slides']>('profileImages' + this.uid).add(newImages));
  }

  
  public addServices(newServices: IUser['services'] )
  {
    // console.log(service);
    let theUser = JSON.parse(localStorage.getItem('user'));
    this.uid = theUser.uid;
    if (newServices)
      {
        for (const service of [newServices] )
        {
          this.firestore.collection('users').doc<IUser['user']>(this.uid)
          .collection<IUser['services']>('service' + this.uid).add(service);
        }
      }
     // need to iterate through array of businesses to create a seperate doc
     
  }

  
  public addEmployees(newEmployees: IUser['employees'])
  {
    // console.log(newEmployees);
    let theUser = JSON.parse(localStorage.getItem('user'));
    this.uid = theUser.uid;
    // this.id = this.firestore.createId();
    // this.id = employee.id;
    if (newEmployees)
      {
        for (const employee of [newEmployees] )
         {
          return from (this.firestore.collection('users').doc<IUser['user']>(this.uid)
          .collection<IUser['employees']>('employees' + this.uid).add(employee));
         }
      }
  }

  getEmployees(): Observable<IUser['employees']>
  {
    let theUser = JSON.parse(localStorage.getItem('user'));
    this.uid = theUser.uid;
    let docRef;
    docRef = this.firestore.collection('users').doc<IUser['user']>(this.uid)
    .collection<IUser['employees']>('employees' + this.uid);
    return docRef.valueChanges();
  }

  getServices(): Observable<IUser['services']>
  {
    let theUser = JSON.parse(localStorage.getItem('user'));
    this.uid = theUser.uid;
    let docRef;
    docRef = this.firestore.collection('users').doc<IUser['user']>(this.uid)
    .collection<IUser['services']>('service' + this.uid);
    return docRef.valueChanges();

  }

  // updateBusiness()
  // {

  // }
}
