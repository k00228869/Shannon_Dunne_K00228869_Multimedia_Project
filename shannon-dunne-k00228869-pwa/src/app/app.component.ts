import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NotificationsService } from './services/notifications.service';
import { Router, NavigationStart } from '@angular/router';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { SwUpdate } from '@angular/service-worker';
import { DownloadService } from './services/download.service';
import { AuthenticateService } from './services/authenticate.service';
import { ConnectionService } from 'ng-connection-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  readonly VAPID_PUBLIC_KEY =
    'BHLXzuFGiUtzg-cDCs7T2Eplpr63G7KCaBwFD1ibrlzi-nbrDzcVpDqVjbx3us4BmxZk4j6FXX3m8eDjs-QtvNY';
  isConnected = true;
  isNotConnected: boolean;
  public routeHidden: boolean = true;
  title = 'SelfCare';
  message;

  // view query, set to true to run before change detection
  @ViewChild(ToastContainerDirective, { static: true })
  toastContainer: ToastContainerDirective;

  // install prompt event listener
  @HostListener('window:beforeinstallprompt', ['$event'])
  onbeforeinstallprompt(event) {
    // do not fire if already installed
    // Prevent Chrome 67 from automatically showing prompt
    event.preventDefault();
    // Stash the event so it can be triggered later.
    this.download.deferredPrompt = event;
    this.download.showButton = true; // display download button
  }

  constructor(
    private notif: NotificationsService,
    private router: Router,
    public toastr: ToastrService,
    public update: SwUpdate,
    public download: DownloadService,
    private connection: ConnectionService,
    public auth: AuthenticateService
  ) {
    // emits update event if the app was updated to a new version
    update.activated.subscribe();
    // emits an event if a newer update is available
    update.available.subscribe((event) => {
      // call func to update
      if (event) {
        // update by reloading
        update.activateUpdate().then(() => document.location.reload());
      }
    });

    // subscribing to monitor to get notified when connection status changes
    this.connection.monitor().subscribe((isConnected) => {
      this.isConnected = isConnected;
      if (this.isConnected) {
        this.isNotConnected = false; // connected to the internet
      } else {
        this.isNotConnected = true; // not connected to the internet
        // show toastr notification
        this.toastr.info(
          'Please connect to the internet to use this app',
          'Connection Error',
          {
            positionClass: 'toast-bottom',
            timeOut: 7000,
            closeButton: true,
          }
        );
      }
    });
  }

  ngOnInit() {
    // notification container overlay
    this.toastr.overlayContainer = this.toastContainer;

    // call func to recieve notifications
    this.notif.receiveMessage();

    // update behaviour subject
    this.message = this.notif.currentMessage;

    // subscribe to route events to check what page the user is on
    this.router.events.subscribe((e) => {
      // check route url and subscribe to receive event
      if (e instanceof NavigationStart) {
        // event triggered on first page
        if (e.url === '/') {
          this.routeHidden = false; // show landing page if false
        } else {
          this.routeHidden = true; // gide landing page if true
        }
      }
    });
  }
}
