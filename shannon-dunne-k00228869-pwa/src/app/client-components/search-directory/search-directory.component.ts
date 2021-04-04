import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { IUser } from 'src/app/interfaces/i-user';
import { SearchQueriesService } from 'src/app/services/search-queries.service';
import { take } from 'rxjs/operators';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { IBusiness } from 'src/app/interfaces/i-business';

@Component({
  selector: 'app-search-directory',
  templateUrl: './search-directory.component.html',
  styleUrls: ['./search-directory.component.css'],
})
export class SearchDirectoryComponent implements OnInit {
  public allSelected: boolean = true;
  public getDeal: boolean = false;
  public filtered: boolean = true;
  public client: IUser['user'];
  public allProfiles: IBusiness['business'][];
  location: string = 'default';
  busType: string = 'default';
  sort: string = 'default';

  constructor(
    public firestore: AngularFirestore,
    public search: SearchQueriesService,
    public authService: AuthenticateService
  ) {}

  ngOnInit() {
    // call func to get user data
    this.authService
      .getUserInfo()
      .pipe(take(1))
      .subscribe((data) => {
        this.client = data; // store user data
      });
  }

  public async getBus() {
    // call func to query the business collection and pass in filters
    this.search
      .checkQuery(this.location, this.busType, this.sort)
      .subscribe((filteredBus) => {
        this.search.filteredProfiles = [];
        this.search.filteredProfiles = filteredBus; // store filtered results (the business)
      });
  }
}
