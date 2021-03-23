import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material-module';
import { LoginComponent } from './user-components/login/login.component';
import { SignUpComponent } from './user-components/sign-up/sign-up.component';
import { LandingPageComponent } from './client-components/landing-page/landing-page.component';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { AuthenticateService } from './services/authenticate.service';
import { BusinessDashboardComponent } from './business-components/business-dashboard/business-dashboard.component';
import { SearchDirectoryComponent } from './client-components/search-directory/search-directory.component';
import { BookingFormComponent } from './client-components/booking-form/booking-form.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ClientProfileComponent } from './client-components/client-profile/client-profile.component';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ProfileBusinessViewComponent } from './business-components/profile-business-view/profile-business-view.component';
import { AddBusinessComponent } from './business-components/add-business/add-business.component';
import { BusinessService } from './services/business.service';
import { BusinessProfileComponent } from './client-components/business-profile/business-profile.component';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { BusinessListComponent } from './client-components/search-directory/business-list/business-list.component';
import { BusinessDealsComponent } from './client-components/search-directory/business-deals/business-deals.component';
import { ClientUserService } from 'src/app/services/client-user.service';
import { UploadsService } from './services/uploads.service';
import { BookingConfirmationComponent } from './client-components/booking-confirmation/booking-confirmation.component';
import { AppointmentsComponent } from './client-components/appointments/appointments.component';
import { BookingService } from './services/booking.service';
import { SearchQueriesService } from './services/search-queries.service';
import { WorkingDaysService } from './services/working-days.service';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { NotificationsService } from './services/notifications.service';
import { RescheduleFormComponent } from './client-components/booking-confirmation/reschedule-form/reschedule-form.component';
import { FeedbackFormComponent } from './client-components/feedback-form/feedback-form.component';
import { NotificationListComponent } from './client-components/notification-list/notification-list.component';
import { BusinessNotificationsComponent } from './business-components/business-notifications/business-notifications.component';
import { ReplyFormComponent } from './business-components/reply-form/reply-form.component';
import { CancelComponent } from './client-components/booking-confirmation/cancel/cancel.component';
import { AdvertiseAppointmentComponent } from './business-components/advertise-appointment/advertise-appointment.component';
import { BookDealComponent } from './client-components/book-deal/book-deal.component';
import { ResetDetailsComponent } from './user-components/reset-details/reset-details.component';
import { EditBusinessComponent } from './business-components/edit-business/edit-business.component';
import { ToastService } from './services/toast.service';
import { RescheduleService } from './services/reschedule.service';
import { FeedbackService } from './services/feedback.service';
import { EditBusinessService } from './services/edit-business.service';

// import { MomentModule } from 'ngx-moment';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignUpComponent,
    LandingPageComponent,
    BusinessDashboardComponent,
    SearchDirectoryComponent,
    BookingFormComponent,
    ClientProfileComponent,
    ProfileBusinessViewComponent,
    AddBusinessComponent,
    BusinessProfileComponent,
    BusinessListComponent,
    BusinessDealsComponent,
    BookingConfirmationComponent,
    AppointmentsComponent,
    RescheduleFormComponent,
    FeedbackFormComponent,
    NotificationListComponent,
    BusinessNotificationsComponent,
    ReplyFormComponent,
    CancelComponent,
    AdvertiseAppointmentComponent,
    BookDealComponent,
    ResetDetailsComponent,
    EditBusinessComponent
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFirestoreModule,
    MaterialModule,
    AngularFireStorageModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireMessagingModule,
    ServiceWorkerModule.register('combined-sw.js', { enabled: environment.production })
  ],
  providers: [
    AuthenticateService,
    BusinessService,
    ClientUserService,
    UploadsService,
    BookingService,
    SearchQueriesService,
    NotificationsService,
    WorkingDaysService,
    ToastService,
    BookingService,
    RescheduleService,
    FeedbackService,
    EditBusinessService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
