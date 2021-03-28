import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MDBBootstrapModulesPro } from 'ng-uikit-pro-standard';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { LoginComponent } from './components/login/login.component';
import { SharedModule } from '../../shared/shared/shared.module';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    SharedModule,
    AuthenticationRoutingModule,
    MDBBootstrapModulesPro.forRoot(),
  ],
})
export class AuthenticationModule {}
