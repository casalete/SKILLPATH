import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService as AuthGuard } from './auth-guard.service';
import { HomeComponent } from './feature/home/components/home/home.component';

const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./feature/authentication/authentication.module').then((m) => m.AuthenticationModule),
    },

    {
        path: '',
        loadChildren: () => import('./feature/home/home.module').then((m) => m.HomeModule),
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
