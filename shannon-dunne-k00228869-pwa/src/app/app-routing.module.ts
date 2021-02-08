import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { AngularFireAuthGuard, hasCustomClaim, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { SearchDirectoryComponent } from './components/search-directory/search-directory.component';
import { BusinessDashboardComponent } from './components/business-dashboard/business-dashboard.component';
import { BookingFormComponent } from './components/booking-form/booking-form.component';
import { ClientProfileComponent } from './components/client-profile/client-profile.component';
// import { canActivate } from '@angular/fire/auth-guard';
import { BusinessGuard } from './guards/business.guard';
import { ClientGuard } from './guards/client.guard';
const adminOnly = () => hasCustomClaim('admin');
const redirectUnauthorizedToLogin = ( redirectUnauthorizedTo (['login']));
const redirectLoggedInToDashboard = ( redirectLoggedInTo (['dashboard']));

const routes: Routes = [
  {path: 'sign-up', component: SignUpComponent},
  {path: 'login', component: LoginComponent},
  {path: 'landing-page', component: LandingPageComponent, pathMatch: 'full'},
  {path: 'dashboard/:id', component: BusinessDashboardComponent, canActivate: [BusinessGuard]},
  {path: 'search', component: SearchDirectoryComponent},
  {path: 'booking', component: BookingFormComponent, canActivate: [ClientGuard]},
  {path: 'client-profile/:id', component: ClientProfileComponent, canActivate: [ClientGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
