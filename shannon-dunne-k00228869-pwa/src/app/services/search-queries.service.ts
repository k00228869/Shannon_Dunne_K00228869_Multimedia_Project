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

  // this function checks the type of data passed
  // in a queries the business collection based on the data
  public checkQuery(
    location: string,
    busType: string,
    sort: string
  ): Observable<IBusiness['business'][]> {
    // if busType and location were selected with rating
    if (sort === 'rating' && location !== 'default' && busType !== 'default') {
      this.filteredProfiles = []; // clear business list
      console.log('query rating + loc + type');
      let allBusinesses;
      allBusinesses = this.firestore.collection<IBusiness>(
        'businesses',
        (ref) =>
          ref
            .where('county', '==', location) // get bus with this location
            .where('businessType', '==', busType) // and this business type
            .orderBy(sort, 'desc') // sort the docs from highest to lowest rating
      );
      return allBusinesses.valueChanges(); // return business
    }
    // if busType and location were selected with price
    else if (
      sort === 'price' &&
      location !== 'default' &&
      busType !== 'default'
    ) {
      this.filteredProfiles = []; // clear business list
      console.log('query price + loc + type');
      let allBusinesses;
      allBusinesses = this.firestore.collection<IBusiness>(
        'businesses',
        (ref) =>
          ref
            .where('county', '==', location)
            .where('businessType', '==', busType)
            .orderBy(sort, 'asc') // sort docs from lowest to highest price point
      );
      return allBusinesses.valueChanges(); // return business docs
    }
    // if only busType and location were selected
    else if (
      sort === 'default' &&
      location !== 'default' &&
      busType !== 'default'
    ) {
      this.filteredProfiles = []; // clear business list
      console.log('just query location and type');
      let allBusinesses;
      allBusinesses = this.firestore.collection<IBusiness>(
        'businesses',
        (ref) =>
          ref
            .where('county', '==', location)
            .where('businessType', '==', busType)
      );
      return allBusinesses.valueChanges(); // return business
    }
    // if only busType was selected
    else if (
      sort === 'default' &&
      location === 'default' &&
      busType !== 'default'
    ) {
      this.filteredProfiles = []; // clear business list
      console.log('just query type');
      let allBusinesses;
      allBusinesses = this.firestore.collection<IBusiness>(
        'businesses',
        (ref) => ref.where('businessType', '==', busType)
      );
      return allBusinesses.valueChanges(); // return business
    }
    // if only location was selected
    else if (
      sort === 'default' &&
      busType === 'default' &&
      location !== 'default'
    ) {
      this.filteredProfiles = []; // clear business list
      console.log('just query loc');
      let allBusinesses;
      allBusinesses = this.firestore.collection<IBusiness>(
        'businesses',
        (ref) => ref.where('county', '==', location)
      );
      return allBusinesses.valueChanges(); // return business
    }
    // if location + price were selected
    else if (
      sort === 'price' &&
      busType === 'default' &&
      location !== 'default'
    ) {
      this.filteredProfiles = []; // clear business list
      console.log('just query price + location called');
      let allBusinesses;
      allBusinesses = this.firestore.collection<IBusiness>(
        'businesses',
        (ref) => ref.where('county', '==', location).orderBy(sort, 'asc') // sort the docs from lowest to highest price
      );
      return allBusinesses.valueChanges(); // return business
    }
    // if type + price were selected
    else if (
      sort === 'price' &&
      busType !== 'default' &&
      location === 'default'
    ) {
      this.filteredProfiles = []; // clear business list
      let allBusinesses;
      allBusinesses = this.firestore.collection<IBusiness>(
        'businesses',
        (ref) => ref.where('businessType', '==', busType).orderBy(sort, 'asc') // sort the docs from lowest to highest price
      );
      return allBusinesses.valueChanges(); // return business
    }
    // if location + rating were selected
    else if (
      sort === 'rating' &&
      busType === 'default' &&
      location !== 'default'
    ) {
      this.filteredProfiles = []; // clear business list
      let allBusinesses;
      allBusinesses = this.firestore.collection<IBusiness>(
        'businesses',
        (ref) => ref.where('county', '==', location).orderBy(sort, 'desc') // sort docs from highest to lowest rating
      );
      return allBusinesses.valueChanges(); // return business
    }
    // if type + rating were selected
    else if (
      sort === 'rating' &&
      busType !== 'default' &&
      location === 'default'
    ) {
      this.filteredProfiles = []; // clear business list
      let allBusinesses;
      allBusinesses = this.firestore.collection<IBusiness>(
        'businesses',
        (ref) => ref.where('businessType', '==', busType).orderBy(sort, 'desc') // sort docs from highest to lowest rating
      );
      return allBusinesses.valueChanges(); // return business
    }
    // if only rating was selected
    else if (
      sort === 'rating' &&
      busType === 'default' &&
      location === 'default'
    ) {
      this.filteredProfiles = []; // clear business list
      let allBusinesses;
      allBusinesses = this.firestore.collection<IBusiness>(
        'businesses',
        (ref) => ref.where('profileCreated', '==', 'true').orderBy(sort, 'desc') // sort docs from highest to lowest rating
      );
      return allBusinesses.valueChanges(); // return business
    }
    // if only price was selected
    else if (
      sort === 'price' &&
      busType === 'default' &&
      location === 'default'
    ) {
      this.filteredProfiles = []; // clear business list
      let allBusinesses;
      allBusinesses = this.firestore.collection<IBusiness>(
        'businesses',
        (ref) => ref.where('profileCreated', '==', 'true').orderBy(sort, 'asc') // sort docs from lowest to highest price point
      );
      return allBusinesses.valueChanges(); // return business
    }
    // if none were selected
    else if (
      sort === 'default' &&
      busType === 'default' &&
      location === 'default'
    ) {
      this.filteredProfiles = []; // clear business list
      let allBusinesses;
      allBusinesses = this.firestore.collection<IBusiness>(
        'businesses',
        (ref) => ref.where('profileCreated', '==', 'true') // get all business docs
      );
      return allBusinesses.valueChanges(); // return business
    }
  }
}
