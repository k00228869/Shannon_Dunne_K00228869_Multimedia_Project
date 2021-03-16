import { Component, OnInit } from '@angular/core';
import { from, Observable } from 'rxjs';
import { IUser } from 'src/app/i-user';
import { BusinessService } from 'src/app/services/business.service';
import { SearchQueriesService } from 'src/app/services/search-queries.service';
import {SearchDirectoryComponent} from 'src/app/client-components/search-directory/search-directory.component';
@Component({
  selector: 'app-business-list',
  templateUrl: './business-list.component.html',
  styleUrls: ['./business-list.component.css']
})
export class BusinessListComponent implements OnInit {
  public busProfiles: IUser['business'];
  public allUsers: IUser['user'][] = [];
  public userList: IUser['user'];
  public userIds: string[] = [];
  createdProfile: IUser['business'][];
  theLength: number;
  selectedValue: string;

  public id: string;
  constructor(
    public business: BusinessService,
    public search: SearchQueriesService,
    public searchComp: SearchDirectoryComponent

  ) { }

   ngOnInit(){
    //  this.getBus();
    //  this.search.getAllBusinessUsers().subscribe(
    //   async (data) =>
    //   {
    //     this.allUsers = data;
    //     console.log('allUsers', this.allUsers);
    //     this.theLength = this.allUsers.length;
    //     console.log('length', this.theLength);
    //     // await this.getProfiles(this.allUsers, this.theLength);
    //   });
    

    //  this.search.getAllBusinessUsers().subscribe(
    //   (data) => {
    //     console.log('all', data);
    //     this.profiles = [];
    //     this.profiles = data;
    //   });
  }


  // Object.keys(data).length;
  // let key;
  // for (key in data)
  // {
  //   if (data.hasOwnProperty(key))
  //   {
  //     this.userIds.push(data[key].uid);
  //     console.log('user IDS', this.userIds);
  //     // this.getProfiles(this.userIds);
  //   }
  // }

  // async getProfiles(allUsers: IUser['user'][],  theLength: number)
  // {
  //   let howMany = Object.keys(allUsers).length;
  //   console.log('arraylength', howMany);
  //   let key, count=0;
  //   for (key in allUsers)
  //   {
  //     if (allUsers.hasOwnProperty(key))
  //     {
  //       this.userIds.push(allUsers[key].uid);
  //       console.log('user IDS in busFunc', this.userIds);
  //       // this.getProfiles(this.userIds);
  //       count++;
  //       console.log('counter', count);
  //       if (count === theLength)
  //       {
  //         break;
  //       }
  //     }
  //   }
  //   (await this.search.getAllBusinesses(this.userIds)).subscribe(
  //     (data) => {
  //     this.profiles = [];
  //     console.log('the Profiles', data);
  //     this.profiles.push(data);
  //     console.log('subscribed profiles', this.profiles);
  //     });
  // }


  // getBus()
  // {
  //   this.search.getAllBusUsers().subscribe(
  //     (data) => {
  //       console.log('busUsershtml', data);
  //     }
  //   );
  // }
}



