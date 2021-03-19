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


  public addReview(submittedFeedback: IUser['review'], id: string) // add review to business profile
  {
    return from(this.firestore.collection<IUser>('users').doc<IUser['user']>(id)
    .collection<IUser['review']>('reviews').add(submittedFeedback));
  }

  public getBusinessReviews(id: string) // get reviews for the selected business profile
  {
    return this.firestore.collection<IUser>('users').doc<IUser['user']>(id)
    .collection<IUser['review']>('reviews').valueChanges();
  }

  public getReviews() // get a business user's reviews
  {
    let theUser = JSON.parse(localStorage.getItem('user'));
    return this.firestore.collection<IUser>('users').doc<IUser['user']>(theUser.uid)
    .collection<IUser['review']>('reviews').valueChanges();
  }

  public addReply(submittedReply: IUser['review'], id: string)
  {
    let theUser = JSON.parse(localStorage.getItem('user'));
    return from(this.firestore.collection<IUser>('users').doc<IUser['user']>(theUser.uid)
    .collection<IUser['review']>('reviews').doc(id).update({
      reply: submittedReply.reply
    }));
  }
}
