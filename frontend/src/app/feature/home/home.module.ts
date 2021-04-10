import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { ButtonsModule, MDBBootstrapModulesPro, NavbarModule, WavesModule } from 'ng-uikit-pro-standard';

import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from '../../shared/shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HomeComponent } from './components/home/home.component';

@NgModule({
    declarations: [HomeComponent],
    imports: [CommonModule, HomeRoutingModule, MDBBootstrapModulesPro.forRoot(), SharedModule],

    schemas: [],
})
export class HomeModule {}
