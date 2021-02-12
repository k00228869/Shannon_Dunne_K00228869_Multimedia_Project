import { Component, OnInit } from '@angular/core';
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
  addService: FormGroup;
  addEmployee: FormGroup;
  addProlfileImages: FormGroup;
  newImages: IUser['slides'];
  profileCreated = true;


  constructor(
    private addProfile: FormBuilder,
    private addImages: FormBuilder,
    private addEmp: FormBuilder,
    private addSer: FormBuilder,
    // private route: Router,
    private location: Location,
    public business: BusinessService
  ) { }

  ngOnInit()
  {
    this.addProfileForm = this.addProfile.group({
        businessName: new FormControl('', [Validators.required]),
        businessDescription: new FormControl('', Validators.required),
        eircode: new FormControl('', [Validators.minLength(7), Validators.maxLength(7)]),
        county: new FormControl('', [Validators.required]),
        businessType: new FormControl('', [Validators.required]),
        reminderMessage: new FormControl('', Validators.required),
        cancellationPolicy: new FormControl('', Validators.required),
        profileCreated: new FormControl('true', Validators.required),
      });

    this.addProlfileImages = this.addImages.group({
      slides: this.addImages.array([])

      });


    // this.addEmployee = this.addEmp.group({
    //     employees: this.addEmp.array([this.theEmployees()])
    //     });
    // this.addService = this.addSer.group({
    //       services: this.addSer.array([this.theServices()])
    //       });
  }
  // slides = this.user.get('slides') as FormArray;
    fileUploads(evt: any, index: any)
    {
      const files = evt.target.files;
      const control = this.addProlfileImages.controls
      .addImages['controls'][index].controls['slides'].controls as FormArray;
      for (let i = 0; i < files.length; i++)
      {
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64 = reader.result + '';
          control.push(this.addImages.control((base64)));
        };
        reader.readAsDataURL(files[i]);
      }
      evt.srcElement.value = null;
    }

  // public theEmployees(){
  //   return this.addEmp.group({
  //     firstName: new FormControl('', [Validators.required]),
  //     lastName: new FormControl('', [Validators.required]),
  //     employeeDescription: new FormControl('', [Validators.required]),
  //     employeeServices: new FormControl('', [Validators.required]),
  //     emloyeeImg: new FormControl('', [Validators.required]),
  //     hours: new FormControl('', [Validators.required]),
  //   })
  // }

  // public theServices(){
  //   return this.addSer.group({
  //     serviceName: new FormControl('', [Validators.required]),
  //     serviceDescription: new FormControl('', [Validators.required]),
  //     servicePrice: new FormControl('', [Validators.required]),
  //     duration: new FormControl('', [Validators.required]),

  //   })
  // }

  
  // newEmployee()
  // {
  //   const control = this.addEmployee.controls.employees;
  //   control.push(this.theEmployees());
  // }

  // newService(){
  //   const control = this.addService.controls.services;
  //   control.push(this.theServices());
  // }

  public onSubmit(newProfile: IUser['business'], newImages: IUser['slides'] ): void
  {
    if (this.addProfileForm.status === 'VALID') // if fields are valid
    {
      this.newProfile = this.addProfileForm.value;          // set the value of the form equal to object of type userInterface
      this.business.addBusiness(newProfile); // pass the values to the  function in the service
      this.addProfileForm.reset();
      // this.route.navigate(['/business-view/:{{uid}}']);
    }

    if (this.addProlfileImages.status === 'VALID') // if fields are valid
    {
      this.newImages = this.addProlfileImages.value;          // set the value of the form equal to object of type userInterface
      this.business.addSlides(newImages); // pass the values to the  function in the service
      this.addProlfileImages.reset();
    }
  }

  // public buildForm()
  // {
    
  // }

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
