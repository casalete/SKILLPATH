import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MDBBootstrapModulesPro, ToastModule } from 'ng-uikit-pro-standard';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AuthInterceptor } from './interceptors/authInterceptor';
import { AuthService } from './services/authService';

@NgModule({
    declarations: [NavbarComponent],
    imports: [CommonModule, HttpClientModule, MDBBootstrapModulesPro.forRoot(), RouterModule, ToastModule.forRoot()],
    exports: [NavbarComponent],
    providers: [
        AuthService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true,
        },
    ],
})
export class CoreModule {
    constructor(@Optional() @SkipSelf() core: CoreModule) {
        if (core) {
            throw new Error('You should import core module only in the root module');
        }
    }
}
