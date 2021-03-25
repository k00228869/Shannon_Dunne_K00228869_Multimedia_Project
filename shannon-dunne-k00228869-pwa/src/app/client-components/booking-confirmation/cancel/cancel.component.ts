import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RescheduleService } from 'src/app/services/reschedule.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { NotificationsService } from 'src/app/services/notifications.service';

@Component({
  selector: 'app-cancel',
  templateUrl: './cancel.component.html',
  styleUrls: ['./cancel.component.css']
})
export class CancelComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<CancelComponent>,
    public reschedule: RescheduleService,
    private router: Router,
    private location: Location,
    private notif: NotificationsService,
    @Inject(MAT_DIALOG_DATA) public data: {
      id: string,
      clientId: string,
      busId: string,
      date: string
    }
  ) { }

  ngOnInit(){
  }

  close()
  {
    console.log('dialog closed');
    this.dialogRef.close();
  }

  cancel()
  {
    this.location.back();
  }

  cancelBooking()
  {
    console.log('data passes to dialog', this.data);
    this.reschedule.addToCancelList(this.data.id, this.data.busId);
    this.reschedule.cancelClientBooking(this.data.id, this.data.clientId);
    this.notif.deleteANotifications(this.data.date); // delete old appointment notification
    this.notif.deleteRNotifications(this.data.busId); // delete old review notification
    // this.cancel();
    close();
    this.changeRoute();
  }


  changeRoute(){
    this.router.navigate(['/appointment/', this.data.clientId]);
  }
}