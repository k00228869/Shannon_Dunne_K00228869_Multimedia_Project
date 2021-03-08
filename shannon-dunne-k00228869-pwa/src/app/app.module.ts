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
    AppointmentsComponent
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    AngularFireStorageModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    AngularFirestoreModule
  ],
  providers: [AuthenticateService, BusinessService, ClientUserService, UploadsService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
