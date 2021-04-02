import { Component, OnInit } from '@angular/core';
import { ClientUserService } from 'src/app/services/client-user.service';
import { UploadsService } from 'src/app/services/uploads.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  slides: string[] = [];

  constructor(
    private uploads: UploadsService,
    public user: ClientUserService
  ) {}

  ngOnInit(){

    // get urls for slideshow images from db
    this.uploads.getSlideshow().subscribe(
      (data) => {
        this.slides = Object.values(data); // store values in array
      });
  }

}
