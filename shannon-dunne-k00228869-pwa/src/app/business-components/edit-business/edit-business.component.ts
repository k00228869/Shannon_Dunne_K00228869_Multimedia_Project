import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { IBusiness } from 'src/app/interfaces/i-business';
import { IUser } from 'src/app/interfaces/i-user';
import { IDays } from 'src/app/interfaces/idays';
import { AuthenticateService } from 'src/app/services/authenticate.service';
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
  hourList: IDays['1'] = []; // hold hours template
  hours: any[] = [];
  start: string;
  end: string;
  selectedHours: IUser['hours']; // holds selected times
  id: string;
  newProfile: IBusiness['business'];
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
    public editbusiness: EditBusinessService,
    public business: BusinessService,
    private route: ActivatedRoute,
    public hourService: WorkingDaysService,
    private router: Router,
    public authService: AuthenticateService,

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

    this.business.getHoursList().pipe(take(1)).subscribe((data) => {
      this.hourList.push(data[1]); // add hours template
    });
  }

  // HANDLES HOURS DATA
  newDay(): FormGroup {
    let day = this.editHours.group({
      startT: (''),
      finishT: (''),
    });
    return day;
  }

  public onProfileSubmit(
    updatedProfile: IBusiness['business'],
    selectedHours: IUser['hours']
  ) {
    if (this.editProfileForm.status === 'VALID' && this.editBusHours.status === 'VALID') {
      selectedHours = this.editBusHours.value; // copy selected start/finish times of each day
      this.business.addHours(selectedHours);
      console.log(selectedHours);
      this.newProfile.businessName = updatedProfile.businessName;
      this.newProfile.businessDescription = updatedProfile.businessDescription;
      this.newProfile.eircode = updatedProfile.eircode;
      this.newProfile.county = updatedProfile.county;
      this.newProfile.businessType = updatedProfile.businessType;
      this.newProfile.reminderMessage = updatedProfile.reminderMessage;
      this.newProfile.cancellationPolicy = updatedProfile.cancellationPolicy;
      this.newProfile.price = updatedProfile.price;

      if (selectedHours.monday) {
        this.hours = [];
        this.start = selectedHours.monday[0].startT; // get selected start time
        this.end = selectedHours.monday[0].finishT; // get selected finish time
        let theIndex1 = this.hourList[0].indexOf(this.start, 0); // get index of start time
        let theIndex2 = this.hourList[0].indexOf(this.end, 0); // get index of finish time
        let mondayHours = this.hourList[0].slice(theIndex1, theIndex2 + 1); // slice new schedule into array
        let m = 1;
        this.hours.push(mondayHours, m);
        this.mon = this.hours;
        this.hourService.addMon(this.mon);
      }
      if (selectedHours.tuesday) {
        this.hours = [];
        this.start = selectedHours.tuesday[0].startT;
        this.end = selectedHours.tuesday[0].finishT;
        let theIndex1 = this.hourList[0].indexOf(this.start, 0);
        let theIndex2 = this.hourList[0].indexOf(this.end, 0);
        let tuesday = this.hourList[0].slice(theIndex1, theIndex2 + 1);
        let t = 2;
        this.hours.push(tuesday, t);
        this.tues = this.hours;
        this.hourService.addTue(this.tues);
      }
      if (selectedHours.wednesday) {
        this.hours = [];
        this.start = selectedHours.wednesday[0].startT;
        this.end = selectedHours.wednesday[0].finishT;
        let theIndex1 = this.hourList[0].indexOf(this.start, 0);
        let theIndex2 = this.hourList[0].indexOf(this.end, 0);
        let wednesday = this.hourList[0].slice(theIndex1, theIndex2 + 1);
        let w = 3;
        this.hours.push(wednesday, w);
        this.wed = this.hours;
        this.hourService.addWed(this.wed);
      }
      if (selectedHours.thursday) {
        this.hours = [];
        this.start = selectedHours.thursday[0].startT;
        this.end = selectedHours.thursday[0].finishT;
        let theIndex1 = this.hourList[0].indexOf(this.start, 0);
        let theIndex2 = this.hourList[0].indexOf(this.end, 0);
        let thursday = this.hourList[0].slice(theIndex1, theIndex2 + 1);
        let t = 4;
        this.hours.push(thursday, t);
        this.thur = this.hours;
        this.hourService.addThur(this.thur);
      }
      if (selectedHours.friday) {
        this.hours = [];
        this.start = selectedHours.friday[0].startT;
        this.end = selectedHours.friday[0].finishT;
        let theIndex1 = this.hourList[0].indexOf(this.start, 0);
        let theIndex2 = this.hourList[0].indexOf(this.end, 0);
        let friday = this.hourList[0].slice(theIndex1, theIndex2 + 1);
        let f = 5;
        this.hours.push(friday, f);
        this.fri = this.hours;
        this.hourService.addFri(this.fri);
      }
      if (selectedHours.saturday) {
        this.hours = [];
        this.start = selectedHours.saturday[0].startT;
        this.end = selectedHours.saturday[0].finishT;
        let theIndex1 = this.hourList[0].indexOf(this.start, 0);
        let theIndex2 = this.hourList[0].indexOf(this.end, 0);
        let saturday = this.hourList[0].slice(theIndex1, theIndex2 + 1);
        let s = 6;
        this.hours.push(saturday, s);
        this.sat = this.hours;
        this.hourService.addSat(this.sat);
      }
      if (selectedHours.sunday) {
        this.hours = [];
        this.start = selectedHours.sunday[0].startT;
        this.end = selectedHours.sunday[0].finishT;
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
    } else{
      alert('Correct the invalid fields before submitting');
      return;
    }
  }

  changeRoute(newProfile) {
    this.router.navigate(['/business-view/', newProfile.id]);
  }
}
