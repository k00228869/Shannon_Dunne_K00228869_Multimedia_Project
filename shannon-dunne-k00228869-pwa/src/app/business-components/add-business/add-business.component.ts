import { Component, OnInit } from '@angular/core';
import { IUser } from 'src/app/i-user';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl, FormArray} from '@angular/forms';
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
  newEmployees: IUser['employees'];
  newServices: IUser['services'];

  addProfileForm: FormGroup;
  addService: FormGroup;
  addEmployee: FormGroup;
  addProlfileImages: FormGroup;
  selectedValue: string;
  newImages: IUser['slides'];
  profileCreated = true;
  uploadingpercentage: Observable<number>;
  downloadUrl: Observable<string>;
  selectedFiles: FileList| null;
  urls = [];

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

    this.addProlfileImages = this.addImages.group({
      slides: this.addImages.array([])
      });

    this.addEmployee = this.addEmp.group({
      employees: this.addEmp.array([this.newEmployee()])
      });

    this.addService = this.addSer.group({
        services: this.addSer.array([this.newService()])
        });
  }


  

  newEmployee(): FormGroup {  // build form group
    return this.addEmp.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    employeeDescription: ['', Validators.required],
  //     // employeeServices: new FormControl('', [Validators.required]),
  //  emloyeeImg: '',
  //     // hours: new FormControl('', [Validators.required]),
    });
  }

  newService(): FormGroup { // build the service group
    return this.addSer.group({
      serviceName: ['', Validators.required],
      serviceDescription: ['', Validators.required],
      servicePrice: ['', Validators.required],
      duration: ['', Validators.required]
    });
  }


  public addServiceFormGroup() {
    const services = this.addService.get('services') as FormArray;
    services.push(this.newService());
  }

  public addEmployeeFormGroup() {
    const employees = this.addEmployee.get('employees') as FormArray;
    employees.push(this.newEmployee());
  }



  // removeService(i: number): void
  // {
  //   this.services().removeAt(i); // get the formArray and remove the formgroup selected
  // }

  // removeEmployee(i: number): void
  // {
  //   this.employees().removeAt(i);
  // }




  createFile(img)
  {
      const newImage = new FormControl (img, Validators.required);
      (<FormArray>this.addProlfileImages.get('slides')).push(newImage);
  }

  get allImages(): FormArray
  {
    if (this.addProlfileImages && this.addProlfileImages.get('slides'))
    {
      return this.addProlfileImages.get('slides') as FormArray;
    }
  }

  fileDetection(event) // detects selected images
  {
    // this.urls = [];
    // this.selectedFiles = event.target.files;
    // if(this.selectedFiles)
    // {
    //   for(let file of [this.selectedFiles])
    //   {
    //     let reader = new FileReader();
    //     reader.onload = (e: any) => {
    //       this.urls.push(e.target.result);
    //       this.urls.createFile(e.target.result);
    //       // this.urls = reader.result as string;
    //     }
    //     reader.readAsDataURL(file);
    //    }
    // }
  }


  public onProfileSubmit(newProfile: IUser['business']): void
  {
    if (this.addProfileForm.status === 'VALID') // if fields are valid
    {
      this.newProfile = this.addProfileForm.value;          // set the value of the form equal to object of type userInterface
      this.business.addBusiness(newProfile); // pass the values to the  function in the service
      // this.addProfileForm.reset();
      // this.route.navigate(['/business-view/:{{uid}}']);
    }
    else{
      console.log('error in business form');
    }
  }

  public onEmployeeSubmit( newEmployees: IUser['employees'] )
  {
    if (this.addEmployee.status === 'VALID') // if fields are valid
    {
      this.newEmployees = this.addEmployee.value;          // set the value of the form equal to object of type userInterface
      this.business.addEmployees(newEmployees);
    }
      // this.addEmployee.reset();
    else
    {
      console.log('error in employee form');
    }
  }

  public onServiceSubmit(newServices: IUser['services'] )
  {
    if (this.addService.status === 'VALID') // if fields are valid
    {
      this.newServices = this.addService.value; // set the value of the form equal to object of type Interface
      this.business.addServices(newServices);
    }
    else
    {
      console.log('error in service form');
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
