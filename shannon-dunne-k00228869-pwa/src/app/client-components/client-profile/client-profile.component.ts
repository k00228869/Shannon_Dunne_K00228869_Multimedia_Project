import { Component, OnInit } from '@angular/core';
import { IUser } from 'src/app/i-user';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { ClientUserService } from 'src/app/services/client-user.service';

@Component({
  selector: 'app-client-profile',
  templateUrl: './client-profile.component.html',
  styleUrls: ['./client-profile.component.css']
})
export class ClientProfileComponent implements OnInit {
  clientInfo: IUser['user'];
  panelOpenState = false;
  constructor(
    public clientService: ClientUserService,
    public authService: AuthenticateService

  ) { }

  ngOnInit()
  {
    this.clientService.getUserInfo().subscribe(
        (data) =>
        {
          this.clientInfo = data;
          console.log(this.clientInfo);
        }
      );

  }

}
