import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, HostListener } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { NotificationsService } from './services/notifications.service';
import {MatSnackBar} from '@angular/material/snack-bar';

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
    private swPush: SwPush,
    private notif: NotificationsService,
    private snackBar: MatSnackBar
    ) {}

ngOnInit(){
  // this.notif.getPushSubcriber().subscribe(
  //   console.log()
  // );

  this.swPush.messages.subscribe((message) => console.log(message));

  // this.swPush.notificationClicks.subscribe( // triggered when notification is clicked
  //   ({action, notification}) => {
  //     window.open(notification.data.url); // open url when clicked
  //   }
  // )

}

  pushSub() // called when notification clicked
  {

    if (!this.swPush.isEnabled)// if it is not enabled
    {
      console.log('notifications are not enabled');
      return;
    }
    this.swPush.requestSubscription({serverPublicKey: this.VAPID_PUBLIC_KEY,
    }).then(subOj => 
      {
        console.log(JSON.stringify(subOj));
        this.notif.addPushSubscriber(subOj);
      })
    .catch((err) => console.log(err));

  // this.swPush.requestSubscription({serverPublicKey: this.VAPID_PUBLIC_KEY}) // ask for permission
  //     .then(pushSub => {
  //       this.notif.addPushSubscriber(pushSub).subscribe( result => {
  //         console.log('[App] Add subscribe request result', result);
  //         let theSubscription = pushSub.toJSON();
  //         console.log(theSubscription);
  //         let snackbarRef = this.snackBar.open('You will recieve appointment reminders', null);
  //       });
  //     })// subscription object passed if allowed, send to server
  //     .catch(err => console.error('could not sub to notificatiosn', err));
  //   // }
  }


  

downloadApp()
{
    // hide download button
    this.showButton = false;
    // Show prompt
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

    // if (Notification.permission === 'denied' || Notification.permission === 'default') // check notif permission state
    // {
    //   console.log('not accepted');
    // }
    // else {
      //// await Notification.requestPermission();
  //}

  // this.swPush.notificationClicks.subscribe(
  //   ({action, notification}) => {
  //       // Do something in response to notification click.
  //   });