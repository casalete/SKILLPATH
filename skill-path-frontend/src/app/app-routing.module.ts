import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService as AuthGuard } from './auth-guard.service';

const routes: Routes = [
  {
    path: 'login',
    pathMatch: 'full',
    loadChildren: () =>
      import('./feature/authentication/authentication.module').then(
        (m) => m.AuthenticationModule
      ),
    canActivate: [AuthGuard],
  },

  {
    path: 'home',
    loadChildren: () =>
      import('./feature/home/home.module').then((m) => m.HomeModule),
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
