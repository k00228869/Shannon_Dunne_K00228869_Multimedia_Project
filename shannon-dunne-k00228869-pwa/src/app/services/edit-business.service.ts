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
    .doc(theUser.uid).update({
      businessName: updatedProfile.businessName,
      businessDescription: updatedProfile.businessDescription,
      eircode: updatedProfile.eircode,
      county: updatedProfile.county,
      businessType: updatedProfile.businessType,
      reminderMessage: updatedProfile.reminderMessage,
      cancellationPolicy: updatedProfile.cancellationPolicy
    }));
  }
}
