import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { GoogleChartsModule } from 'angular-google-charts';
import { MDBBootstrapModulesPro } from 'ng-uikit-pro-standard';
import { SankeyGoogleComponent } from './sankey-google/sankey-google.component';
import { SankeyComponent } from './sankey/sankey.component';
import { NgxGraphWrapperComponent } from './ngx-graph-wrapper/ngx-graph-wrapper.component';

@NgModule({
    declarations: [SankeyComponent, SankeyGoogleComponent, NgxGraphWrapperComponent],
    imports: [CommonModule, FormsModule, ReactiveFormsModule, GoogleChartsModule, NgxGraphModule, MDBBootstrapModulesPro.forRoot()],
    exports: [
        MDBBootstrapModulesPro,
        FormsModule,
        ReactiveFormsModule,
        SankeyComponent,
        GoogleChartsModule,
        SankeyGoogleComponent,
        NgxGraphModule,
        NgxGraphWrapperComponent,
    ],

    schemas: [],
})
export class SharedModule {}
