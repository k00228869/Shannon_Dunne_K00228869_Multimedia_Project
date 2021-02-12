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
    BusinessProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [AuthenticateService, BusinessService],
  bootstrap: [AppComponent]
})
export class AppModule { }
