import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
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
  public isReviews: boolean = false;
  public isReminders: boolean = false;

  constructor(
    public booking: BookingService,
    public business: BusinessService,
    public authService: AuthenticateService,
    private notif: NotificationsService


  ) { }

  ngOnInit(){

    this.business.getUserInfo().pipe(take(1)).subscribe(
        (data) =>
        {
          this.client = data;
        }
      );

    this.notif.getANotifications().pipe(take(1)).subscribe(
      (data) => {
        this.reminders = data;
        if (this.reminders.length === 0)
        {
          this.isReminders = false;
        }
        else{
          this.isReminders = true;
        }
      });

    this.notif.getRNotifications().pipe(take(1)).subscribe(
        (data) => {
          this.reviews = data;
          if (this.reviews.length === 0)
        {
          this.isReviews = false;
        }
        else{
          this.isReviews = true;
        }
        });
  }

}
