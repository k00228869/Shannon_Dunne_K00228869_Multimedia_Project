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

  public getAllBusinessUsers(): Observable<IUser['user']> // returns the business users id's
  {
    let aUsers;
    aUsers = this.firestore.collection<IUser['user']>('users', ref => ref.where('admin', '==', true));
    return aUsers.valueChanges();
  }


  public getAllBusinesses(userIds: string[]): Observable<IUser['business'][]>
  {
    Object.keys(userIds).length;
    let key, count = 0;
      // tslint:disable-next-line: forin
    for (key in userIds)
    {
      if (userIds.hasOwnProperty(key))
      {
        let business;
        business = this.firestore.collection('users').doc<IUser['user']>(userIds[key])
        .collection<IUser['business']>('business');
        return business.valueChanges();
        // this.allBus.push(business);
      }
    }
    // this.businesses = of(this.allBus);
    // console.log('all businesses', this.businesses);
    // return this.businesses;
  }



  public getAllBusinessLocations(): Observable<IUser['user']> // returns the business users id's
  {
    let aUsers;
    aUsers = this.firestore.collection<IUser['user']>('users', ref => ref.where('admin', '==', true));
    return aUsers.valueChanges();
  }

  public getAllBusinessTypes(): Observable<IUser['user']> // returns the business users id's
  {
    let aUsers;
    aUsers = this.firestore.collection<IUser['user']>('users', ref => ref.where('admin', '==', true));
    return aUsers.valueChanges();
  }
}
