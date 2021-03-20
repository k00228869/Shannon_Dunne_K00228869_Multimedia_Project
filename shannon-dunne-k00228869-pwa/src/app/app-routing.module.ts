import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './user-components/login/login.component';
import { SignUpComponent } from './user-components/sign-up/sign-up.component';
import { LandingPageComponent } from './client-components/landing-page/landing-page.component';
import { AngularFireAuthGuard, hasCustomClaim, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { SearchDirectoryComponent } from './client-components/search-directory/search-directory.component';
import { BusinessDashboardComponent } from './business-components/business-dashboard/business-dashboard.component';
import { BookingFormComponent } from './client-components/booking-form/booking-form.component';
import { ClientProfileComponent } from './client-components/client-profile/client-profile.component';
import { ProfileBusinessViewComponent } from './business-components/profile-business-view/profile-business-view.component';
import { AddBusinessComponent } from './business-components/add-business/add-business.component';
import { BusinessProfileComponent } from './client-components/business-profile/business-profile.component';
import { BookingConfirmationComponent } from './client-components/booking-confirmation/booking-confirmation.component';
import { AppointmentsComponent } from './client-components/appointments/appointments.component';
import { RescheduleFormComponent } from './client-components/booking-confirmation/reschedule-form/reschedule-form.component';
import { FeedbackFormComponent } from './client-components/feedback-form/feedback-form.component';
import { NotificationListComponent } from './client-components/notification-list/notification-list.component';
import { ReplyFormComponent } from './business-components/reply-form/reply-form.component';
import { CancelComponent } from './client-components/booking-confirmation/cancel/cancel.component';
import { AdvertiseAppointmentComponent } from './business-components/advertise-appointment/advertise-appointment.component';



const routes: Routes = [
  {path: 'landing-page', component: LandingPageComponent, pathMatch: 'full'},
  {path: 'sign-up', component: SignUpComponent},
  {path: 'login', component: LoginComponent},
  {path: 'dashboard/:id', component: BusinessDashboardComponent},
  {path: 'search', component: SearchDirectoryComponent},
  {path: 'booking/:id', component: BookingFormComponent},
  {path: 'client-profile/:id', component: ClientProfileComponent},
  {path: 'business-view/:id', component: ProfileBusinessViewComponent},
  {path: 'add-business', component: AddBusinessComponent},
  {path: 'business-profile/:id', component: BusinessProfileComponent},
  {path: 'booking-confirmed/:id', component: BookingConfirmationComponent},
  {path: 'appointment/:id', component: AppointmentsComponent},
  {path: 'reschedule/:id', component: RescheduleFormComponent},
  {path: 'review/:id', component: FeedbackFormComponent},
  {path: 'reply/:id', component: ReplyFormComponent},
  {path: 'notification/:id', component: NotificationListComponent},
  {path: 'cancel/:id', component: CancelComponent},
  {path: 'advertise-appointment/:id', component: AdvertiseAppointmentComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'corrected' })],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
