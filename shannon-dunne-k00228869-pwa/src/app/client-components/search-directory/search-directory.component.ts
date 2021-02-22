import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { IUser } from 'src/app/i-user';
import { ClientUserService } from 'src/app/services/client-user.service';


@Component({
  selector: 'app-search-directory',
  templateUrl: './search-directory.component.html',
  styleUrls: ['./search-directory.component.css']
})
export class SearchDirectoryComponent implements OnInit {
  display = false;
  deal = false;
  public client: IUser['user'];

  constructor(
    public firestore: AngularFirestore,
    public clientService: ClientUserService,
    ) { }

  ngOnInit(){
    this.routeId();
  }

routeId(){
  this.clientService.getUserInfo().subscribe(
    (data) =>
    {
      this.client = data;
    }
  );
}

  onSearch()
  {
    this.display = true;
    // this.display = !this.display;
  }
  
  onDeal()
  {
    this.deal = true;
    // this.display = !this.display;
  }


}
