import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { IUser } from 'src/app/i-user';
import { ClientUserService } from 'src/app/services/client-user.service';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormArray,
} from '@angular/forms';
import { SearchQueriesService } from 'src/app/services/search-queries.service';

@Component({
  selector: 'app-search-directory',
  templateUrl: './search-directory.component.html',
  styleUrls: ['./search-directory.component.css'],
})
export class SearchDirectoryComponent implements OnInit {
  typeSelected: boolean;
  locationSelected: boolean;
  allSelected = true;
  display = false;
  deal = false;
  public getDeal: boolean = false;
  public getType: boolean = false;
  public getLocation: boolean = false;
  public client: IUser['user'];
  selectedValue: string;
  public allProfiles: IUser['business'][];
  public withLocation: IUser['business'][];
  public withType: IUser['business'][];

  location: string;
  busType: string;
  queryForm: FormGroup;

  constructor(
    private loc: FormBuilder,
    public firestore: AngularFirestore,
    public clientService: ClientUserService,
    public search: SearchQueriesService,
    private query: FormBuilder,

  ) {}

  ngOnInit() {

     this.queryForm = this.query.group({
      loc: new FormControl(''),
      type: new FormControl(''),

    });

     this.routeId();

     this.search.getAllBusinessUsers().subscribe((data) => {
      this.typeSelected = false;
      this.locationSelected = false;
      this.allSelected = true;
      // console.log('all', data);
      this.allProfiles = [];
      this.allProfiles = data;
    });

    // this.search.getAllBusinessLocations(this.location).subscribe(
    //     (data) => {
    //       this.typeSelected = false;
    //       this.locationSelected = true;
    //       this.allSelected = false;
    //       console.log('all', data);
    //       this.withLocation = [];
    //       this.withLocation = data;
    //     });

    // this.search.getAllBusinessTypes(this.busType).subscribe(
    //       (data) => {
    //         this.typeSelected = true;
    //         this.locationSelected = false;
    //         this.allSelected = false;
    //         console.log('all', data);
    //         this.withType = [];
    //         this.withType = data;
    //       });
  }

  selectTracker() {}

  public onSubmit() {
    console.log('searching for business');
    // get bus type in the selected location
  }

  routeId() {
    this.clientService.getUserInfo().subscribe((data) => {
      this.client = data;
    });
  }



  // onSearch()
  // {
  //   this.display = true;
  //   this.deal = false;
  // }

  // onDeal()
  // {
  //   this.deal = true;
  //   this.display = false;
  // }
}
