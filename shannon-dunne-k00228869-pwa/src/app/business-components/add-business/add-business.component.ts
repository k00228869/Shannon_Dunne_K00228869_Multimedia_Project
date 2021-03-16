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
import { IDays } from 'src/app/idays';
import { WorkingDaysService } from 'src/app/services/working-days.service';

@Component({
  selector: 'app-add-business',
  templateUrl: './add-business.component.html',
  styleUrls: ['./add-business.component.css']
})

export class AddBusinessComponent implements OnInit {
  newProfile: IUser['business'];
  adEmployee: IUser['employee'];
  adService: IUser['service'];
  selectedHours: IUser['hours']; // holds selected times
  mon: IUser['scheduleOfDays']['monday'];
  tues: IUser['scheduleOfDays']['tuesday'];
  wed: IUser['scheduleOfDays']['wednesday'];
  thur: IUser['scheduleOfDays']['thursday'];
  fri: IUser['scheduleOfDays']['friday'];
  sat: IUser['scheduleOfDays']['saturday'];
  sun: IUser['scheduleOfDays']['sunday'];
  hours: string[] = [];
  start: string;
  end: string;
  week: string[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  holdHours: string[] = [];
  public id: string;
  hourList: IDays['1'] = [];  // hold hours template
  dailyHours: string[] = []; // held selected times array
  addProfileForm: FormGroup;
  addServiceForm: FormGroup;
  addEmployeeForm: FormGroup;
  addBusHours: FormGroup;
  selectedValue: string;
  profileCreated: boolean;
  dailyWorkHours: number[] = [];
  newSet: string;
  // dailyHours: IUser['business']['hours'];

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
    public hourService: WorkingDaysService
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

    this.business.getHoursList().subscribe(
      (data) =>
      {
        this.hourList.push(data[1]);
      }
    );
  }


// HANDLE EMPLOYEES DATA
  newEmployee(): FormGroup {  // build form group
    let employee = this.addEmp.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      employeeDescription: ['', Validators.required],
      employeeServices: new FormControl('', [Validators.required]),
   });
    return employee;
 }

  public addEmployeeFormGroup()
  {
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
    // tslint:disable-next-line: max-line-length
    if (this.addServiceForm.status === 'VALID' && this.addProfileForm.status === 'VALID' && this.addEmployeeForm.status === 'VALID') // if fields are valid
    {
      let employees = this.addEmployeeForm.controls.employees.value; // store form controls i.e the array
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < employees.length; i++) // loop through length of array
      {
        adEmployee = employees[i]; // set each item of array to employee
        adEmployee.id = this.firestore.createId(); // create an id for the employee
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
    // tslint:disable-next-line: max-line-length
    if (this.addServiceForm.status === 'VALID' && this.addProfileForm.status === 'VALID' && this.addEmployeeForm.status === 'VALID') // if fields are valid
    {
      let services = this.addServiceForm.controls.services.value;
      // tslint:disable-next-line: prefer-for-of
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
    if (this.addServiceForm.status === 'VALID' && this.addProfileForm.status === 'VALID' && this.addEmployeeForm.status === 'VALID') // if fields are valid
    {
      this.selectedHours = this.addBusHours.value; // copy selected start/finish times of each day
      
      // this.dailyWorkHours = this.selectedHours;
      this.business.addHours(this.selectedHours);
      this.newProfile = this.addProfileForm.value;
      // this.newProfile.hours = this.dailyWorkHours;         // set the value of the form equal to object of type userInterface
      // this.addProfileForm.reset();
      // this.route.navigate(['/business-view/:{{newProfile.uid}}']);
      if(this.selectedHours.monday)
      {
        this.hours = [];
        this.start = this.selectedHours.monday[0].startT; // get selected start time
        this.end = this.selectedHours.monday[0].finishT; // get selected finish time
        let theIndex1 = this.hourList[0].indexOf(this.start, 0); // get index of start time
        let theIndex2 = this.hourList[0].indexOf(this.end, 0); // get index of finish time
        let mondayHours = this.hourList[0].slice(theIndex1, theIndex2 + 1); // slice new schedule into array
        let m = 'monday';
        this.hours.push(mondayHours, m);
        // console.log(this.hours);
        this.mon = this.hours;
        // console.log(this.mon);
        this.hourService.addMon(this.mon);
      }
      if(this.selectedHours.tuesday)
      {
        this.hours = [];
        this.start = this.selectedHours.tuesday[0].startT;
        this.end = this.selectedHours.tuesday[0].finishT;
        let theIndex1 = this.hourList[0].indexOf(this.start, 0);
        let theIndex2 = this.hourList[0].indexOf(this.end, 0);
        let tuesday = this.hourList[0].slice(theIndex1, theIndex2 + 1);
        this.tues = this.hours;
        let t = 'tuesday';
        this.hours.push(tuesday, t);
        // this.business.addHours(this.tues);
        this.hourService.addTue(this.tues);
      }
      if(this.selectedHours.wednesday)
      {
        this.hours = [];
        this.start = this.selectedHours.wednesday[0].startT;
        this.end = this.selectedHours.wednesday[0].finishT;
        let theIndex1 = this.hourList[0].indexOf(this.start, 0);
        let theIndex2 = this.hourList[0].indexOf(this.end, 0);
        let wednesday = this.hourList[0].slice(theIndex1, theIndex2 + 1);
        let w = 'wednesday';
        this.hours.push(wednesday, w);
        this.wed = this.hours;
        this.hourService.addWed(this.wed);
      }
      if(this.selectedHours.thursday)
      {
        this.hours = [];
        this.start = this.selectedHours.thursday[0].startT;
        this.end = this.selectedHours.thursday[0].finishT;
        let theIndex1 = this.hourList[0].indexOf(this.start, 0);
        let theIndex2 = this.hourList[0].indexOf(this.end, 0);
        let thursday = this.hourList[0].slice(theIndex1, theIndex2 + 1);
        let t = 'thursday';
        this.hours.push(thursday,t);
        this.thur = this.hours;
        this.hourService.addThur(this.thur);

      }
      if(this.selectedHours.friday)
      {
        this.hours = [];
        this.start = this.selectedHours.friday[0].startT;
        this.end = this.selectedHours.friday[0].finishT;
        let theIndex1 = this.hourList[0].indexOf(this.start, 0);
        let theIndex2 = this.hourList[0].indexOf(this.end, 0);
        let friday = this.hourList[0].slice(theIndex1, theIndex2 + 1);
        let f = 'friday';
        this.hours.push(friday,f);
        this.fri = this.hours;
        this.hourService.addFri(this.fri);
      }
      if(this.selectedHours.saturday)
      {
        this.hours = [];
        this.start = this.selectedHours.saturday[0].startT;
        this.end = this.selectedHours.saturday[0].finishT;
        let theIndex1 = this.hourList[0].indexOf(this.start, 0);
        let theIndex2 = this.hourList[0].indexOf(this.end, 0);
        let saturday = this.hourList[0].slice(theIndex1, theIndex2 + 1);
        let s = 'saturday';
        this.hours.push(saturday, s);
        this.sat= this.hours;
        this.hourService.addSat(this.sat);
      }
      if(this.selectedHours.sunday)
      {
        this.hours = [];
        this.start = this.selectedHours.sunday[0].startT;
        this.end = this.selectedHours.sunday[0].finishT;
        let theIndex1 = this.hourList[0].indexOf(this.start, 0);
        let theIndex2 = this.hourList[0].indexOf(this.end, 0);
        let sunday = this.hourList[0].slice(theIndex1, theIndex2 + 1);
        let s = 'sunday';
        this.hours.push(sunday,s);
        this.sun = this.hours;
        this.hourService.addSun(this.sun);
      }
      this.business.addBusiness(newProfile);
      this.business.addToBusinessCol(newProfile);
      // this.route.navigate(['/business-view/', newProfile.id]);
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
