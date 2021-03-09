import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
readonly VAPID_PUBLIC_KEY = 'BHLXzuFGiUtzg-cDCs7T2Eplpr63G7KCaBwFD1ibrlzi-nbrDzcVpDqVjbx3us4BmxZk4j6FXX3m8eDjs-QtvNY'

  title = 'shannon-dunne-k00228869-pwa';
  deferredPrompt: any;
  showButton = false;

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
    ) { }

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
