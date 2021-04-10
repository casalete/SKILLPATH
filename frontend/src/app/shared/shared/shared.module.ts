import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MDBBootstrapModulesPro } from 'ng-uikit-pro-standard';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [],
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    exports: [MDBBootstrapModulesPro, FormsModule, ReactiveFormsModule],

    schemas: [],
})
export class SharedModule {}
