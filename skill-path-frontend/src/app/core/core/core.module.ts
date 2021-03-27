import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import {
  MDBBootstrapModulesPro,
  MDBSpinningPreloader,
} from 'ng-uikit-pro-standard';

@NgModule({
  declarations: [NavbarComponent],
  imports: [CommonModule, MDBBootstrapModulesPro.forRoot()],
  exports: [NavbarComponent],
})
export class CoreModule {}
