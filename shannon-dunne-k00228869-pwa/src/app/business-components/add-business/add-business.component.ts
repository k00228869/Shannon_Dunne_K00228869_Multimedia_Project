import { Component, OnInit } from '@angular/core';
import { IUser } from 'src/app/i-user';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray} from '@angular/forms';
import { Router } from '@angular/router';
import {Location} from '@angular/common';
import { BusinessService } from 'src/app/services/business.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';


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
  selectedValue: string;
  newImages: IUser['slides'];
  profileCreated = true;
  uploadingpercentage: Observable<number>;
  downloadUrl: Observable<string>;
  selectedFileList: FileList| null;


  constructor(
    private addProfile: FormBuilder,
    private addImages: FormBuilder,
    private addEmp: FormBuilder,
    private addSer: FormBuilder,
    private firestore: AngularFirestore,
    // private route: Router,
    private location: Location,
    public business: BusinessService,
    private storage: AngularFireStorage
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

  fileDetection(event) // detects selected images
  {
    this.selectedFileList = event.target.files;
  }

 
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


  cancel()
  {
    this.location.back();
  }


  // addImg(){
  //   const file = this.selectedFileList;
  //   const filePath = '${Img.id}/name';
  //   const fileRef = this.storage.ref(filePath);
  //   const theTask = this.storage.upload(filePath, file);
  //   theTask.snapshotChanges().pipe(
  //     finalize(() => {
  //       fileRef.getDownloadURL().toPromise().then((url) => {
  //         this.downloadUrl = url;
  //        myTest.set({

  //         })
  //       })
  //     }
  //   )
  // }

}
