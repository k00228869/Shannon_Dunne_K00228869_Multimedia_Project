import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NotificationsService } from './services/notifications.service';
import { Router, NavigationStart } from '@angular/router';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { SwUpdate } from '@angular/service-worker';
import { ClientUserService } from './services/client-user.service';
import { SplashScreenComponent } from './user-components/splash-screen/splash-screen.component';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { AuthenticateService } from './services/authenticate.service';
import { ConnectionService } from 'ng-connection-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit{
  isConnected = true;
  isNotConnected: boolean;
  public routeHidden: boolean = true;
  readonly VAPID_PUBLIC_KEY =
    'BHLXzuFGiUtzg-cDCs7T2Eplpr63G7KCaBwFD1ibrlzi-nbrDzcVpDqVjbx3us4BmxZk4j6FXX3m8eDjs-QtvNY';
  title = 'SelfCare';
  message;
  @ViewChild(ToastContainerDirective, { static: true })
  toastContainer: ToastContainerDirective;

  // install prompt event listener
  @HostListener('window:beforeinstallprompt', ['$event'])
  onbeforeinstallprompt(event) {
    // do not fire if already installed
    // Prevent Chrome 67 from automatically showing prompt
    event.preventDefault();
    // Stash the event so it can be triggered later.
    this.user.deferredPrompt = event;
    this.user.showButton = true; // display download button
  }

  constructor(
    private notif: NotificationsService,
    private router: Router,
    public toastr: ToastrService,
    public update: SwUpdate,
    public user: ClientUserService,
    private connection: ConnectionService,
    public auth: AuthenticateService)
    {
      update.activated.subscribe();
      update.available.subscribe((event) => {
        // call func to update
        if (event) {
          update.activateUpdate().then(() => document.location.reload());
        }
      });


      this.connection.monitor().subscribe(isConnected => { // subscribing to monitor to get notified when connectio status changes
        this.isConnected = isConnected;
        if (this.isConnected){
          this.isNotConnected = false;
        }
        else{
          this.isNotConnected = true;
          this.toastr.info('Please connect to the internet to use this app', 'Connection Error', {
                positionClass: 'toast-bottom',
                timeOut: 7000,
                closeButton: true,
              });
        }
      });
    }

  ngOnInit() {
    console.log(this.auth.isLoggedIn);
    this.toastr.overlayContainer = this.toastContainer;
    this.notif.receiveMessage();
    this.message = this.notif.currentMessage;

    this.router.events.subscribe((e) => {
      // check route url and subscribe to receive event
      if (e instanceof NavigationStart) {
        // event triggered on first page
        if (e.url === '/') {
          this.routeHidden = false; // show carousel if false
        }
        else {
          this.routeHidden = true; // show carousel if false
        }
      }
    });
  }
}
