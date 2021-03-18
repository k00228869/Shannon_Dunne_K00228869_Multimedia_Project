import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { from } from 'rxjs';
import { IUser } from '../i-user';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(
    private firestore: AngularFirestore
  ) { }


  public addReview(submittedFeedback: IUser['review'], id: string)
  {
    return from(this.firestore.collection<IUser>('users').doc<IUser['user']>(id)
    .collection<IUser['review']>('reviews').add(submittedFeedback));

  }



  public getReviews(submittedFeedback: IUser['review'], id: string)
  {
    return this.firestore.collection<IUser>('users').doc<IUser['user']>(id)
    .collection<IUser['review']>('reviews').valueChanges();

  }
}
