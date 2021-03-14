import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, HostListener } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { NotificationsService } from './services/notifications.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { UploadsService } from './services/uploads.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

readonly VAPID_PUBLIC_KEY = 'BHLXzuFGiUtzg-cDCs7T2Eplpr63G7KCaBwFD1ibrlzi-nbrDzcVpDqVjbx3us4BmxZk4j6FXX3m8eDjs-QtvNY';
  title = 'SelfCare';
  deferredPrompt: any;
  showButton = false;
  slides: string[] = [];

  // install prompt event listener
  @HostListener('window:beforeinstallprompt', ['$event'])
  onbeforeinstallprompt(e) {
    console.log(e);
    // Prevent Chrome 67 from automatically showing prompt
    e.preventDefault();
    // Stash the event so it can be triggered later.
    this.deferredPrompt = e;
    this.showButton = true;
  }

  constructor(
    private readonly swPush: SwPush,
    private notif: NotificationsService,
    private snackBar: MatSnackBar,
    private uploads: UploadsService
    ) {}

ngOnInit(){
  this.notif.getToken().subscribe(
    (data) =>
    {
      if (!data)
      {
        this.askPermis();
      }
    }
  );

  this.uploads.getSlideshow().subscribe(
    (data) => {
      this.slides = Object.values(data);
    });
}


  askPermis() // called when notification clicked
  {
    this.notif.requestPermission().subscribe( // call func to get/store notification permission
      async token => {
        message: 'token received'
        duration: 2000

      });
  }

  listenForMessage()
  {
    this.notif.getMessages().subscribe(async (msg: any) => {
      console.log('NEW MESSAGE', msg);
      // header: msg.notification.title,
      // subHeader: msg.notification.body,
    });
  }

  downloadApp() // when download button is clicked
  {
      // hide download button
      this.showButton = false;
      // Show prompt
      console.log('theStashed response', this.deferredPrompt);
      this.deferredPrompt.prompt();
      // Wait for user to response
      this.deferredPrompt.userChoice
      .then((choiceResult) => {
        if (choiceResult.outcome === 'accepted')
        {
          console.log('User accepted add prompt');
        } else
        {
          console.log('User dismissed add prompt');
        }
        this.deferredPrompt = null;
      });
  }
}



