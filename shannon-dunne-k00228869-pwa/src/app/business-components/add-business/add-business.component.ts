import { Component, OnInit } from '@angular/core';
import { IUser } from 'src/app/interfaces/i-user';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormArray,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { BusinessService } from 'src/app/services/business.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { UploadsService } from 'src/app/services/uploads.service';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { IDays } from 'src/app/interfaces/idays';
import { WorkingDaysService } from 'src/app/services/working-days.service';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { finalize, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { IBusiness } from 'src/app/interfaces/i-business';

@Component({
  selector: 'app-add-business',
  templateUrl: './add-business.component.html',
  styleUrls: ['./add-business.component.css'],
})
export class AddBusinessComponent implements OnInit {
  newProfile: IBusiness['business'];
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
  hours: any[] = [];
  start: string;
  end: string;
  public id: string;
  hourList: IDays['1'] = []; // hold hours template
  addProfileForm: FormGroup;
  addServiceForm: FormGroup;
  addEmployeeForm: FormGroup;
  addBusHours: FormGroup;
  selectedValue: string;
  profileCreated: boolean;
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  uploadProgress: Observable<number>;
  downloadURL: Observable<string>;
  url: string;


  constructor(
    private addProfile: FormBuilder,
    private addHours: FormBuilder,
    private addEmp: FormBuilder,
    private addSer: FormBuilder,
    private firestore: AngularFirestore,
    private router: Router,
    public authService: AuthenticateService,
    private location: Location,
    public uploads: UploadsService,
    public business: BusinessService,
    public hourService: WorkingDaysService,
    private afs: AngularFireStorage
  ) {}

  ngOnInit() {
    // build form for business details, with validators
    this.addProfileForm = this.addProfile.group({
      businessName: new FormControl('', [Validators.required]),
      businessDescription: new FormControl('', Validators.required),
      eircode: new FormControl('', [
        Validators.minLength(7),
        Validators.maxLength(7),
      ]),
      county: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required]),
      businessType: new FormControl('', [Validators.required]),
      reminderMessage: new FormControl('', Validators.required),
      cancellationPolicy: new FormControl('', Validators.required),
      profileCreated: new FormControl('true', Validators.required),
    });

    // build form for business hours, with an array of formgroup for each day
    this.addBusHours = this.addHours.group({
      monday: this.addHours.array([this.newDay()]),
      tuesday: this.addHours.array([this.newDay()]),
      wednesday: this.addHours.array([this.newDay()]),
      thursday: this.addHours.array([this.newDay()]),
      friday: this.addHours.array([this.newDay()]),
      saturday: this.addHours.array([this.newDay()]),
      sunday: this.addHours.array([this.newDay()]),
    });

    // build form for business employee details
    this.addEmployeeForm = this.addEmp.group({
      employees: this.addEmp.array([this.newEmployee()]),
    });

    // build form for business service details
    this.addServiceForm = this.addSer.group({
      services: this.addSer.array([this.newService()]),
    });

    // get the hours template from the db
    this.business.getHoursList().subscribe((data) => {
      this.hourList.push(data[1]);
    });
  }

upload = (event) => {
  const file = event.target.files[0];
  const randomId = Math.random().toString(36).substring(2);
  this.ref = this.afs.ref('/images/' + randomId); // reference to storage bucket
  this.task = this.ref.put(file); // creates upload task, and triggers upload

  // snapshotChanges() returns and obkect with metadata about the upload progress
  this.uploadProgress = this.task.snapshotChanges().pipe( // get upload progress value
    map(s => (s.bytesTransferred / s.totalBytes) * 100));

  // observe upload progress
  this.uploadProgress = this.task.percentageChanges();
  // notify when url available
  this.task.snapshotChanges().pipe(
    finalize(() => {
      this.downloadURL = this.ref.getDownloadURL();
      this.downloadURL.subscribe((url) => {
        this.url = url;
      });
    })
  ).subscribe();
}




  // HANDLE EMPLOYEES DATA
  newEmployee(): FormGroup {
    // build employee form group
    let employee = this.addEmp.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      employeeDescription: ['', Validators.required],
      employeeServices: new FormControl('', [Validators.required]),
    });
    return employee;
  }

  // triggered when add button is selected on employee form
  // gets the employees formArray and pushes a new formgroup into it
  public addEmployeeFormGroup() {
    const employees = this.addEmployeeForm.get('employees') as FormArray;
    employees.push(this.newEmployee()); // get the formArray and add the formgArray
  }

  // triggered when remove x button is selected on a employee form
  // it gets the employees array and removes a formgroup at the index it was selected
  removeEmployee(i: number): void {
    const employees = this.addEmployeeForm.get('employees') as FormArray;
    employees.removeAt(i);
  }

  public onEmployeeSubmit(adEmployee: IUser['employee']) {
    if ( // if all forms valid
      this.addServiceForm.status === 'VALID' &&
      this.addProfileForm.status === 'VALID' &&
      this.addEmployeeForm.status === 'VALID'
    ) {
      // store the employees array
      let employees = this.addEmployeeForm.controls.employees.value;
      // tslint:disable-next-line: prefer-for-of
      for (
        let i = 0;
        i < employees.length;
        i++ // loop through length of employees array
      ) {
        adEmployee = employees[i]; // store each item of array in an employee obj
        adEmployee.id = this.firestore.createId(); // create an id for the employee
        this.business.addEmployees(adEmployee); // call func to store employee in db
      }
    }
  }

  // HANDLE SERVICES DATA
  newService(): FormGroup {
    // build the service group
    let service = this.addSer.group({
      serviceName: ['', Validators.required],
      serviceDescription: ['', Validators.required],
      servicePrice: ['', Validators.required],
      duration: ['', Validators.required],
    });
    return service;
  }

  // triggered when add button is selected on service
  // gets the services formArray and pushes a new formgroup into it
  public addServiceFormGroup() {
    const services = this.addServiceForm.get('services') as FormArray;
    services.push(this.newService());
  }

    // triggered when remove x button is selected on a service
  // it gets the services array and removes a formgroup at the index it was selected
  removeService(i: number): void {
    const services = this.addServiceForm.get('services') as FormArray;
    services.removeAt(i); // get the formArray and remove the formgroup selected
  }

  public onServiceSubmit(adService: IUser['service']) {
    // tslint:disable-next-line: max-line-length
    if ( // if all forms valid
      this.addServiceForm.status === 'VALID' &&
      this.addProfileForm.status === 'VALID' &&
      this.addEmployeeForm.status === 'VALID'
    ) {
      // store the employees array
      let services = this.addServiceForm.controls.services.value;
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < services.length; i++) { // loop through length of services array
        adService = services[i]; // store each item of array in an service obj
        adService.id = this.firestore.createId(); // create an id for the service
        this.business.addServices(adService); // call func to store service in db
      }
    }
  }

  // HANDLES HOURS DATA
  newDay(): FormGroup {
    // build business hours form group
    let day = this.addHours.group({
      startT: ['', Validators.required],
      finishT: ['', Validators.required],
    });
    return day;
  }

  // HANDLES PROFILE DATA & HOURS
  public onProfileSubmit(
    newProfile: IBusiness['business'],
    newHours: IUser['hours']
  ) {
    if ( // if all forms are valid
      this.addServiceForm.status === 'VALID' &&
      this.addProfileForm.status === 'VALID' &&
      this.addEmployeeForm.status === 'VALID'
    ) {
      this.selectedHours = this.addBusHours.value; // store selected start/finish times of each day in obj
      this.business.addHours(this.selectedHours); // store start and finish time in array
      this.newProfile = this.addProfileForm.value; // store the business details in obj
      this.newProfile.img = this.url;
      this.uploads.storeBusinessImages();
      // console.log('as string', this.url.toString());
      // console.log('not string', this.url);

      if (this.selectedHours.monday) { // if monday is stored
        this.mon = []; // reset array to hold times
        this.start = this.selectedHours.monday[0].startT; // get selected start time
        this.end = this.selectedHours.monday[0].finishT; // get selected finish time
        let theIndex1 = this.hourList[0].indexOf(this.start, 0); // get index of start time in hours template
        let theIndex2 = this.hourList[0].indexOf(this.end, 0); // get index of finish time
        let mondayHours = this.hourList[0].slice(theIndex1, theIndex2 + 1); // slice new schedule into array
        let m = 1; // set day index of week
        this.mon.push(mondayHours, m); // store new hours and day index in array
        this.hourService.addMon(this.mon); // cal func to add monday to workingdays doc
      }
      if (this.selectedHours.tuesday) {
        this.tues = [];
        this.start = this.selectedHours.tuesday[0].startT;
        this.end = this.selectedHours.tuesday[0].finishT;
        let theIndex1 = this.hourList[0].indexOf(this.start, 0);
        let theIndex2 = this.hourList[0].indexOf(this.end, 0);
        let tuesday = this.hourList[0].slice(theIndex1, theIndex2 + 1);
        let t = 2;
        this.tues.push(tuesday, t);
        this.hourService.addTue(this.tues);
      }
      if (this.selectedHours.wednesday) {
        this.wed = [];
        this.start = this.selectedHours.wednesday[0].startT;
        this.end = this.selectedHours.wednesday[0].finishT;
        let theIndex1 = this.hourList[0].indexOf(this.start, 0);
        let theIndex2 = this.hourList[0].indexOf(this.end, 0);
        let wednesday = this.hourList[0].slice(theIndex1, theIndex2 + 1);
        let w = 3;
        this.wed.push(wednesday, w);
        this.hourService.addWed(this.wed);
      }
      if (this.selectedHours.thursday) {
        this.thur = [];
        this.start = this.selectedHours.thursday[0].startT;
        this.end = this.selectedHours.thursday[0].finishT;
        let theIndex1 = this.hourList[0].indexOf(this.start, 0);
        let theIndex2 = this.hourList[0].indexOf(this.end, 0);
        let thursday = this.hourList[0].slice(theIndex1, theIndex2 + 1);
        let t = 4;
        this.thur.push(thursday, t);
        this.hourService.addThur(this.thur);
      }
      if (this.selectedHours.friday) {
        this.fri = [];
        this.start = this.selectedHours.friday[0].startT;
        this.end = this.selectedHours.friday[0].finishT;
        let theIndex1 = this.hourList[0].indexOf(this.start, 0);
        let theIndex2 = this.hourList[0].indexOf(this.end, 0);
        let friday = this.hourList[0].slice(theIndex1, theIndex2 + 1);
        let f = 5;
        this.fri.push(friday, f);
        this.hourService.addFri(this.fri);
      }
      if (this.selectedHours.saturday) {
        this.sat = [];
        this.start = this.selectedHours.saturday[0].startT;
        this.end = this.selectedHours.saturday[0].finishT;
        let theIndex1 = this.hourList[0].indexOf(this.start, 0);
        let theIndex2 = this.hourList[0].indexOf(this.end, 0);
        let saturday = this.hourList[0].slice(theIndex1, theIndex2 + 1);
        let s = 6;
        this.sat.push(saturday, s);
        this.hourService.addSat(this.sat);
      }
      if (this.selectedHours.sunday) {
        this.sun = [];
        this.start = this.selectedHours.sunday[0].startT;
        this.end = this.selectedHours.sunday[0].finishT;
        let theIndex1 = this.hourList[0].indexOf(this.start, 0);
        let theIndex2 = this.hourList[0].indexOf(this.end, 0);
        let sunday = this.hourList[0].slice(theIndex1, theIndex2 + 1);
        let s = 0;
        this.sun.push(sunday, s);
        this.hourService.addSun(this.sun);
      }
      this.business.addBusiness(newProfile); // cal func to add profile details to db
      this.changeRoute(newProfile); // cal func to change route
    }
  }

  changeRoute(newProfile) {
    this.router.navigate(['/business-view/', newProfile.id]);
  }
  cancel() {
    this.location.back();
  }
}
