import { Component, OnInit } from '@angular/core';
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
    public authService: AuthenticateService
  ) {}

  async ngOnInit() {
    // get id from route
    this.route.paramMap.subscribe(async (params) => {
      this.id = params.get('id'); // store route id
      this.business // call func to get the business's profile info
        .getBusiness()
        .pipe(take(1))
        .subscribe((business) => {
          // set form values to values stored in db
          this.newProfile = business;
          this.editProfileForm.controls.businessName.setValue(
            this.newProfile.businessName
          );
          this.editProfileForm.controls.businessDescription.setValue(
            this.newProfile.businessDescription
          );
          this.editProfileForm.controls.eircode.setValue(
            this.newProfile.eircode
          );
          this.editProfileForm.controls.county.setValue(this.newProfile.county);
          this.editProfileForm.controls.businessType.setValue(
            this.newProfile.businessType
          );
          this.editProfileForm.controls.reminderMessage.setValue(
            this.newProfile.reminderMessage
          );
          this.editProfileForm.controls.cancellationPolicy.setValue(
            this.newProfile.cancellationPolicy
          );
          this.editProfileForm.controls.price.setValue(this.newProfile.price);
        });
    });

    // build profile data form group, with validators
    this.editProfileForm = this.editProfile.group({
      businessName: new FormControl(''),
      businessDescription: new FormControl(''),
      businessType: new FormControl(''),
      eircode: new FormControl('', [
        Validators.minLength(7),
        Validators.maxLength(7),
      ]),
      county: new FormControl(''),
      reminderMessage: new FormControl(''),
      cancellationPolicy: new FormControl(''),
      price: new FormControl(''),
    });

    // build business hours form group, with the newday form group for each array(day)
    this.editBusHours = this.editHours.group({
      monday: this.editHours.array([this.newDay()]),
      tuesday: this.editHours.array([this.newDay()]),
      wednesday: this.editHours.array([this.newDay()]),
      thursday: this.editHours.array([this.newDay()]),
      friday: this.editHours.array([this.newDay()]),
      saturday: this.editHours.array([this.newDay()]),
      sunday: this.editHours.array([this.newDay()]),
    });

    // get the hours template (array with hours)
    this.business
      .getHoursList()
      .subscribe((data) => {
        this.hourList.push(data[1]); // add hours template
      });
  }

  // HANDLES HOURS DATA

  // build day formgroup
  newDay(): FormGroup {
    let day = this.editHours.group({
      startT: (''),
      finishT: (''),
    });
    return day; // return the formgroup
  }

  // submit form data
  public onProfileSubmit(
    updatedProfile: IBusiness['business'],
    selectedHours: IUser['hours']
  ) {
    // if all form fields are valid
    if (
      this.editProfileForm.status === 'VALID' && this.editBusHours.status === 'VALID'
    ) {
      this.selectedHours = this.editBusHours.value; // copy selected start/finish times of each day
      this.business.addHours(this.selectedHours); // add the selected hours to the db

      // set the business profile data using the form data
      this.newProfile.businessName = updatedProfile.businessName;
      this.newProfile.businessDescription = updatedProfile.businessDescription;
      this.newProfile.eircode = updatedProfile.eircode;
      this.newProfile.county = updatedProfile.county;
      this.newProfile.businessType = updatedProfile.businessType;
      this.newProfile.reminderMessage = updatedProfile.reminderMessage;
      this.newProfile.cancellationPolicy = updatedProfile.cancellationPolicy;
      this.newProfile.price = updatedProfile.price;

      if (this.selectedHours.monday) {
        // if monday was selected
        this.start = this.selectedHours.monday[0].startT; // get selected start time
        this.end = this.selectedHours.monday[0].finishT; // get selected finish time
        let theIndex1 = this.hourList[0].indexOf(this.start, 0); // get index of start time
        let theIndex2 = this.hourList[0].indexOf(this.end, 0); // get index of finish time
        let mondayHours = this.hourList[0].slice(theIndex1, theIndex2 + 1); // slice new schedule into array
        let m = 1; // set day index of week for calendar
        this.mon = [];
        this.mon.push(mondayHours, m); // store new hours and day index in array
        this.hourService.addMon(this.mon);
      }
      if (this.selectedHours.tuesday) {
        // this does the same as the if statement above, but for tuesday, if selected.
        this.start = this.selectedHours.tuesday[0].startT;
        this.end = this.selectedHours.tuesday[0].finishT;
        let theIndex1 = this.hourList[0].indexOf(this.start, 0);
        let theIndex2 = this.hourList[0].indexOf(this.end, 0);
        let tuesday = this.hourList[0].slice(theIndex1, theIndex2 + 1);
        let t = 2;
        this.tues = [];
        this.tues.push(tuesday, t);
        this.hourService.addTue(this.tues);
      }
      if (this.selectedHours.wednesday) {
        // this does the same as the if statement above, but for tuesday, if selected.
        this.start = this.selectedHours.wednesday[0].startT;
        this.end = this.selectedHours.wednesday[0].finishT;
        let theIndex1 = this.hourList[0].indexOf(this.start, 0);
        let theIndex2 = this.hourList[0].indexOf(this.end, 0);
        let wednesday = this.hourList[0].slice(theIndex1, theIndex2 + 1);
        let w = 3;
        this.wed = [];
        this.wed.push(wednesday, w);
        this.hourService.addWed(this.wed);
      }
      if (this.selectedHours.thursday) {
        // this does the same as the if statement above, but for tuesday, if selected.
        this.start = this.selectedHours.thursday[0].startT;
        this.end = this.selectedHours.thursday[0].finishT;
        let theIndex1 = this.hourList[0].indexOf(this.start, 0);
        let theIndex2 = this.hourList[0].indexOf(this.end, 0);
        let thursday = this.hourList[0].slice(theIndex1, theIndex2 + 1);
        let t = 4;
        this.thur = [];
        this.thur.push(thursday, t);
        this.hourService.addThur(this.thur);
      }
      if (this.selectedHours.friday) {
        // this does the same as the if statement above, but for tuesday, if selected.
        this.start = this.selectedHours.friday[0].startT;
        this.end = this.selectedHours.friday[0].finishT;
        let theIndex1 = this.hourList[0].indexOf(this.start, 0);
        let theIndex2 = this.hourList[0].indexOf(this.end, 0);
        let friday = this.hourList[0].slice(theIndex1, theIndex2 + 1);
        let f = 5;
        this.fri = [];
        this.fri.push(friday, f);
        this.hourService.addFri(this.fri);
      }
      if (this.selectedHours.saturday) {
        // this does the same as the if statement above, but for tuesday, if selected.
        this.start = this.selectedHours.saturday[0].startT;
        this.end = this.selectedHours.saturday[0].finishT;
        let theIndex1 = this.hourList[0].indexOf(this.start, 0);
        let theIndex2 = this.hourList[0].indexOf(this.end, 0);
        let saturday = this.hourList[0].slice(theIndex1, theIndex2 + 1);
        let s = 6;
        this.sat = [];
        this.sat.push(saturday, s);
        this.hourService.addSat(this.sat);
      }
      if (this.selectedHours.sunday) {
        // this does the same as the if statement above, but for tuesday, if selected.
        this.start = this.selectedHours.sunday[0].startT;
        this.end = this.selectedHours.sunday[0].finishT;
        let theIndex1 = this.hourList[0].indexOf(this.start, 0);
        let theIndex2 = this.hourList[0].indexOf(this.end, 0);
        let sunday = this.hourList[0].slice(theIndex1, theIndex2 + 1);
        let s = 0;
        this.sun = [];
        this.sun.push(sunday, s);
        this.hourService.addSun(this.sun);
      }
      this.editbusiness.updateBusiness(this.newProfile); // call funct to update the business profile
      this.changeRoute(this.newProfile); // call func to change route
    } else {
      // if form data not valid show alert
      alert('Correct the invalid fields before submitting');
      return;
    }
  }

  changeRoute(newProfile) {
    // pass in profile object and go to route
    this.router.navigate(['/business-view/', newProfile.id]);
  }
}
