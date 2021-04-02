import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { IUser } from 'src/app/interfaces/i-user';
import { ClientUserService } from 'src/app/services/client-user.service';
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
    public clientService: ClientUserService,
    public search: SearchQueriesService,
    public authService: AuthenticateService,

  ) {}

  ngOnInit() {
    this.clientService.getUserInfo().pipe(take(1)).subscribe((data) => {
      this.client = data;
    });
  }

  public async getBus()
  {
    this.search
      .checkQuery(this.location, this.busType, this.sort)
      .subscribe((filteredBus) => {
        this.search.filteredProfiles = [];
        this.search.filteredProfiles = filteredBus;
        // if (this.filteredProfiles.length === 0) // if 0 documents
        // {
        //   console.log('No probiders matching search');
        // }
      });
  }
}
