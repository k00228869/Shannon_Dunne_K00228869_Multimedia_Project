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
  public id: string;
  constructor(
    public business: BusinessService,
  ) { }

  ngOnInit(){

    this.business.getAllBusinesses().subscribe(
      (data) =>
      {
        this.profiles = data;
        console.log('businesses', this.profiles[0]);
        // this.id = this.profiles.id;
      });
  }



}
