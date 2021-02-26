import { Component, OnInit } from '@angular/core';
import { from, Observable } from 'rxjs';
import { IUser } from 'src/app/i-user';
import { BusinessService } from 'src/app/services/business.service';
import { SearchQueriesService } from 'src/app/services/search-queries.service';

@Component({
  selector: 'app-business-list',
  templateUrl: './business-list.component.html',
  styleUrls: ['./business-list.component.css']
})
export class BusinessListComponent implements OnInit {
  public profiles: IUser['business'][];
  public userList: IUser['user'];
  public userIds: string[] = [];
  selectedValue: string;


  public id: string;
  constructor(
    public business: BusinessService,
    public search: SearchQueriesService
  ) { }

   ngOnInit(){
    this.search.getAllBusinessUsers().subscribe(
      (data) =>
      {
        Object.keys(data).length;
        let key, count = 0;
        for (key in data)
        {
          if (data.hasOwnProperty(key))
          {
            this.userIds.push(data[key].uid);
            console.log('user IDS', this.userIds);
            // this.getProfiles(this.userIds);
          }
        }
        this.getProfiles(this.userIds);
      });
  }

  getProfiles(userIds: string[])
  {
    this.search.getAllBusinesses(userIds).subscribe(
      (data) => {
      // this.profiles = [];
        this.profiles = data;
        // this.profiles.push(data);
        console.log('subscribed profiles', this.profiles[0]);
      })
  }
}

