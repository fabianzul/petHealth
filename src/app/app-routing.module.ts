import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {HomePageComponent} from './components/home-page/home-page.component'
import {LoginPageComponent} from './components/login-page/login-page.component'
import { DashboardPageComponent } from './components/dashboard-page/dashboard-page.component';

import { AuthGuard } from './guards/auth.guard';

import { VisorPageComponent } from './components/visor-page/visor-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '', component: HomePageComponent},
  { path: 'login', component: LoginPageComponent },
  { path: 'dashboard', component: DashboardPageComponent, canActivate: [AuthGuard] },
  { path: 'visor', component: VisorPageComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
