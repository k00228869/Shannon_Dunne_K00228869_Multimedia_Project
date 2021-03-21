import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RescheduleService } from 'src/app/services/reschedule.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-cancel',
  templateUrl: './cancel.component.html',
  styleUrls: ['./cancel.component.css']
})
export class CancelComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<CancelComponent>,
    public reschedule: RescheduleService,
    private location: Location,
    @Inject(MAT_DIALOG_DATA) public data: {
      id: string,
      clientId: string,
      busId: string
    }
  ) { }

  ngOnInit(){
  }

  close()
  {
    console.log('dialog closed');
    this.dialogRef.close(this.data);
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
    // this.cancel();
    close();
    // this.route.navigate(['/business-view/', this.appointmentInfo.bid]);

  }
}
