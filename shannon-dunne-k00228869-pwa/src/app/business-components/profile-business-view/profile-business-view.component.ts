import { Component, OnInit } from '@angular/core';
import { IUser } from 'src/app/i-user';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { User} from '@firebase/auth-types';
import { Observable } from 'rxjs';
import { BusinessService } from 'src/app/services/business.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-profile-business-view',
  templateUrl: './profile-business-view.component.html',
  styleUrls: ['./profile-business-view.component.css']
})
export class ProfileBusinessViewComponent implements OnInit {
  profileInfo: IUser['business'];
  employees: IUser['employees'];
  services: IUser['services'];
  panelOpenState = false;
  isSignedIn = false;
  public uid: string;
  public isCreated: boolean;

  constructor(
    public business: BusinessService,
    public authService: AuthenticateService,
    public firestore: AngularFirestore,
    public authenticate: AngularFireAuth,
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
          console.log(this.profileInfo);

          if(this.profileInfo.profileCreated === true)
          {
            this.isCreated = true;
          }
        }
      );
    this.business.getEmployees().subscribe(
      (emps) =>
      {
        this.employees = emps;
        // console.log(this.employees);
      }
    );
    this.business.getServices().subscribe(
      (servs) =>
      {
        this.services = servs;
        console.log(this.services);
        console.log(this.services[0]);
      }
    );
  }

}
