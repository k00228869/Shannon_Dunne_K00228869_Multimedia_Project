import { Component, OnInit } from '@angular/core';
import { from, Observable } from 'rxjs';
import { IUser } from 'src/app/i-user';
import { BusinessService } from 'src/app/services/business.service';

@Component({
  selector: 'app-business-list',
  templateUrl: './business-list.component.html',
  styleUrls: ['./business-list.component.css']
})
export class BusinessListComponent implements OnInit {
  public profiles: IUser['business'];
  public userList: IUser['user'];
  public userIds: string[] = [];

  public id: string;
  constructor(
    public business: BusinessService,
  ) { }

   ngOnInit(){

    this.business.getAllBusinessUsers().subscribe(
      async (data) =>
      {
        Object.keys(data).length;
        let key, count = 0;
        for (key in data)
        {
          if (data.hasOwnProperty(key))
          {
            this.userIds.push(data[key].uid);
            console.log('user IDS', this.userIds);
            await this.getProfiles(this.userIds);
          }
        // this.getProfiles(this.userIds);
      }
      });
  }

  getProfiles(userIds)
  {
    this.business.getAllBusinesses(userIds).subscribe(
      (data) => {
        this.profiles = data;
        // this.profiles.push(data);
        console.log(this.profiles);
      });
  }
}

