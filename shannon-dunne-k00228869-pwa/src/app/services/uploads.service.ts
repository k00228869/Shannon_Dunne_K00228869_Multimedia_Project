import { Injectable } from '@angular/core';
import { map, finalize } from 'rxjs/operators';
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
    private firestore: AngularFirestore,
  ) {}

  // uploadEmployeeImage = (event) => {
  //   const imgId = Math.random().toString(36).substring(2); // create random image id
  //   this.employeeRef = this.imgStorage.ref('/images/employees/' + imgId); // create reference path to storage bucket
  //   this.task = this.employeeRef.put(event.target.files[0]); // create an uploadtask to upload img
  //   this.uploadProgress = this.task.snapshotChanges() // return state, download url from uploadprogress
  //   .pipe(map (s => (s.bytesTransferred / s.totalBytes) * 100))

  //   this.uploadProgress = this.task.percentageChanges(); // observe progress of upload
  //   this.task.snapshotChanges().pipe(  // getDownloadURL prevents having to bind to uploadProgress in UI, as it will show the progress
  //   finalize(() => {
  //     this.downloadURL = this.employeeRef.getDownloadURL(); // notify when url is available
  //     this.downloadURL.subscribe(url => (this.empURL = url.toString()));
  //     console.log(this.empURL);
  //     console.log(this.downloadURL);
  //     this.uploadState = this.task.snapshotChanges().pipe(map(s => s.state));
  //   })).subscribe();
  //  }

  // uploadProfileImages = (event) => {
  //   let theUser = JSON.parse(localStorage.getItem('user'));
  //   if (event) {
  //     // let list = event.target.files;
  //     // tslint:disable-next-line: prefer-for-of
  //     for (let i = 0; i === event.target.files.length; i++) {
  //       const imgId = Math.random().toString(36).substring(2); // create image id
  //       this.businessRef = this.imgStorage.ref(
  //         '/images/business/' + theUser.uid + imgId
  //       ); // create reference path to storage bucket
  //       this.groupTask = this.businessRef.put(event.target.files[i]); // upload to storage reference path

  //       this.uploadGroupProgress = this.groupTask
  //         .snapshotChanges() // return state from upload progress
  //         .pipe(map((s) => (s.bytesTransferred / s.totalBytes) * 100));

  //       this.uploadGroupProgress = this.groupTask.percentageChanges(); // return current progress
  //       this.groupTask
  //         .snapshotChanges()
  //         .pipe(
  //           finalize(() => {
  //             this.uploadGroupState = this.groupTask
  //             .snapshotChanges()
  //             .pipe(map((s) => s.state));
  //             this.downloadAllURL = this.businessRef.getDownloadURL(); // store download url
  //             this.downloadAllURL.subscribe((url) => {
  //               this.url = url;
  //               // this.busURL = url.toString();
  //               this.images.push(this.url); // push image url to array of urls
  //             });
  //           })
  //         ).subscribe();
  //     }
  //   }
  // }


  uploadBusinessImages = (event) =>
  {
    this.uploads = [];
    const fileList = event.target.files;
    const percentAll: Observable<number>[] = [];

    for (let file of fileList)
    {
      const randomId = Math.random().toString(36).substring(2);
      const ref = this.imgStorage.ref('/images/' + randomId);
      const task = ref.put(file);
      const percentage = task.percentageChanges();
      percentAll.push(percentage);

      const uploadProgress = {
        name: file.name,
        percent: percentage,
      };

      this.uploads.push(uploadProgress);
      const checkTask = task.then((f) => {
        return f.ref.getDownloadURL().then((url) => {
        this.images.push(url);
        });
      });
    }
  }

  // get images for landing page slideshow
  getSlideshow(): Observable<string[]>
  {
    return this.firestore
      .collection<string[]>('appImages')
      .doc('slideshow')
      .valueChanges();
  }

  // get images for business page slideshow
  getBusinessSlideshow(id: string): Observable<IUser['slides']> {
    return this.firestore
    .collection('users')
    .doc<IUser['user']>(id)
    .collection<IUser>('images')
    .doc<IUser['slides']>('images')
    .valueChanges();
  }

  // store images for business page slideshow
  public storeBusinessImages(): Observable<void> {
    let theUser = JSON.parse(localStorage.getItem('user'));

    this.profileImages.imageURL = this.images;
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
