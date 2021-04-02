import { Component, OnInit } from '@angular/core';
import { BusinessService } from 'src/app/services/business.service';
import { SearchQueriesService } from 'src/app/services/search-queries.service';
import {SearchDirectoryComponent} from 'src/app/client-components/search-directory/search-directory.component';
@Component({
  selector: 'app-business-list',
  templateUrl: './business-list.component.html',
  styleUrls: ['./business-list.component.css']
})
export class BusinessListComponent implements OnInit {

  constructor(
    public business: BusinessService,
    public search: SearchQueriesService,
    public searchComp: SearchDirectoryComponent
  ) { }

   ngOnInit(){
   }



}



