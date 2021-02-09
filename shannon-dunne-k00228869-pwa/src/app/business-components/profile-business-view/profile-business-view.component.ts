import { Component, OnInit } from '@angular/core';
import { IUser } from 'src/app/i-user';
import { AuthenticateService } from 'src/app/services/authenticate.service';

@Component({
  selector: 'app-profile-business-view',
  templateUrl: './profile-business-view.component.html',
  styleUrls: ['./profile-business-view.component.css']
})
export class ProfileBusinessViewComponent implements OnInit {
  businessProfile: IUser['business'];

  constructor(
    private authentication: AuthenticateService,

  ) { }

  ngOnInit(){
    
  }

}
