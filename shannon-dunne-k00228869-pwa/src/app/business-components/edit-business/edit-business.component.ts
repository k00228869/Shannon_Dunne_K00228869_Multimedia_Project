import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { IUser } from 'src/app/i-user';
import { IDays } from 'src/app/idays';
import { BusinessService } from 'src/app/services/business.service';
import { EditBusinessService } from 'src/app/services/edit-business.service';
import { RescheduleService } from 'src/app/services/reschedule.service';

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
  id: string;
  newProfile: IUser['business'];

  constructor(
    private editProfile: FormBuilder,
    private editHours: FormBuilder,
    private editEmp: FormBuilder,
    private editSer: FormBuilder,
    public editbusiness: EditBusinessService,
    public business: BusinessService,
    private reschedule: RescheduleService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {

    // this.route.paramMap.subscribe(
    //   async (params) =>
    //   {
    //     this.id = params.get('id');
    //     await this.reschedule.getBusiness(this.id).pipe(take(1)).subscribe(
    //       (data) => {
    //         this.newProfile = data;
    //         this.editProfileForm.controls.businessName.setValue(this.newProfile.businessName);
    //         this.editProfileForm.controls.businessDescription.setValue(this.newProfile.businessDescription);
    //         this.editProfileForm.controls.eircode.setValue(this.newProfile.eircode);
    //         this.editProfileForm.controls.county.setValue(this.newProfile.county);
    //         this.editProfileForm.controls.businessType.setValue(this.newProfile.businessType);
    //         this.editProfileForm.controls.reminderMessage.setValue(this.newProfile.reminderMessage);
    //         this.editProfileForm.controls.cancellationPolicy.setValue(this.newProfile.cancellationPolicy);
    //       });
    //   });



    // this.editProfileForm = this.editProfile.group({
    //     businessName: new FormControl(''),
    //     businessDescription: new FormControl(''),
    //     businessType: new FormControl(''),
    //     eircode: new FormControl('', [Validators.minLength(7), Validators.maxLength(7)]),
    //     county: new FormControl(''),
    //     reminderMessage: new FormControl(''),
    //     cancellationPolicy: new FormControl('')
    //   });


    // this.editBusHours = this.editHours.group({
    //   monday: this.editHours.array([]),
    //   tuesday: this.editHours.array([]),
    //   wednesday: this.editHours.array([]),
    //   thursday: this.editHours.array([]),
    //   friday: this.editHours.array([]),
    //   saturday: this.editHours.array([]),
    //   sunday: this.editHours.array([]),
    // });

    // this.editEmployeeForm = this.editEmp.group({
    //   employees: this.editEmp.array([this.newEmployee()]),
    // });

    // this.editServiceForm = this.editSer.group({
    //   services: this.editSer.array([this.newService()]),
    // });

    // this.business.getHoursList().subscribe((data) => {
    //   this.hourList.push(data[1]);
    // });
  }



  // public onProfileSubmit(updatedProfile: IUser['business']): void
  // {
  //   if (this.editProfileForm.status == 'VALID')// if fields of formgroup are valid
  //   {
  //     this.newProfile.businessName = updatedProfile.businessName;
  //     this.newProfile.businessDescription = updatedProfile.businessDescription;
  //     this.newProfile.eircode = updatedProfile.eircode;
  //     this.newProfile.county = updatedProfile.county;
  //     this.newProfile.businessType = updatedProfile.businessType;
  //     this.newProfile.reminderMessage = updatedProfile.reminderMessage;
  //     this.newProfile.cancellationPolicy = updatedProfile.cancellationPolicy;
  //     console.log('not in func', updatedProfile);
  //     console.log('in func', this.newProfile);
  //     this.editbusiness.updateBusiness(this.newProfile);
  //   }
  // }








}

