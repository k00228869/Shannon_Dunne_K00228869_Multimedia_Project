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
  isSignedIn = false;
  public uid: string;

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
        (data) =>
        {
          this.profileInfo = data;
          // console.log(this.profileInfo);
        }
      );
    this.business.getEmployees().subscribe(
      (data) =>
      {
        this.employees = data;
      }
    );
    this.business.getServices().subscribe(
      (data) =>
      {
        this.services = data;
      }
    );
  }

}
