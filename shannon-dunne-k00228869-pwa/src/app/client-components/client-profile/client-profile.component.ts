import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { IUser } from 'src/app/interfaces/i-user';
import { AuthenticateService } from 'src/app/services/authenticate.service';

@Component({
  selector: 'app-client-profile',
  templateUrl: './client-profile.component.html',
  styleUrls: ['./client-profile.component.css'],
})
export class ClientProfileComponent implements OnInit {
  public client: IUser['user'];
  constructor(
    public authService: AuthenticateService
  ) {}

  ngOnInit() {
    // call func to get user data
    this.authService
      .getUserInfo()
      .pipe(take(1))
      .subscribe((data) => {
        this.client = data; // store user data
      });
  }
}
