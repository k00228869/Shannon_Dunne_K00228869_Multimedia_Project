import { Component, OnInit } from '@angular/core';
// import { AuthenticateService } from 'src/app/services/authenticate.service';
import { IUser } from 'src/app/i-user';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray} from '@angular/forms';
import { Router } from '@angular/router';
import {Location} from '@angular/common';
import { BusinessService } from 'src/app/services/business.service';


@Component({
  selector: 'app-add-business',
  templateUrl: './add-business.component.html',
  styleUrls: ['./add-business.component.css']
})
export class AddBusinessComponent implements OnInit {
  newProfile: IUser['business'];
  addProfileForm: FormGroup;
  profileCreated = true;


  constructor(
    private addProfile: FormBuilder,
    // authService: AuthenticateService,
    private route: Router,
    private location: Location,
    public business: BusinessService

  ) { }

  ngOnInit()
  {
    this.addProfileForm = this.addProfile.group({

      businessDetails: new FormGroup({
        businessName: new FormControl('', [Validators.required]),
        businessDescription: new FormControl('', Validators.required),
        eircode: new FormControl('', [Validators.minLength(7), Validators.maxLength(7)]),
        county: new FormControl('', [Validators.required]),
        businessType: new FormControl('', [Validators.required]),
        reminderMessage: new FormControl('', Validators.required),
        cancellationPolicy: new FormControl('', Validators.required)


      }),
      addImages: new FormGroup({
        slides: new FormArray([])


      })
     
    })
    
  }

  public onSubmit(newProfile: IUser['business']): void
  {
    if (this.addProfileForm.status === 'VALID') // if fields are valid
    {
      this.newProfile = this.addProfileForm.value;          // set the value of the form equal to object of type userInterface
      this.business.addBusiness(newProfile); // pass the values to the  function in the service
      this.addProfileForm.reset();
      this.route.navigate(['/business-view/:{{uid}}']);
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


  // setValues() {
  //   this.
  // }
}
