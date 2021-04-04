import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RescheduleService } from 'src/app/services/reschedule.service';
import { Router } from '@angular/router';
import { NotificationsService } from 'src/app/services/notifications.service';

@Component({
  selector: 'app-cancel',
  templateUrl: './cancel.component.html',
  styleUrls: ['./cancel.component.css'],
})
export class CancelComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<CancelComponent>,
    public reschedule: RescheduleService,
    private router: Router,
    private notif: NotificationsService,
    @Inject(MAT_DIALOG_DATA) // retrieve dialog data through injection
    public data: {
      // type of data injected from confirmation page
      id: string;
      clientId: string;
      busId: string;
      date: string;
    }
  ) {}

  ngOnInit() {}

  close() {
    // close the dialog
    this.dialogRef.close();
  }

  cancelBooking() {
    this.reschedule.addToCancelList(this.data.id, this.data.busId); // call func to add cancelled booking to business cancellation list
    this.reschedule.cancelClientBooking(this.data.id, this.data.clientId); // call func to remove the clients appointment
    this.notif.deleteANotifications(this.data.id); // call func to delete old appointment notification
    this.notif.deleteRNotifications(this.data.busId); // call func to delete old review notification
    close(); // call func to close the dialog
    this.changeRoute(); // call func to change route
  }

  changeRoute() {
    // go to userappointment route
    this.router.navigate(['/appointment/', this.data.clientId]);
  }
}
