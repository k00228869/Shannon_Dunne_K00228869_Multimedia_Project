import { Component, OnInit } from '@angular/core';
import { IUser } from 'src/app/i-user';
import { Observable } from 'rxjs';
import { BusinessService } from 'src/app/services/business.service';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';


@Component({
  selector: 'app-profile-business-view',
  templateUrl: './profile-business-view.component.html',
  styleUrls: ['./profile-business-view.component.css']
})
export class ProfileBusinessViewComponent implements OnInit {
  profileInfo: IUser['business'];
  employees: IUser['employee'];
  services: IUser['service'];
  public user: IUser['user'];
  panelOpenState = false;
  isSignedIn = false;
  // public uid: string;
  public id: string;

  public isCreated: boolean;

  constructor(
    public business: BusinessService,
    public authService: AuthenticateService,
    private route: ActivatedRoute,

  ) { }

  ngOnInit()
  {
    if (localStorage.getItem('user') !== null) { // check if user is not empty
      this.isSignedIn = true; // if user is not empty they are signed in
    }
    else {
      this.isSignedIn = false; // if user is  empty they are signed out
    }
    this.business.getBusiness().subscribe(
        (bus) =>
        {
          this.profileInfo = bus[0];
          if (this.profileInfo.profileCreated === true)
          {
            this.isCreated = true;
          }
          else{
            console.log('create a profile');
            this.isCreated = false;
          }
        }
    );

    this.business.getUserInfo().subscribe(
      (data) =>
      {
        this.user = data;
        console.log(this.user);
      }
    );

    


  }

  async getProfile()
    {
      (await this.business.getEmployees()).subscribe(
        (emps) =>
        {
          this.employees = emps;
        }
      );
      (await this.business.getServices()).subscribe(
        (servs) =>
        {
          this.services = servs;
        }
      );
    }

}
