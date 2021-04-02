import { Component, OnInit } from '@angular/core';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { UploadsService } from 'src/app/services/uploads.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  slides: string[] = [];

  constructor(
    private uploads: UploadsService
  ) { }

  ngOnInit(){

    // get urls for slideshow images from db
    this.uploads.getSlideshow().subscribe(
      (data) => {
        console.log('as data hp', data);
        this.slides = Object.values(data); // store values in array
        console.log('as slides hp', this.slides);
      });
  }

}
