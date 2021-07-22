import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { from } from 'rxjs';
import { IBusiness } from '../interfaces/i-business';
import { IUser } from '../interfaces/i-user';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  constructor(private firestore: AngularFirestore) {}

  // add review to business profile with poassed in id
  public addReview(submittedFeedback: IUser['review'], id: string) {
    return from(
      this.firestore
        .collection<IUser>('users')
        .doc<IUser['user']>(id)
        .collection<IUser['review']>('reviews')
        .doc(submittedFeedback.id)
        .set(submittedFeedback)
    );
  }

  // get reviews collection for the selected business profile
  public getBusinessReviews(id: string) {
    return this.firestore
      .collection<IUser>('users')
      .doc<IUser['user']>(id)
      .collection<IUser['review']>('reviews')
      .valueChanges();
  }

  // update the businesses profile doc with their average rating
  public averageRating(sum: number, bid: string) {
    return from(
      this.firestore
        .collection<IBusiness>('businesses')
        .doc<IBusiness['business']>(bid)
        .update({
          rating: sum,
        })
    );
  }

  // get the business's review docs that have a reply value other than null
  public completeReview(id: string) {
    let docRef = this.firestore
      .collection<IUser>('users')
      .doc<IUser['user']>(id)
      .collection<IUser['review']>('reviews', (ref) =>
        ref.where('reply', '!=', 'null')
      );
    return docRef.valueChanges(); // return docs with a null reply
  }

  // get a businesses review docs where reply is set to null
  public someReviews(uid: string) {
    let docRef = this.firestore
      .collection<IUser>('users')
      .doc<IUser['user']>(uid)
      .collection<IUser['review']>('reviews', (ref) =>
        ref.where('reply', '==', null)
      );
    return docRef.valueChanges(); // return docs with null reply
  }

  // get a business user's reviews
  public getReviews() {
    // get the users data from localstorage
    let theUser = JSON.parse(localStorage.getItem('user'));
    return this.firestore
      .collection<IUser>('users')
      .doc<IUser['user']>(theUser.uid)
      .collection<IUser['review']>('reviews')
      .valueChanges(); // returns the entire review collection for a business
  }

  // adds a reply value to the reply field of a review doc
  public addReply(submittedReply: IUser['review'], id: string) {
    // get the user data from local storage
    let theUser = JSON.parse(localStorage.getItem('user'));
    return from(
      this.firestore
        .collection<IUser>('users')
        .doc<IUser['user']>(theUser.uid)
        .collection<IUser['review']>('reviews')
        .doc(id)
        .update({
          reply: submittedReply.reply
        })
    );
  }
}
