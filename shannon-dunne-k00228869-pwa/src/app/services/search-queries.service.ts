import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { IBusiness } from '../interfaces/i-business';

@Injectable({
  providedIn: 'root',
})
export class SearchQueriesService {
  public filteredProfiles: IBusiness['business'][];
  constructor(public firestore: AngularFirestore) {}

  // public getAllBusinessUsers() // get all businesses with a profile
  // {
  //   let allBusinesses;
  //   allBusinesses = this.firestore.collection<IBussiness>('businesses', ref => ref
  //   .where('profileCreated', '==', 'true').limit(20));
  //   return allBusinesses.valueChanges();
  // }

  public checkQuery(
    location: string,
    busType: string,
    sort: string
  ): Observable<IBusiness['business'][]> {
    // if busType and location were selected with rating
    if (sort === 'rating' && location !== 'default' && busType !== 'default') {
      this.filteredProfiles = [];
      console.log('query rating + loc + type');
      let allBusinesses;
      allBusinesses = this.firestore.collection<IBusiness>('businesses', (ref) =>
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
      allBusinesses = this.firestore.collection<IBusiness>('businesses', (ref) =>
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
      allBusinesses = this.firestore.collection<IBusiness>('businesses', (ref) =>
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
      allBusinesses = this.firestore.collection<IBusiness>('businesses', (ref) =>
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
      allBusinesses = this.firestore.collection<IBusiness>('businesses', (ref) =>
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
      allBusinesses = this.firestore.collection<IBusiness>('businesses', (ref) =>
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
      allBusinesses = this.firestore.collection<IBusiness>('businesses', (ref) =>
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
      allBusinesses = this.firestore.collection<IBusiness>('businesses', (ref) =>
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
      allBusinesses = this.firestore.collection<IBusiness>('businesses', (ref) =>
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
      allBusinesses = this.firestore.collection<IBusiness>('businesses', (ref) =>
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
      allBusinesses = this.firestore.collection<IBusiness>('businesses', (ref) =>
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
      allBusinesses = this.firestore.collection<IBusiness>('businesses', (ref) =>
        ref.where('profileCreated', '==', 'true')
      );
      return allBusinesses.valueChanges();
    }
  }
}
