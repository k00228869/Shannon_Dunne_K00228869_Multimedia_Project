import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { IUser } from '../i-user';

@Injectable({
  providedIn: 'root'
})
export class SearchQueriesService {

  constructor(
    public firestore: AngularFirestore,

  ) { }

  public getAllBusinessUsers(): Observable<IUser['user']> // returns the business users id's
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
}
