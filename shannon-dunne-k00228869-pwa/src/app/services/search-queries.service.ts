import { keyframes } from '@angular/animations';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { observable, Observable, from, of } from 'rxjs';
import { IUser } from '../i-user';

@Injectable({
  providedIn: 'root',
})
export class SearchQueriesService {
  // public bus: Observable<IUser['business'][]>;
  public businesses: Observable<IUser['business'][]>;
  allBus: IUser['business'][] = [];
  public filteredProfiles: IUser['business'][];

  // bus: IUser['business'];

  constructor(public firestore: AngularFirestore) {}

  // public getAllBusinessUsers() // get all businesses with a profile
  // {
  //   let allBusinesses;
  //   allBusinesses = this.firestore.collection<IUser>('businesses', ref => ref
  //   .where('profileCreated', '==', 'true').limit(20));
  //   return allBusinesses.valueChanges();
  // }

  public checkQuery(
    location: string,
    busType: string,
    sort: string
  ): Observable<IUser['business'][]> {
    // if busType and location were selected with rating
    if (sort === 'rating' && location !== 'default' && busType !== 'default') {
      this.filteredProfiles = [];
      console.log('query rating + loc + type');
      let allBusinesses;
      allBusinesses = this.firestore.collection<IUser>('businesses', (ref) =>
        ref
          .where('county', '==', location)
          .where('businessType', '==', busType)
          .orderBy(sort, 'desc')
      );
      return allBusinesses.valueChanges();
    }
    // if busType and location were selected with price
    else if (
      sort === 'price' &&
      location !== 'default' &&
      busType !== 'default'
    ) {
      this.filteredProfiles = [];
      console.log('query price + loc + type');
      let allBusinesses;
      allBusinesses = this.firestore.collection<IUser>('businesses', (ref) =>
        ref
          .where('county', '==', location)
          .where('businessType', '==', busType)
          .orderBy(sort, 'asc')
      );
      return allBusinesses.valueChanges();
    }
    // if only busType and location were selected
    else if (
      sort === 'default' &&
      location !== 'default' &&
      busType !== 'default'
    ) {
      this.filteredProfiles = [];
      console.log('just query location and type');
      let allBusinesses;
      allBusinesses = this.firestore.collection<IUser>('businesses', (ref) =>
        ref.where('county', '==', location).where('businessType', '==', busType)
      );
      return allBusinesses.valueChanges();
    }
    // if only busType was selected
    else if (
      sort === 'default' &&
      location === 'default' &&
      busType !== 'default'
    ) {
      this.filteredProfiles = [];
      console.log('just query type');
      let allBusinesses;
      allBusinesses = this.firestore.collection<IUser>('businesses', (ref) =>
        ref.where('businessType', '==', busType)
      );
      return allBusinesses.valueChanges();
    }
    // if only location was selected
    else if (
      sort === 'default' &&
      busType === 'default' &&
      location !== 'default'
    ) {
      this.filteredProfiles = [];
      console.log('just query loc');
      let allBusinesses;
      allBusinesses = this.firestore.collection<IUser>('businesses', (ref) =>
        ref.where('county', '==', location)
      );
      return allBusinesses.valueChanges();
    }
    // if location + price were selected
    else if (
      sort === 'price' &&
      busType === 'default' &&
      location !== 'default'
    ) {
      this.filteredProfiles = [];
      console.log('just query price + location called');
      let allBusinesses;
      allBusinesses = this.firestore.collection<IUser>('businesses', (ref) =>
        ref.where('county', '==', location).orderBy(sort, 'asc')
      );
      return allBusinesses.valueChanges();
    }
    // if type + price were selected
    else if (
      sort === 'price' &&
      busType !== 'default' &&
      location === 'default'
    ) {
      this.filteredProfiles = [];
      let allBusinesses;
      allBusinesses = this.firestore.collection<IUser>('businesses', (ref) =>
        ref.where('businessType', '==', busType).orderBy(sort, 'asc')
      );
      return allBusinesses.valueChanges();
    }
    // if location + rating were selected
    else if (
      sort === 'rating' &&
      busType === 'default' &&
      location !== 'default'
    ) {
      this.filteredProfiles = [];
      let allBusinesses;
      allBusinesses = this.firestore.collection<IUser>('businesses', (ref) =>
        ref.where('county', '==', location).orderBy(sort, 'desc')
      );
      return allBusinesses.valueChanges();
    }
    // if type + rating were selected
    else if (
      sort === 'rating' &&
      busType !== 'default' &&
      location === 'default'
    ) {
      this.filteredProfiles = [];
      let allBusinesses;
      allBusinesses = this.firestore.collection<IUser>('businesses', (ref) =>
        ref.where('businessType', '==', busType).orderBy(sort, 'desc')
      );
      return allBusinesses.valueChanges();
    }
    // if only rating was selected
    else if (
      sort === 'rating' &&
      busType === 'default' &&
      location === 'default'
    ) {
      this.filteredProfiles = [];
      let allBusinesses;
      allBusinesses = this.firestore.collection<IUser>('businesses', (ref) =>
        ref.where('profileCreated', '==', 'true').orderBy(sort, 'desc')
      );
      return allBusinesses.valueChanges();
    }
    // if only price was selected
    else if (
      sort === 'price' &&
      busType === 'default' &&
      location === 'default'
    ) {
      this.filteredProfiles = [];
      let allBusinesses;
      allBusinesses = this.firestore.collection<IUser>('businesses', (ref) =>
        ref.where('profileCreated', '==', 'true').orderBy(sort, 'asc')
      );
      return allBusinesses.valueChanges();
    }
    // if none were selected
    else if (
      sort === 'default' &&
      busType === 'default' &&
      location === 'default'
    ) {
      this.filteredProfiles = [];
      let allBusinesses;
      allBusinesses = this.firestore.collection<IUser>('businesses', (ref) =>
        ref.where('profileCreated', '==', 'true')
      );
      return allBusinesses.valueChanges();
    }
  }
}
