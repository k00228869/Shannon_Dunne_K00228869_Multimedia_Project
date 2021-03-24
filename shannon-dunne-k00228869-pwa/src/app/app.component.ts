import { Component, HostListener } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { NotificationsService } from './services/notifications.service';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { UploadsService } from './services/uploads.service';
import { Router, Event, NavigationStart } from '@angular/router';
import { ToastService } from './services/toast.service';

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
  message; // TO DO: set tempplate design with this variable
  showButton = false;
  routeHidden = true;

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
    private router: Router,
    private toast: ToastService
  ) {}

  ngOnInit() {
    // this.notif.receiveMessages();
    this.message = this.notif.currentMessage;
    this.router.events.subscribe((e) => { // check route url and subscribe to receive event
      if (e instanceof NavigationStart) {// event triggered on first page
        if (e.url === '/') {
          this.routeHidden = false; // show carousel if false
          // console.log('current page', e.url);
        } else {
          // console.log('current page', e.url);
          this.routeHidden = true; // show carousel if false
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



infoMessage()
{
  const message = '{{this.message}}';
  this.toast.sendMessage(message, 'info');

}








}







