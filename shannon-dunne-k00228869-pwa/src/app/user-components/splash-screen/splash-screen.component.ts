import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.css'],
})
export class SplashScreenComponent implements OnInit {
  windowWidth: string;
  showSplash = true;

  constructor() {}

  ngOnInit(): void {
    setTimeout(() => {
      // move accross width
      this.windowWidth = '-' + window.innerWidth + 'px';
      setTimeout(() => {
        // hide the splashscreen component
        this.showSplash = !this.showSplash;
      }, 500); // stop after half a sec
    }, 2000); // stop after 2 secs
  }
}
