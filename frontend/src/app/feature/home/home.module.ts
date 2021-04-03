import { CommonModule } from '@angular/common';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ButtonsModule,
  MDBBootstrapModulesPro,
  NavbarModule,
  WavesModule,
} from 'ng-uikit-pro-standard';

import { HomeRoutingModule } from './home-routing.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, HomeRoutingModule, MDBBootstrapModulesPro.forRoot()],

  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeModule {}
