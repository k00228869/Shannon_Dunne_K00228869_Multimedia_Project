import { Injectable } from '@angular/core';
import { map, finalize } from 'rxjs/operators';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadsService {
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  groupTask: AngularFireUploadTask;
  downloadURL: Observable<string>;
  uploadState: Observable<string>;
  uploadProgress: Observable<number>;
  public url: string;
  profileImages: string[];

  constructor( private imgStorage: AngularFireStorage) { }
  uploadEmployeeImage = (event) => {
    const imgId = Math.random().toString(36).substring(2); // create random image id
    this.ref = this.imgStorage.ref('/images/employees/' + imgId); // create reference path to storage bucket
    this.task = this.ref.put(event.target.files[0]); // create an uploadtask to upload img
    this.uploadProgress = this.task.snapshotChanges() // return state, download url from uploadprogress
    .pipe(map (s => (s.bytesTransferred / s.totalBytes) * 100))

    this.uploadProgress = this.task.percentageChanges(); // observe progress of upload
    this.task.snapshotChanges().pipe(  // getDownloadURL prevents having to bind to uploadProgress in UI, as it will show the progress
    finalize(() => {
      this.downloadURL = this.ref.getDownloadURL(); // notify when url is available
      this.downloadURL.subscribe(url => (this.url = url.toString()));
      console.log(this.url);
      console.log(this.downloadURL);
      this.uploadState = this.task.snapshotChanges().pipe(map(s => s.state));
    })).subscribe();
   }


   uploadProfileImages = (event) =>
   {
     for(let i = 0; i < event.target.files.length; i++)
     {
      const imgId = Math.random().toString(36).substring(2); // create random image id
      this.ref = this.imgStorage.ref('/images/business/' + imgId); // create reference path to storage bucket
      this.groupTask = this.ref.put(event.target.files[i]);

      this.uploadProgress = this.groupTask.snapshotChanges() // return state, download url from uploadprogress
      .pipe(map (s => (s.bytesTransferred / s.totalBytes) * 100));
      this.uploadProgress = this.groupTask.percentageChanges(); // observe progress of upload

      this.groupTask.snapshotChanges().pipe(
         finalize(() => {
           this.downloadURL = this.ref.getDownloadURL(); // notify when url is available
           this.downloadURL.subscribe(url => (this.url = url.toString()));
           console.log(this.url);
           console.log(this.downloadURL);
           this.uploadState = this.groupTask.snapshotChanges().pipe(map(s => s.state));
           this.profileImages.push(this.url);
         })).subscribe();
     }
   }
}
