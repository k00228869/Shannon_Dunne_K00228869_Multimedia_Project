import { Component, HostListener, ViewChild } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { NotificationsService } from './services/notifications.service';
import { Router, Event, NavigationStart } from '@angular/router';
import {ToastContainerDirective, ToastrService} from 'ngx-toastr';
import { SwUpdate } from '@angular/service-worker';

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
  @ViewChild(ToastContainerDirective, {static: true}) toastContainer: ToastContainerDirective;


    // install prompt event listener
  @HostListener('window:beforeinstallprompt', ['$event'])
onbeforeinstallprompt(event) { // do not fire if already installed
    // console.log(e);
    // Prevent Chrome 67 from automatically showing prompt
    event.preventDefault();
    // Stash the event so it can be triggered later.
    this.deferredPrompt = event;
    this.showButton = true; // display download button
  }

  constructor(
    private notif: NotificationsService,
    private router: Router,
    public toastr: ToastrService,
    public update: SwUpdate
  ) {
    update.available.subscribe(event => { // check versions
      console.log('Current Version', event.current);
      console.log('Get Newest Version', event.available);
    });

    update.activated.subscribe(event => {
      console.log('previous version', event.previous);
      console.log('Newest version', event.current);
    });

    update.available.subscribe(event => { // call func to update
      if (event) {
        update.activateUpdate().then(() => document.location.reload());
      }
    });
  }


  ngOnInit(){
    this.toastr.overlayContainer = this.toastContainer;
    this.notif.receiveMessage();
    this.message = this.notif.currentMessage;

    this.router.events.subscribe((e) => { // check route url and subscribe to receive event
      if (e instanceof NavigationStart) {// event triggered on first page
        if (e.url === '/') {
          this.routeHidden = false; // show carousel if false
        } else {
          this.routeHidden = true; // show carousel if false
        }
      }
    });
  }

  downloadApp() { // when download button is clicked
    // hide download button
    this.showButton = false;
    // Show prompt
    // console.log('theStashed response', this.deferredPrompt);
    this.deferredPrompt.prompt();
    // Wait for user to respond
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







