import { Component, OnInit } from '@angular/core';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { IUser } from 'src/app/i-user';
import { BusinessService } from 'src/app/services/business.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { BookingService } from 'src/app/services/booking.service';

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
  allBookings: IUser['appointment'][];
  public serInfo: IUser['service'];
  public empInfo: IUser['employee'];
  allAppoint: string[] = [];

  constructor(
    public authService: AuthenticateService,
    public business: BusinessService,
    private route: ActivatedRoute,
    private router: Router,
    public booking: BookingService

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

  this.business.getUserInfo().subscribe(
    (data) =>
    {
      this.user = data;
    }
  );

  // this.business.getBusiness().subscribe(
  //     (bus) =>
  //     {
  //       console.log(bus);
  //       this.businessProfile = bus;
  //     }
  //   );

  this.booking.getBusinessAppointment().subscribe(
    (data) => {
      console.log(data[0]);
      this.allBookings = data;
    }
  );

  // this.business.getBusServices(this.businessProfile.id).subscribe(
  //   (ser) => {
  //     console.log(ser);
  //     this.serInfo = ser;
  //   }
  // );

  // this.business.getBusEmployees(this.businessProfile.id).subscribe(
  //   (emp) => {
  //     console.log(emp);
  //     this.empInfo = emp;
  //   }
  // );
  }
}


