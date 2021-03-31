import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { IUser } from 'src/app/i-user';
import { IDays } from 'src/app/idays';
import { BusinessService } from 'src/app/services/business.service';
import { EditBusinessService } from 'src/app/services/edit-business.service';
import { RescheduleService } from 'src/app/services/reschedule.service';
import { WorkingDaysService } from 'src/app/services/working-days.service';

@Component({
  selector: 'app-edit-business',
  templateUrl: './edit-business.component.html',
  styleUrls: ['./edit-business.component.css'],
})
export class EditBusinessComponent implements OnInit {
  editProfileForm: FormGroup;
  editBusHours: FormGroup;
  editEmployeeForm: FormGroup;
  editServiceForm: FormGroup;
  hourList: IDays['1'] = []; // hold hours template
  hours: any[] = [];
  start: string;
  end: string;
  selectedHours: IUser['hours']; // holds selected times
  id: string;
  serviceCollection: IUser['service'][];
  newProfile: IUser['business'];
  mon: IUser['scheduleOfDays']['monday'];
  tues: IUser['scheduleOfDays']['tuesday'];
  wed: IUser['scheduleOfDays']['wednesday'];
  thur: IUser['scheduleOfDays']['thursday'];
  fri: IUser['scheduleOfDays']['friday'];
  sat: IUser['scheduleOfDays']['saturday'];
  sun: IUser['scheduleOfDays']['sunday'];

  constructor(
    private editProfile: FormBuilder,
    private editHours: FormBuilder,
    // private editEmp: FormBuilder,
    private editSer: FormBuilder,
    public editbusiness: EditBusinessService,
    public business: BusinessService,
    private reschedule: RescheduleService,
    private route: ActivatedRoute,
    public hourService: WorkingDaysService,
    private router: Router,
    private firestore: AngularFirestore
  ) {}

  async ngOnInit() {
    this.route.paramMap.subscribe(async (params) => {
      this.id = params.get('id');
      this.business
        .getBusiness()
        .pipe(take(1))
        .subscribe((business) => {
          this.newProfile = business;
          this.editProfileForm.controls.businessName.setValue(
            this.newProfile.businessName);
          this.editProfileForm.controls.businessDescription.setValue(
            this.newProfile.businessDescription);
          this.editProfileForm.controls.eircode.setValue(
            this.newProfile.eircode);
          this.editProfileForm.controls.county.setValue(this.newProfile.county);
          this.editProfileForm.controls.businessType.setValue(
            this.newProfile.businessType);
          this.editProfileForm.controls.reminderMessage.setValue(
            this.newProfile.reminderMessage);
          this.editProfileForm.controls.cancellationPolicy.setValue(
            this.newProfile.cancellationPolicy);
          this.editProfileForm.controls.price.setValue(this.newProfile.price);
        });
    });


    this.editProfileForm = this.editProfile.group({
      businessName: new FormControl(''),
      businessDescription: new FormControl(''),
      businessType: new FormControl(''),
      eircode: new FormControl('', [
        Validators.minLength(7),
        Validators.maxLength(7), ]),
      county: new FormControl(''),
      reminderMessage: new FormControl(''),
      cancellationPolicy: new FormControl(''),
      price: new FormControl(''),
    });

    this.editBusHours = this.editHours.group({
      monday: this.editHours.array([this.newDay()]),
      tuesday: this.editHours.array([this.newDay()]),
      wednesday: this.editHours.array([this.newDay()]),
      thursday: this.editHours.array([this.newDay()]),
      friday: this.editHours.array([this.newDay()]),
      saturday: this.editHours.array([this.newDay()]),
      sunday: this.editHours.array([this.newDay()]),
    });

    this.business.getHoursList().subscribe((data) => {
      this.hourList.push(data[1]); // add hours template
    });

    (await this.business.getServices()).subscribe((serviceCol) => {
      this.serviceCollection = serviceCol;

      this.editServiceForm.patchValue(this.serviceCollection);

      const addTheService = this.serviceCollection.map(service => {
        return this.editSer.group({
          serviceName: [service.serviceName],
          serviceDescription: [service.serviceDescription],
          servicePrice: [service.servicePrice],
          duration: [service.duration]
        });
      });
      const servicesArr: FormArray = this.editSer.array(addTheService);

      this.editServiceForm.setControl('services', servicesArr);
      // for (let i = 0; 0 < this.serviceCollection.length; i++)
      // {
        // push(this.newService().setValue({
        //   serviceName: this.serviceCollection[i].serviceName,
        //   serviceDescription: this.serviceCollection[i].serviceDescription,
        //   servicePrice: this.serviceCollection[i].servicePrice,
      //   //   duration: this.serviceCollection[i].duration});
      // }
    });
    // business services form
    this.editServiceForm = this.editSer.group({
      services: this.editSer.array([]), // push service data to array
    });
  }

  // // HANDLE SERVICES DATA
  // newService(): FormGroup {  // populate with service data
  //   return this.editSer.group({
  //     serviceName: new FormControl(''),
  //     serviceDescription: new FormControl(''),
  //     servicePrice: new FormControl(''),
  //     duration: new FormControl(''),
  //   });
  // }


  // public addServiceFormGroup() {
  //   const services = this.editServiceForm.get('services') as FormArray;
  //   // services.push(this.newService());
  // }

  public onServiceSubmit(adService: IUser['service']) {
    // tslint:disable-next-line: max-line-length
    if (
      this.editServiceForm.status === 'VALID' &&
      this.editProfileForm.status === 'VALID'
    ) {
      // if fields are valid
      let services = this.editServiceForm.controls.services.value;
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < services.length; i++) {
        adService = services[i];
        adService.id = this.firestore.createId();
        this.business.addServices(adService);
      }
    } else {
      console.log('error in service form');
    }
  }

  // HANDLES HOURS DATA
  newDay(): FormGroup {
    let day = this.editHours.group({
      startT: ['', Validators.required],
      finishT: ['', Validators.required],
    });
    return day;
  }

  public onProfileSubmit(
    updatedProfile: IUser['business'],
    selectedHours: IUser['hours']
  ) {
    if (this.editProfileForm.status === 'VALID') {
      this.selectedHours = this.editBusHours.value; // copy selected start/finish times of each day
      this.business.addHours(this.selectedHours);
      console.log(this.selectedHours);
      this.newProfile.businessName = updatedProfile.businessName;
      this.newProfile.businessDescription = updatedProfile.businessDescription;
      this.newProfile.eircode = updatedProfile.eircode;
      this.newProfile.county = updatedProfile.county;
      this.newProfile.businessType = updatedProfile.businessType;
      this.newProfile.reminderMessage = updatedProfile.reminderMessage;
      this.newProfile.cancellationPolicy = updatedProfile.cancellationPolicy;
      this.newProfile.price = updatedProfile.price;

      if (this.selectedHours.monday) {
        this.hours = [];
        this.start = this.selectedHours.monday[0].startT; // get selected start time
        this.end = this.selectedHours.monday[0].finishT; // get selected finish time
        let theIndex1 = this.hourList[0].indexOf(this.start, 0); // get index of start time
        let theIndex2 = this.hourList[0].indexOf(this.end, 0); // get index of finish time
        let mondayHours = this.hourList[0].slice(theIndex1, theIndex2 + 1); // slice new schedule into array
        let m = 1;
        this.hours.push(mondayHours, m);
        this.mon = this.hours;
        this.hourService.addMon(this.mon);
      }
      if (this.selectedHours.tuesday) {
        this.hours = [];
        this.start = this.selectedHours.tuesday[0].startT;
        this.end = this.selectedHours.tuesday[0].finishT;
        let theIndex1 = this.hourList[0].indexOf(this.start, 0);
        let theIndex2 = this.hourList[0].indexOf(this.end, 0);
        let tuesday = this.hourList[0].slice(theIndex1, theIndex2 + 1);
        let t = 2;
        this.hours.push(tuesday, t);
        this.tues = this.hours;
        this.hourService.addTue(this.tues);
      }
      if (this.selectedHours.wednesday) {
        this.hours = [];
        this.start = this.selectedHours.wednesday[0].startT;
        this.end = this.selectedHours.wednesday[0].finishT;
        let theIndex1 = this.hourList[0].indexOf(this.start, 0);
        let theIndex2 = this.hourList[0].indexOf(this.end, 0);
        let wednesday = this.hourList[0].slice(theIndex1, theIndex2 + 1);
        let w = 3;
        this.hours.push(wednesday, w);
        this.wed = this.hours;
        this.hourService.addWed(this.wed);
      }
      if (this.selectedHours.thursday) {
        this.hours = [];
        this.start = this.selectedHours.thursday[0].startT;
        this.end = this.selectedHours.thursday[0].finishT;
        let theIndex1 = this.hourList[0].indexOf(this.start, 0);
        let theIndex2 = this.hourList[0].indexOf(this.end, 0);
        let thursday = this.hourList[0].slice(theIndex1, theIndex2 + 1);
        let t = 4;
        this.hours.push(thursday, t);
        this.thur = this.hours;
        this.hourService.addThur(this.thur);
      }
      if (this.selectedHours.friday) {
        this.hours = [];
        this.start = this.selectedHours.friday[0].startT;
        this.end = this.selectedHours.friday[0].finishT;
        let theIndex1 = this.hourList[0].indexOf(this.start, 0);
        let theIndex2 = this.hourList[0].indexOf(this.end, 0);
        let friday = this.hourList[0].slice(theIndex1, theIndex2 + 1);
        let f = 5;
        this.hours.push(friday, f);
        this.fri = this.hours;
        this.hourService.addFri(this.fri);
      }
      if (this.selectedHours.saturday) {
        this.hours = [];
        this.start = this.selectedHours.saturday[0].startT;
        this.end = this.selectedHours.saturday[0].finishT;
        let theIndex1 = this.hourList[0].indexOf(this.start, 0);
        let theIndex2 = this.hourList[0].indexOf(this.end, 0);
        let saturday = this.hourList[0].slice(theIndex1, theIndex2 + 1);
        let s = 6;
        this.hours.push(saturday, s);
        this.sat = this.hours;
        this.hourService.addSat(this.sat);
      }
      if (this.selectedHours.sunday) {
        this.hours = [];
        this.start = this.selectedHours.sunday[0].startT;
        this.end = this.selectedHours.sunday[0].finishT;
        let theIndex1 = this.hourList[0].indexOf(this.start, 0);
        let theIndex2 = this.hourList[0].indexOf(this.end, 0);
        let sunday = this.hourList[0].slice(theIndex1, theIndex2 + 1);
        let s = 0;
        this.hours.push(sunday, s);
        this.sun = this.hours;
        this.hourService.addSun(this.sun);
      }
      this.editbusiness.updateBusiness(this.newProfile);
      this.changeRoute(this.newProfile);
    } else {
      console.log('error in form');
    }
  }

  changeRoute(newProfile) {
    this.router.navigate(['/business-view/', newProfile.id]);
  }
}
