import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MDBBootstrapModulesPro } from 'ng-uikit-pro-standard';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    AuthenticationRoutingModule,
    MDBBootstrapModulesPro.forRoot(),
  ],
})
export class AuthenticationModule {}
