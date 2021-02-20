import { Component, OnInit } from '@angular/core';
import { IUser } from 'src/app/i-user';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl, FormArray} from '@angular/forms';
import { Router } from '@angular/router';
import {Location} from '@angular/common';
import { BusinessService } from 'src/app/services/business.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { UploadsService } from 'src/app/services/uploads.service';

@Component({
  selector: 'app-add-business',
  templateUrl: './add-business.component.html',
  styleUrls: ['./add-business.component.css']
})
export class AddBusinessComponent implements OnInit {
  newProfile: IUser['business'];
  adEmployee: IUser['employee'];
  adService: IUser['service'];
  newImages: IUser['slides'];
  public id: string;


  addProfileForm: FormGroup;
  addServiceForm: FormGroup;
  addEmployeeForm: FormGroup;
  addProlfileImages: FormGroup;

  selectedValue: string;
  profileCreated = true;
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
    public uploads: UploadsService
    
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

    this.addEmployeeForm = this.addEmp.group({
      employees: this.addEmp.array([this.newEmployee()])
      });

    this.addServiceForm = this.addSer.group({
        services: this.addSer.array([this.newService()])
        });


    // this.downloadURL = this.imgStorage.ref('/images/employees/').getDownloadURL();
    // console.log(this.downloadURL);
  }




// HANDLE EMPLOYEES DATA
  newEmployee(): FormGroup {  // build form group
    let employee = this.addEmp.group({
   firstName: ['', Validators.required],
   lastName: ['', Validators.required],
   employeeDescription: ['', Validators.required],
 //     // employeeServices: new FormControl('', [Validators.required]),
    emloyeeImg: (''),
 //     // hours: new FormControl('', [Validators.required]),
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


// HANDLES PROFILE DATA
public onProfileSubmit(newProfile: IUser['business']): void
{
  // tslint:disable-next-line: max-line-length
  if (this.addServiceForm.status === 'VALID' && this.addProfileForm.status === 'VALID' && this.addEmployeeForm.status === 'VALID') // if fields are valid
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


// HANDLES PROFILE IMAGES
  // createFile(img)
  // {
  //   const newImage = new FormControl (img, Validators.required);
  //   (<FormArray>this.addProlfileImages.get('slides')).push(newImage);
  // }

  get allImages(): FormArray
  {
    if (this.addProlfileImages && this.addProlfileImages.get('slides'))
    {
      return this.addProlfileImages.get('slides') as FormArray;
    }
  }

  // fileDetection(event) // detects selected images
  // {
  //   // this.urls = [];
  //   // this.selectedFiles = event.target.files;
  //   // if(this.selectedFiles)
  //   // {
  //   //   for(let file of [this.selectedFiles])
  //   //   {
  //   //     let reader = new FileReader();
  //   //     reader.onload = (e: any) => {
  //   //       this.urls.push(e.target.result);
  //   //       this.urls.createFile(e.target.result);
  //   //       // this.urls = reader.result as string;
  //   //     }
  //   //     reader.readAsDataURL(file);
  //   //    }
  //   // }
  // }



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
