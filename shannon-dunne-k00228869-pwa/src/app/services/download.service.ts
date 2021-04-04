import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class DownloadService {
  public uid: string;
  showButton = false;
  deferredPrompt: any;

  constructor(public firestore: AngularFirestore) {}

  // function to download the application to homescreen,
  //cthis is triggered on the landing age
  downloadApp() {
    // when download button is clicked hide download button
    this.showButton = false;
    // Show download prompt
    this.deferredPrompt.prompt();
    // Wait for user to respond to prompt
    this.deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted add prompt');
      } else {
        console.log('User dismissed add prompt');
      }
      this.deferredPrompt = null; // empty prompt
    });
  }
}
