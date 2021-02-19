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


// import { canActivate } from '@angular/fire/auth-guard';
import { BusinessGuard } from './guards/business.guard';
import { ClientGuard } from './guards/client.guard';
// const adminOnly = () => hasCustomClaim('admin');
// const redirectUnauthorizedToLogin = ( redirectUnauthorizedTo (['login']));
// const redirectLoggedInToDashboard = ( redirectLoggedInTo (['dashboard']));

// const routes: Routes = [
//   {path: 'sign-up', component: SignUpComponent},
//   {path: 'login', component: LoginComponent},
//   {path: 'landing-page', component: LandingPageComponent, pathMatch: 'full'},
//   {path: 'dashboard/:id', component: BusinessDashboardComponent, canActivate: [BusinessGuard]},
//   {path: 'search', component: SearchDirectoryComponent},
//   {path: 'booking', component: BookingFormComponent, canActivate: [ClientGuard]},
//   {path: 'client-profile/:id', component: ClientProfileComponent, canActivate: [ClientGuard]},
//   {path: 'business-view/:id', component: ProfileBusinessViewComponent},
//   {path: 'add-business', component: AddBusinessComponent}
// ];


const routes: Routes = [
  {path: 'sign-up', component: SignUpComponent},
  {path: 'login', component: LoginComponent},
  {path: 'landing-page', component: LandingPageComponent, pathMatch: 'full'},
  {path: 'dashboard/:id', component: BusinessDashboardComponent},
  {path: 'search', component: SearchDirectoryComponent},
  {path: 'booking', component: BookingFormComponent},
  {path: 'client-profile/:id', component: ClientProfileComponent},
  {path: 'business-view/:id', component: ProfileBusinessViewComponent},
  {path: 'add-business', component: AddBusinessComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
