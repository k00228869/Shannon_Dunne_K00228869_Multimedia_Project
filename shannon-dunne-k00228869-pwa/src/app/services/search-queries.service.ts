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

  public getAllBusinessUsers()
  {
    let allBusinesses;
    allBusinesses = this.firestore.collection<IUser['business']>('businesses', ref => ref.where('profileCreated', '==', 'true'));
    return allBusinesses.valueChanges();
  }

  public checkQuery(location: string, busType: string, sort: string): Observable<IUser['business'][]>
  {
    if ( sort === 'rating')
    {
      console.log('queryRating called');
      let allBusinesses;
      allBusinesses = this.firestore.collection<IUser['business']>('businesses', ref => ref
      .where('county', '==', location)
      .where('businessType', '==', busType)
      .orderBy(sort, 'desc'));
      return allBusinesses.valueChanges();
    }
    else if (sort === 'price')
    {
      console.log('queryPrice called');
      let allBusinesses;
      allBusinesses = this.firestore.collection<IUser['business']>('businesses', ref => ref
      .where('county', '==', location)
      .where('businessType', '==', busType)
      .orderBy(sort, 'asc'));
      return allBusinesses.valueChanges();
    }
    else{
      console.log('query loc+type called');
      let allBusinesses;
      allBusinesses = this.firestore.collection<IUser['business']>('businesses', ref => ref
      .where('county', '==', location)
      .where('businessType', '==', busType));
      return allBusinesses.valueChanges();
    }

  }
}
