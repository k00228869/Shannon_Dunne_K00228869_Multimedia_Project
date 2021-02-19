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
    this.id = this.firestore.createId();
    newProfile.id = this.id;
    
    return from (this.firestore.collection<IUser>('users').doc<IUser['user']>(this.uid)   // returns promise not observable
    .collection<IUser['business']>('business' + this.uid).add(newProfile)); // add user to the db
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

  
  public addServices(adService: IUser['service'] )
  {
    // console.log(service);
    let theUser = JSON.parse(localStorage.getItem('user'));
    this.uid = theUser.uid;
    // if (adService)
    //   {
    //     for (let service of [adService] )
    //     {
          // this.id = this.firestore.createId() // create id
          // service.id = this.id //set id for each service
    return from (this.firestore.collection('users').doc<IUser['user']>(this.uid)
          .collection<IUser['service']>('service' + this.uid).add(adService));
      //   }
      // }
  }

  
  public addEmployees(adEmployee: IUser['employee'])
  {
    // console.log(newEmployees);
    let theUser = JSON.parse(localStorage.getItem('user'));
    this.uid = theUser.uid;
    console.log(adEmployee);
    
    // if (adEmployee)
    //   {
    //     for (let employee of [adEmployee])
    //      {
    return from (this.firestore.collection('users').doc<IUser['user']>(this.uid)
           .collection<IUser['employee']>('employees' + this.uid).add(adEmployee));
        //  }
        // for(let i = 0; i<newEmployees.length; i++)
        // {
        //   for(let j = 0; j< newEmployees[i].length; j++)
        //   {

        //   }
        // }
    
  }

getEmployees(): Observable<IUser['employee']>
  {
    let theUser = JSON.parse(localStorage.getItem('user'));
    this.uid = theUser.uid;
    let docRef;
    docRef = this.firestore.collection('users').doc<IUser['user']>(this.uid)
    .collection<IUser['employee']>('employees' + this.uid);
    return docRef.valueChanges();
  }

getServices(): Observable<IUser['service']>
  {
    let theUser = JSON.parse(localStorage.getItem('user'));
    this.uid = theUser.uid;
    let docRef;
    docRef = this.firestore.collection('users').doc<IUser['user']>(this.uid)
    .collection<IUser['service']>('service' + this.uid);
    return docRef.valueChanges();

  }

  // updateBusiness()
  // {

  // }
}
