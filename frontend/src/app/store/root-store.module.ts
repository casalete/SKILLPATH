import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AuthStoreModule } from './authentication/auth-store.module';
import { NgrxDataModule } from './ngrx-data/ngrx-data.module';
import { RouterStoreModule } from './router';
import { ProfileStoreModule } from './profile/profile-store.module';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        StoreModule.forRoot(
            {},
            {
                runtimeChecks: {
                    strictStateImmutability: false,
                    strictActionImmutability: false,
                },
            },
        ),
        EffectsModule.forRoot([]),
        StoreDevtoolsModule.instrument({
            maxAge: 30,
        }),
        AuthStoreModule,
        ProfileStoreModule,
        NgrxDataModule,
        RouterStoreModule,
    ],
})
export class RootStoreModule {}
