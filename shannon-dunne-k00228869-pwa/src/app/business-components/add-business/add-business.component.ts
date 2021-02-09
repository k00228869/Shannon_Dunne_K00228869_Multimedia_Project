import { Component, OnInit } from '@angular/core';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { IUser } from 'src/app/i-user';
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { Router } from '@angular/router';
import {Location} from '@angular/common';


@Component({
  selector: 'app-add-business',
  templateUrl: './add-business.component.html',
  styleUrls: ['./add-business.component.css']
})
export class AddBusinessComponent implements OnInit {
  newProfile: IUser['business'];
  addProfileForm: FormGroup;
  businessTypes: string[] = ['Hair Salon', 'Barber', 'Nail Technician', 'Beautician', 'Beauty therapist'];
  profileCreated = true;
  constructor(
    private addProfile: FormBuilder,
    private authentication: AuthenticateService,
    private route: Router,
    private location: Location
  ) { }

  ngOnInit()
  {
    this.addProfileForm = this.addProfile.group({
      businessName: new FormControl('', [Validators.required]),
      businessDescription: new FormControl('', Validators.required),
      eircode: new FormControl('', [Validators.minLength(7), Validators.maxLength(7)]),
      county: new FormControl('', [Validators.required]),
      // businessTypes: new FormControl('', [Validators.required]),
    });
  }

  public onSubmit(newProfile: IUser['business']): void
  {
    if (this.addProfileForm.status === 'VALID') // if fields are valid
    {
      
      this.newProfile = this.addProfileForm.value;          // set the value of the form equal to object of type userInterface
      this.authentication.addBusiness(newProfile).subscribe( // pass the values to the  function in the service
        (data) => {
          console.log(data);
          this.addProfileForm.reset();
          this.route.navigate(['/business-view/:id']);
      });
    }
  }

  cancel()
  {
    this.location.back();
  }

  changeSetting(profileCreated: boolean)
  {
    profileCreated = false;
  }
}
