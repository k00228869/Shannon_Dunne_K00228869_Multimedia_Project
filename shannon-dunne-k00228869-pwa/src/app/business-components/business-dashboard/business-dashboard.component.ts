import { Component, OnInit } from '@angular/core';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { IUser } from 'src/app/i-user';
import { BusinessService } from 'src/app/services/business.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-business-dashboard',
  templateUrl: './business-dashboard.component.html',
  styleUrls: ['./business-dashboard.component.css']
})
export class BusinessDashboardComponent implements OnInit {
  businessProfile: IUser['business'];
  public isSignedIn = false;
  public id: string;
  panelOpenState = false;
  public user: IUser['user'];


  constructor(
    public authService: AuthenticateService,
    public business: BusinessService,
    private route: ActivatedRoute,
    private router: Router

  ) { }

 async ngOnInit()
 {
  if (localStorage.getItem('user') !== null) // if user is not empty
  {
    this.isSignedIn = true; // user is signed in
  }
  else {
    this.isSignedIn = false; // user is signed out
    this.router.navigate(['/login']); // display business dash
  }

  this.business.getUserInfo().subscribe(
    (data) =>
    {
      this.user = data;
      // console.log(this.user);
    }
  );

  this.business.getBusiness().subscribe(
      (data) =>
      {
        this.businessProfile = data;
      }
    );

  
  }
}


