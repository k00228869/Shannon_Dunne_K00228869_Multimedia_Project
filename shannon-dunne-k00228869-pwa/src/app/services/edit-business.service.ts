import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { from } from 'rxjs';
import { IBusiness } from '../interfaces/i-business';
import { IUser } from '../interfaces/i-user';

@Injectable({
  providedIn: 'root',
})
export class EditBusinessService {
  constructor(private firestore: AngularFirestore) {}

  // update the businesses profile details with the object passed in
  public updateBusiness(updatedProfile) {
    // get user data from local storage
    let theUser = JSON.parse(localStorage.getItem('user'));
    return from(
      this.firestore
        .collection<IBusiness>('businesses')
        .doc<IBusiness['business']>(theUser.uid)
        .update({
          // update doc with new profile data
          businessName: updatedProfile.businessName,
          businessDescription: updatedProfile.businessDescription,
          eircode: updatedProfile.eircode,
          county: updatedProfile.county,
          businessType: updatedProfile.businessType,
          reminderMessage: updatedProfile.reminderMessage,
          cancellationPolicy: updatedProfile.cancellationPolicy,
        })
    );
  }

  // this would have been used to update the business services after they have been edited
  // public updateServices(
  //   adService: IUser['service']
  // ) {
  //   let theUser = JSON.parse(localStorage.getItem('user'));
  //   return from(
  //     this.firestore
  //       .collection('users')
  //       .doc<IUser['user']>(theUser.uid)
  //       .collection<IUser>('services')
  //       .doc<IUser['service']>(adService.id)
  //       .update(adService)
  //   );
  // }

  // this would have been used to update the businesses employees after they have been edited
  // public updateEmployees(
  //   adEmployee: IUser['employee'] // add business' employees
  // ) {
  //   let theUser = JSON.parse(localStorage.getItem('user'));
  //   return from(
  //     this.firestore
  //       .collection('users')
  //       .doc<IUser['user']>(theUser.uid)
  //       .collection<IUser>('employees')
  //       .doc<IUser['employee']>(adEmployee.id)
  //       .update(adEmployee)
  //   );
  // }
}
