import { Component, HostListener } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { NotificationsService } from './services/notifications.service';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { UploadsService } from './services/uploads.service';
import { Router, Event, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  readonly VAPID_PUBLIC_KEY =
    'BHLXzuFGiUtzg-cDCs7T2Eplpr63G7KCaBwFD1ibrlzi-nbrDzcVpDqVjbx3us4BmxZk4j6FXX3m8eDjs-QtvNY';
  title = 'SelfCare';
  deferredPrompt: any;
  message;
  showButton = false;
  routeHidden = true;

  // horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  // verticalPosition: MatSnackBarVerticalPosition = 'top';

  // install prompt event listener
  @HostListener('window:beforeinstallprompt', ['$event'])
  onbeforeinstallprompt(e) {
    // console.log(e);
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
    private router: Router
  ) {}

  ngOnInit() {
    this.notif.getToken().subscribe((data) => { // call func to get user token from db
      if (!data) { // if no token available
        this.askPermis(); // call func to get user permis
      }
    });

    this.listenForMessage();
    this.message = this.notif.currentMessage;

    this.router.events.subscribe((e) => { // check route url
      if (e instanceof NavigationStart) { // to show/hide component
        if (e.url === '/') {
          this.routeHidden = false;
        } else {
          this.routeHidden = true;
        }
      }
    });
  }

//   openSnackBar()
// {
//   this.snackBar.open(
//     notification.title,
//      notification.body,
//   {
//     direction:
//     duration: 2000,
//     horizontalPosition: center,
//     verticalPosition: top,
//   });

  askPermis() { // called when notification clicked
    this.notif.requestPermission().subscribe(
      // call func to get/store notification permission
      async (token) => {
        message: 'token received';
        duration: 2000;
      }
    );
  }

  listenForMessage() {
    this.notif.receiveMessages();
    //.subscribe(async (msg: any) => {
      // console.log('NEW MESSAGE', msg);
      // header: msg.notification.title,
      // subHeader: msg.notification.body,
    //});
  }

  downloadApp() { // when download button is clicked
    // hide download button
    this.showButton = false;
    // Show prompt
    // console.log('theStashed response', this.deferredPrompt);
    this.deferredPrompt.prompt();
    // Wait for user to response
    this.deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted add prompt');
      } else {
        console.log('User dismissed add prompt');
      }
      this.deferredPrompt = null;
    });
  }



  

}







