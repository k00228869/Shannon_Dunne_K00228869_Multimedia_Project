import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { IUser } from '../i-user';

@Injectable({
  providedIn: 'root'
})
export class EditBusinessService {
  constructor(
    private firestore: AngularFirestore
  ) { }

  public updateBusiness(updatedProfile)
  {
    let theUser = JSON.parse(localStorage.getItem('user'));
    return from(this.firestore.collection('businesses')
    .doc<IUser['business']>(theUser.uid).update({
      businessName: updatedProfile.businessName,
      businessDescription: updatedProfile.businessDescription,
      eircode: updatedProfile.eircode,
      county: updatedProfile.county,
      businessType: updatedProfile.businessType,
      reminderMessage: updatedProfile.reminderMessage,
      cancellationPolicy: updatedProfile.cancellationPolicy
    }));
  }



  // public updateHours(selectedHours) // add a business' hours to the db
  // {
  //   let theUser = JSON.parse(localStorage.getItem('user'));
  //   return from (this.firestore.collection<IUser>('users')
  //   .doc<IUser['user']>(theUser.uid)
  //   .collection<IUser>('hours')
  //   .doc<IUser['hours']>('theHours')
  //   .update(Object.assign({}, selectedHours))); // add user to the db
  // }

  // public updateBusiness(newProfile: IUser['business']) // add a businesses details to the db
  // {
  //   let theUser = JSON.parse(localStorage.getItem('user'));
  //   newProfile.id = theUser.uid;
  //   return from (this.firestore.collection<IUser>('businesses')
  //   .doc<IUser['business']>(newProfile.id).update(newProfile));
  // }

  public updateServices(adService: IUser['service']) // add business' services
{
    let theUser = JSON.parse(localStorage.getItem('user'));
    return from (this.firestore.collection('users')
    .doc<IUser['user']>(theUser.uid)
    .collection<IUser>('services')
    .doc<IUser['service']>(adService.id)
    .update(adService));
  }

  public updateEmployees(adEmployee: IUser['employee']) // add business' employees
{
    let theUser = JSON.parse(localStorage.getItem('user'));
    return from (this.firestore.collection('users')
    .doc<IUser['user']>(theUser.uid)
    .collection<IUser>('employees')
    .doc<IUser['employee']>(adEmployee.id)
    .update(adEmployee));
  }
}
