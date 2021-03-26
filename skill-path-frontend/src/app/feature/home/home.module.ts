import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { MDBBootstrapModulesPro } from 'ng-uikit-pro-standard';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    MDBBootstrapModulesPro.forRoot(),
  ],
})
export class HomeModule {}
