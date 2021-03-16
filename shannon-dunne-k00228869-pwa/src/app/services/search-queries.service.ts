import { keyframes } from '@angular/animations';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { observable, Observable, from, of } from 'rxjs';
import { IUser } from '../i-user';

@Injectable({
  providedIn: 'root'
})
export class SearchQueriesService {
  // public bus: Observable<IUser['business'][]>;
  public businesses: Observable<IUser['business'][]>;
  allBus: IUser['business'][] = [];
  // bus: IUser['business'];
  
  constructor(
    public firestore: AngularFirestore,

  ) { }

  // public getAllBusUsers(): Observable<IUser['user']> // returns the business users id's
  // {
  //   let aUsers;
  //   aUsers = this.firestore.collection<IUser['user']>('users', ref => ref.where('admin', '==', true));
  //   return aUsers.valueChanges().then(
  //     (data) => {
  //       console.log('bus Ids', data);
  //       // let key
  //     //   for (key in data)
  //     // {
  //     //   let business;
  //     //   business = this.firestore.collection('users').doc<IUser['user']>(userIds[key])
  //     //   .collection<IUser['business']>('business');
  //     //   return business.valueChanges();
  //     // }
  //     }
  //   );
  // }


  // public async getAllBusinesses(userIds: string[]): Promise<Observable<IUser['business']>>
  // {
  //   Object.keys(userIds).length;
  //   let key;
  //     // tslint:disable-next-line: forin
  //   for (key in userIds)
  //   {
  //     if (userIds.hasOwnProperty(key))
  //     {
  //       let business;
  //       business = this.firestore.collection('users').doc<IUser['user']>(userIds[key])
  //       .collection<IUser['business']>('business');
  //       return await business.valueChanges();
  //     }
  //   }
  // }

  public getAllBusinessUsers()
  {
    let allBusinesses;
    allBusinesses = this.firestore.collection<IUser['business']>('businesses', ref => ref.where('profileCreated', '==', 'true'));
    return allBusinesses.valueChanges();
  }


  // public getAllBusinessUsers(): Observable<IUser['user'][]> // returns the business users id's
  // {
  //   let aUsers;
  //   aUsers = this.firestore.collection<IUser['user']>('users', ref => ref.where('admin', '==', true));
  //   return aUsers.valueChanges();
  // }



  public getAllBusinessLocations(location: string): Observable<IUser['user']> // returns the business users id's
  {
    let allBusinesses;
    allBusinesses = this.firestore.collection<IUser['business']>('businesses', ref => ref.where('county', '==', location));
    return allBusinesses.valueChanges();
  }

  public getAllBusinessTypes(busType: string) // returns the business users id's
  {
    let allBusinesses;
    allBusinesses = this.firestore.collection<IUser['business']>('businesses', ref => ref.where('businessType', '==', busType));
    return allBusinesses.valueChanges();
  }
}
