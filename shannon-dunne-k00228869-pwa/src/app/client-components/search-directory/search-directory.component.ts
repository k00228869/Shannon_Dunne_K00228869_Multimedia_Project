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
  public allSelected: boolean = true;
  public getDeal: boolean = false;
  public filtered: boolean = false;
  public client: IUser['user'];
  public allProfiles: IUser['business'][];
  public filteredProfiles: IUser['business'][];
  location: string;
  busType: string;
  sort: string;

  constructor(
    public firestore: AngularFirestore,
    public clientService: ClientUserService,
    public search: SearchQueriesService,
  ) {}

  ngOnInit() {
    this.routeId();
    this.search.getAllBusinessUsers().subscribe((unfilteredBus) => {
      this.allSelected = true;
      this.allProfiles = [];
      this.allProfiles = unfilteredBus;
    });
  }

  public getBus()
  {
    console.log('searching for business');
    this.filtered = true;
    console.log(this.location, this.busType);
    this.search
      .checkQuery(this.location, this.busType, this.sort)
      .subscribe((filteredBus) => {
        console.log('filtered list', filteredBus);
        this.filteredProfiles = [];
        this.filteredProfiles = filteredBus;
        if (this.filteredProfiles.length < 1)
        {
          alert('no businness of that type/location, change provider type or location');
        }
      });
  }

  routeId() {
    this.clientService.getUserInfo().subscribe((data) => {
      this.client = data;
    });
  }
}
