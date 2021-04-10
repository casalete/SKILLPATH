import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MDBBootstrapModulesPro, ToastModule } from 'ng-uikit-pro-standard';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { reducers } from '../store';
import { AuthEffects } from '../store/authentication/authentication.effects';
import { EffectsModule } from '@ngrx/effects';
import { AuthService } from './services/authService';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/authInterceptor';

// const entityMetadata: EntityMetadataMap = {
//   User: { selectId: selectUserId, noChangeTracking: true },
// };
// export function selectUserId(a: any): string {
//   return a.username;
// }

@NgModule({
    declarations: [NavbarComponent],
    imports: [
        CommonModule,
        MDBBootstrapModulesPro.forRoot(),
        RouterModule,
        StoreModule.forFeature('core', reducers),
        EffectsModule.forFeature([AuthEffects]),
        ToastModule.forRoot(),

        // EntityDataModule.forRoot({ entityMetadata }),
    ],
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
export class CoreModule {}
