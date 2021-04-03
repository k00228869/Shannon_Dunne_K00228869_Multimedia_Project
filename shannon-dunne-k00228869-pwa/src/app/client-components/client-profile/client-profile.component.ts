import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { IUser } from 'src/app/interfaces/i-user';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { ClientUserService } from 'src/app/services/client-user.service';

@Component({
  selector: 'app-client-profile',
  templateUrl: './client-profile.component.html',
  styleUrls: ['./client-profile.component.css']
})
export class ClientProfileComponent implements OnInit {
  public client: IUser['user'];
  // panelOpenState = true;
  constructor(
    public clientService: ClientUserService,
    public authService: AuthenticateService,
  ) { }

  ngOnInit()
  {

    this.clientService.getUserInfo().pipe(take(1)).subscribe(
      (data) =>
      {
        this.client = data;
      }
    );
  }
}
