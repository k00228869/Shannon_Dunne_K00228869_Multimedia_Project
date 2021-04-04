import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { ClientUserService } from 'src/app/services/client-user.service';
import { UploadsService } from 'src/app/services/uploads.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
})
export class LandingPageComponent implements OnInit {
  slides: string[] = [];

  constructor(
    private uploads: UploadsService,
    public user: ClientUserService,
    public auth: AuthenticateService
  ) {}

  ngOnInit() {
    // get urls for slideshow images from db
    this.uploads.getSlideshow().pipe(take(1)).subscribe((data) => {
      this.slides = Object.values(data); // store values in array
    });
  }
}
