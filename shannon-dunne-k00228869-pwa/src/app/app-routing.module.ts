import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';
import { SearchDirectoryComponent } from './components/search-directory/search-directory.component';
import { BusinessDashboardComponent } from './components/business-dashboard/business-dashboard.component';
import { BookingFormComponent } from './components/booking-form/booking-form.component';
import { ClientProfileComponent } from './components/client-profile/client-profile.component';

// const redirect

const routes: Routes = [
  {path: 'sign-up', component: SignUpComponent},
  {path: 'login', component: LoginComponent},
  {path: 'landing-page', component: LandingPageComponent},
  {path: 'dashboard', component: BusinessDashboardComponent, canActivate: [AngularFireAuthGuard]},
  {path: 'search', component: SearchDirectoryComponent},
  {path: 'booking', component: BookingFormComponent, canActivate: [AngularFireAuthGuard]},
  {path: 'client-profile', component: ClientProfileComponent, canActivate: [AngularFireAuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
