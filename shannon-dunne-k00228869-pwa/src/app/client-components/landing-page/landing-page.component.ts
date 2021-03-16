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
    this.uploads.getSlideshow().subscribe(
      (data) => {
        this.slides = Object.values(data);
      });
  }

}
