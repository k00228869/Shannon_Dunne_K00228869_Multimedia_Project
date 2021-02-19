import { Component, OnInit } from '@angular/core';
import { IUser } from 'src/app/i-user';
import { from, Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-business-list',
  templateUrl: './business-list.component.html',
  styleUrls: ['./business-list.component.css']
})
export class BusinessListComponent implements OnInit {

  constructor(
    public firestore: AngularFirestore,

  ) { }

  ngOnInit(): void {
  }


  // public getAllBusinesses(): Observable<IUser['business']>
  // {
  //   let docref;
  //   docref = this.firestore.collection('users').doc<IUser['user']>().collection<IUser['business']>
  //   return docref.where('profileCreated', '==', 'true').valueChanges();
  // }

}
