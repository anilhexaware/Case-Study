import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './shared/auth.guard';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: 'login', component: LoginComponent },
  {
    path: 'header',
    component: HeaderComponent,
    children: [
      { path: 'user', component: UserComponent },
      { path: 'admin', component: AdminComponent, canActivate:[AuthGuard]},
    ],
  },
  // { path: 'user', component: UserComponent },
  // { path: 'admin', component: AdminComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
export const routingcomponents = [];
