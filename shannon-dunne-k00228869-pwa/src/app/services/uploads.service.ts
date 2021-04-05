import { Injectable } from '@angular/core';
import {
  AngularFireStorage,
  AngularFireStorageReference,
  AngularFireUploadTask,
} from '@angular/fire/storage';
import { from, Observable } from 'rxjs';
import { IUser } from '../interfaces/i-user';
import { BusinessService } from './business.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class UploadsService {
  businessRef: AngularFireStorageReference;
  uploadGroupProgress: Observable<number>;
  uploadGroupState: Observable<string>;
  downloadAllURL: Observable<string>;
  groupTask: AngularFireUploadTask;
  public busURL: string;
  imgURL: string;
  profileImages: IUser['slides'] = {};
  slides = {};
  url: string;
  images: string[] = [];
  uploads: any[];
  percentAll: Observable<any>;
  files: Observable<any>;
  constructor(
    private imgStorage: AngularFireStorage,
    public business: BusinessService,
    private firestore: AngularFirestore
  ) {}

  // event passed in when image upload button is selected in add bsuiness form
  uploadBusinessImages = (event) => {

    this.uploads = [];
    const fileList = event.target.files; // store files
    const percentAll: Observable<number>[] = [];

    // loop through files
    for (let file of fileList) {
      // give each an id
      const randomId = Math.random().toString(36).substring(2);
      // set the storage upload path
      const ref = this.imgStorage.ref('/images/' + randomId);
      // upload the file
      const task = ref.put(file);
      // get the upload percent
      const percentage = task.percentageChanges();
      // add the percentage to the array
      percentAll.push(percentage);

      // progress obj
      const uploadProgress = {
        name: file.name,
        percent: percentage,
      };
      // add progress obj to uploads array
      this.uploads.push(uploadProgress);
      const checkTask = task.then((f) => {
        // return the download url of the img
        return f.ref.getDownloadURL().then((url) => {
          // add the img download url to the array that holds all the urls
          this.images.push(url);
        });
      });
    }
  };

  // get the images for the landing page slideshow from the slideshow collection
  getSlideshow(): Observable<string[]> {

    return this.firestore
      .collection<string[]>('appImages')
      .doc('slideshow')
      .valueChanges();
  }

  // get images for the business page slideshow from the businesses images collection
  getBusinessSlideshow(id: string): Observable<IUser['slides']> {

    return this.firestore
      .collection('users')
      .doc<IUser['user']>(id)
      .collection<IUser>('images')
      .doc<IUser['slides']>('images')
      .valueChanges();
  }

  // store the images for the business page slideshow in the slides images collection
  public storeBusinessImages(): Observable<void> {

    // get the user data from local storage
    let theUser = JSON.parse(localStorage.getItem('user'));
    this.profileImages.imageURL = this.images; // store the array of urls
    // add doc to collection
    return from(
      this.firestore
        .collection('users')
        .doc<IUser['user']>(theUser.uid)
        .collection<IUser>('images')
        .doc<IUser['slides']>('images')
        .set(this.profileImages)
    );
  }
}
