import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { routerReducer, StoreRouterConnectingModule, RouterState } from '@ngrx/router-store';

@NgModule({
    declarations: [],
    imports: [
        StoreModule.forFeature('router', routerReducer),
        StoreRouterConnectingModule.forRoot({
            routerState: RouterState.Minimal,
        }),
    ],
    exports: [StoreRouterConnectingModule],
})
export class RouterStoreModule {}
