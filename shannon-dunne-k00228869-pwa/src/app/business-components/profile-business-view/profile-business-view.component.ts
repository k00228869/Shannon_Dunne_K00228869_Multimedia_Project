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
  public panelOpenState = false;
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
    // console.log('db variable', this.profileInfo.profileCreated);
    // console.log('local variable', this.isCreated);
    if (localStorage.getItem('user') !== null) { // check if user is not empty
      this.isSignedIn = true; // if user is not empty they are signed in
    }
    else {
      this.isSignedIn = false; // if user is  empty they are signed out
    }
    this.business.getBusiness().subscribe(
        (bus) =>
        {
          console.log('outside if', this.isCreated);

          // console.log('just observable', bus);
          console.log('observable with dot operator', bus[0].profileCreated); // w
          // console.log('as index', bus[0][7]); // undefined
          this.profileInfo = bus[0];
          console.log('1 bus', this.profileInfo);
          console.log('without val', this.profileInfo.profileCreated); // w
          // console.log('with val', this.profileInfo.profileCreated.valueOf()); // w

          if (this.profileInfo.profileCreated)
          {
            console.log('3. profile already created');
            this.isCreated = true;
            console.log('true', this.isCreated);
          }
          else{
            console.log('3. profile not created');
            this.isCreated = false;
            console.log('false', this.isCreated);
          }
          this.getProfile();
        }
    );

    this.business.getUserInfo().subscribe(
      (data) =>
      {
        this.user = data;
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
