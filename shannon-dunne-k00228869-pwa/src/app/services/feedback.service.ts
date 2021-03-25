import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
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
    .collection<IUser['review']>('reviews').doc(submittedFeedback.id).set(submittedFeedback));
  }

  public getBusinessReviews(id: string) // get reviews for the selected business profile
  {
    return this.firestore.collection<IUser>('users').doc<IUser['user']>(id)
    .collection<IUser['review']>('reviews').valueChanges();
  }

  public averageRating(sum: number, bid: string)
  {
    console.log('adding rating to bus doc');
    return from(this.firestore.collection<IUser>('businesses')
    .doc<IUser['business']>(bid).update({
      rating: sum
    }));

  }

  // public someReviews(uid: string): Observable<IUser['review'][]> // get reviews with reply value
  // {
  //   let docRef = this.firestore.collection<IUser>('users').doc<IUser['user']>(uid)
  //   .collection<IUser['review']>('reviews', ref => ref.orderBy('rewiews.${reply}'));
  //   return docRef.valueChanges();
  // }

  public completeReview(id: string) // get reviews that have a reply
  {
    let docRef = this.firestore.collection<IUser>('users').doc<IUser['user']>(id)
    .collection<IUser['review']>('reviews', ref => ref.where('reply', '!=', 'null'));
    return docRef.valueChanges();
  }

  public someReviews(uid: string)
  {
    let docRef = this.firestore.collection<IUser>('users').doc<IUser['user']>(uid)
    .collection<IUser['review']>('reviews', ref => ref.where('reply', '==', null));
    return docRef.valueChanges();
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
