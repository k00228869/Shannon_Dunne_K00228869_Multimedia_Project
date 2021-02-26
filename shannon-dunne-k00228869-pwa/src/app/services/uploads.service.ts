import { Injectable } from '@angular/core';
import { map, finalize } from 'rxjs/operators';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { IUser } from '../i-user';
import { BusinessService } from './business.service';

@Injectable({
  providedIn: 'root'
})
export class UploadsService {
  // employeeRef: AngularFireStorageReference;
  // uploadState: Observable<string>;
  // uploadProgress: Observable<number>;
  // task: AngularFireUploadTask;
  // downloadURL: Observable<string>;
  // public empURL: string;

  businessRef: AngularFireStorageReference;
  uploadGroupProgress: Observable<number>;
  uploadGroupState: Observable<string>;
  downloadAllURL: Observable<string>;
  groupTask: AngularFireUploadTask;
  public busURL: string;
  imgURL: string;
  public profileImages: IUser['slides'];
  // public profileImages: IUser['slides'] = {
  //   imageUrl: string;
  // };

  images: string[] = [];



  constructor(
    private imgStorage: AngularFireStorage,
    public business: BusinessService,
    ) { }


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


  uploadProfileImages = (event) =>
  {
    if (event)
    {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < event.target.files.length; i++)
    {
      const imgId = Math.random().toString(36).substring(2); // create random image id
      this.businessRef = this.imgStorage.ref('/images/business/' + imgId); // create reference path to storage bucket
      this.groupTask = this.businessRef.put(event.target.files[i]);
      this.uploadGroupProgress = this.groupTask.snapshotChanges() // return state, download url from uploadprogress
      .pipe(map (s => (s.bytesTransferred / s.totalBytes) * 100));

      this.uploadGroupProgress = this.groupTask.percentageChanges(); // return current progress
      this.groupTask.snapshotChanges().pipe(
        finalize(async () => {
          this.downloadAllURL = this.businessRef.getDownloadURL(); // notify when url is available
          this.downloadAllURL.subscribe((url) => {
            console.log('returnedurl', url);
            // this.busURL = url.toString();
            this.images.push(url);
            // console.log('theUrl', this.downloadAllURL);
            this.uploadGroupState = this.groupTask.snapshotChanges().pipe(map(s => s.state));
          });
          // console.log('insidefor', this.images);
        })).subscribe();
    }
    console.log('outsidefor', this.images);
   }
  }



  addUrl(images: string[])
  {
    // tslint:disable-next-line: no-unused-expression
    Object.keys(this.images).length;
    let key, count = 0;
    for (key in this.images)
    {
      if (this.images.hasOwnProperty(key))
      {
        this.profileImages.imageURL = this.images[key];
        this.business.addImages(this.profileImages);

      }
    }

  }
}
