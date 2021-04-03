import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.css']
})
export class SplashScreenComponent implements OnInit {
  windowWidth: string;
  showSplash = true;

  constructor() { }

  ngOnInit(): void {

    // splashscreen sampled from https://codesandbox.io/s/nifty-cookies-ps9lf?file=/src/app/app.routing.module.ts
    setTimeout(() => {
      this.windowWidth = '-' + window.innerWidth + 'px';
      setTimeout(() => {
        this.showSplash = !this.showSplash;
      }, 500);
    }, 3000);
  }
}
