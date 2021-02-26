import { Component, OnInit } from '@angular/core';
import { IUser } from 'src/app/i-user';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl, FormArray} from '@angular/forms';
import { Router } from '@angular/router';
import {Location} from '@angular/common';
import { BusinessService } from 'src/app/services/business.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { UploadsService } from 'src/app/services/uploads.service';
import { AngularFireStorage } from '@angular/fire/storage';
import * as moment from 'moment';

@Component({
  selector: 'app-add-business',
  templateUrl: './add-business.component.html',
  styleUrls: ['./add-business.component.css']
})
export class AddBusinessComponent implements OnInit {
  newProfile: IUser['business'];
  adEmployee: IUser['employee'];
  adService: IUser['service'];
  newHours: IUser['hours'];
  public id: string;
  addProfileForm: FormGroup;
  addServiceForm: FormGroup;
  addEmployeeForm: FormGroup;
  addBusHours: FormGroup;
  selectedValue: string;
  profileCreated: boolean;
  dailyWorkHours: number[] = [];
  dailyHours: IUser['business']['hours'];

  constructor(
    private addProfile: FormBuilder,
    private addHours: FormBuilder,
    private addEmp: FormBuilder,
    private addSer: FormBuilder,
    private firestore: AngularFirestore,
    private route: Router,
    private location: Location,
    public uploads: UploadsService,
    public business: BusinessService,

  ) {}


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

    this.addBusHours = this.addHours.group({
      monday: this.addHours.array([this.newDay()]),
      tuesday: this.addHours.array([this.newDay()]),
      wednesday: this.addHours.array([this.newDay()]),
      thursday: this.addHours.array([this.newDay()]),
      friday: this.addHours.array([this.newDay()]),
      saturday: this.addHours.array([this.newDay()]),
      sunday: this.addHours.array([this.newDay()])
    });

    this.addEmployeeForm = this.addEmp.group({
      employees: this.addEmp.array([this.newEmployee()])
      });

    this.addServiceForm = this.addSer.group({
        services: this.addSer.array([this.newService()])
        });
  }






// HANDLE EMPLOYEES DATA
  newEmployee(): FormGroup {  // build form group
    let employee = this.addEmp.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      employeeDescription: ['', Validators.required],
      employeeServices: new FormControl('', [Validators.required]),
      emloyeeImg: (''),
   });
    return employee;
 }

  public addEmployeeFormGroup() {
    const employees = this.addEmployeeForm.get('employees') as FormArray;
    employees.push(this.newEmployee()); // get the formArray and add the formgArray
  }

  removeEmployee(i: number): void
  {
    const employees = this.addEmployeeForm.get('employees') as FormArray;
    employees.removeAt(i);
  }


  public onEmployeeSubmit( adEmployee: IUser['employee'] )
  {
    if (this.addServiceForm.status === 'VALID' && this.addProfileForm.status === 'VALID' && this.addEmployeeForm.status === 'VALID') // if fields are valid
    {
      let employees = this.addEmployeeForm.controls.employees.value; // store form controls i.e the array
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < employees.length; i++) // loop through length of array
      {
        adEmployee = employees[i]; // set each item of array to employee
        adEmployee.id = this.firestore.createId(); // create an id for the employee
        // adEmployee.emloyeeImg = this.downloadURL;
        console.log(adEmployee.emloyeeImg);
        this.business.addEmployees(adEmployee); // pass the employee to firestore func
      }
    }
      // this.addEmployee.reset();
    else{
      console.log('error in employee form');
    }
  }



// HANDLE SERVICES DATA
  newService(): FormGroup // build the service group
  {
    let service = this.addSer.group({
      serviceName: ['', Validators.required],
      serviceDescription: ['', Validators.required],
      servicePrice: ['', Validators.required],
      duration: ['', Validators.required]
    });
    return service;
  }

  public addServiceFormGroup()
  {
    const services = this.addServiceForm.get('services') as FormArray;
    services.push(this.newService());
  }

  removeService(i: number): void
  {
    const services = this.addServiceForm.get('services') as FormArray;
    services.removeAt(i); // get the formArray and remove the formgroup selected
  }

  public onServiceSubmit(adService: IUser['service'] )
  {
    if (this.addServiceForm.status === 'VALID' && this.addProfileForm.status === 'VALID' && this.addEmployeeForm.status === 'VALID') // if fields are valid
    {
      // console.log(this.addServiceForm.controls.services.value);
      let services = this.addServiceForm.controls.services.value;
      for (let i = 0; i < services.length; i++)
      {
        adService = services[i];
        adService.id = this.firestore.createId();
        this.business.addServices(adService);
      }
    }
    else{
      console.log('error in service form');
    }
  }




  // HANDLES HOURS DATA
  newDay(): FormGroup {
    let day = this.addHours.group({
      startT: ['', Validators.required],
      finishT: ['', Validators.required],
    });
    return day;
  }



  // HANDLES PROFILE DATA & HOURS
  public onProfileSubmit(newProfile: IUser['business'], newHours: IUser['hours'])
  {
    // tslint:disable-next-line: max-line-length
    if (this.addServiceForm.status === 'VALID' && this.addProfileForm.status === 'VALID' && this.addEmployeeForm.status === 'VALID') // if fields are valid
    {
      this.newHours = this.addBusHours.value;
      this.business.addHours(this.newHours);
      
      this.newProfile = this.addProfileForm.value;          // set the value of the form equal to object of type userInterface
      // this.addProfileForm.reset();
      // this.route.navigate(['/business-view/:{{newProfile.uid}}']);

      Object.keys(this.newHours).length;
      let key, count = 0;
      // tslint:disable-next-line: forin
      for (key in this.newHours)
      {
        if(this.newHours.hasOwnProperty(key))
        {
          let startTime = moment(this.newHours[key][0].startT, 'HH:mm:ss');
          let finishTime = moment(this.newHours[key][0].finishT, 'HH:mm:ss');
          let duration = moment.duration(finishTime.diff(startTime));
          let diff = duration.hours();
          // console.log('thediff', diff);
          this.dailyWorkHours.push(diff);
          console.log(this.dailyWorkHours);
          this.dailyHours = this.dailyWorkHours;
          console.log(this.dailyHours);
        }
      }
      this.newProfile.hours = this.dailyHours;
      this.business.addBusiness(newProfile);
    }
    else{
      console.log('error in business form');
    }
  }

  cancel()
  {
      this.location.back();
  }

}
