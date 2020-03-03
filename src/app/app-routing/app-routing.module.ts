import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from 'src/app/components/login/login.component';
import { HomeComponent } from 'src/app/components/home/home.component';
import { AuthGuardService } from 'src/app/services/auth-guard.service';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'ca', component: HomeComponent, canActivate: [AuthGuardService],
  },
  { path: '**', redirectTo: '/ca' }
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, { useHash: true, scrollPositionRestoration: 'top' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
