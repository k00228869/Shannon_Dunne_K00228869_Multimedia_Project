import { Component, OnInit } from '@angular/core';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { IUser } from 'src/app/i-user';
import { BusinessService } from 'src/app/services/business.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-business-dashboard',
  templateUrl: './business-dashboard.component.html',
  styleUrls: ['./business-dashboard.component.css']
})
export class BusinessDashboardComponent implements OnInit {
  businessProfile: IUser['business'];
  public isSignedIn = false;
  uid: string;


  constructor(
    public authService: AuthenticateService,
    public business: BusinessService,
    private router: Router,

  ) { }

 ngOnInit()
 {
  if (localStorage.getItem('user') !== null) // if user is not empty
  {
    this.isSignedIn = true; // user is signed in
  }
  else {
    this.isSignedIn = false; // user is signed out
    this.router.navigate(['/login']); // display business dash

  }
  // this.business.getBusiness().subscribe(
  //     (data) =>
  //     {
  //       this.businessProfile = data;
  //       // console.log(data); //need to subscribe to getAppointments() and getClients()
  //     }
  //   );
  }
}
