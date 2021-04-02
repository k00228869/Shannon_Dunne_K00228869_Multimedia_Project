import { Component, OnInit } from '@angular/core';
import { IBusiness } from 'src/app/interfaces/i-business';
import { IUser } from 'src/app/interfaces/i-user';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { BookingService } from 'src/app/services/booking.service';
import { BusinessService } from 'src/app/services/business.service';
import { NotificationsService } from 'src/app/services/notifications.service';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.css']
})
export class NotificationListComponent implements OnInit {
  public appointmentInfo: IUser['appointment'];
  public id: string;
  public busInfo: IBusiness['business'];
  client: IUser['user'];
  public reminders: IUser['notificationMessage'][];
  public reviews: IUser['notificationMessage'][];

  constructor(
    public booking: BookingService,
    public business: BusinessService,
    public authService: AuthenticateService,
    private notif: NotificationsService


  ) { }

  ngOnInit(){

    this.business.getUserInfo().subscribe(
        (data) =>
        {
          this.client = data;
        }
      );

    this.notif.getANotifications().subscribe(
      (data) => {
        this.reminders = data;
      });

    this.notif.getRNotifications().subscribe(
        (data) => {
          this.reviews = data;
        });
  }

}
