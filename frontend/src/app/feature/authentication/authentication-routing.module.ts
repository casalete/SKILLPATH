import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    data: { layout: { navbar: false, sidebar: false, navbarRight: false } },
  },

  {
    path: 'register',
    component: RegisterComponent,
    data: { layout: { navbar: false, sidebar: false, navbarRight: false } },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthenticationRoutingModule {}
