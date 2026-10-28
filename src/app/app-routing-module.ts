import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './components/login-component/login-component';
import { PerfilComponent } from './components/perfil-component/perfil-component';
import { SubordinadosComponent } from './components/subordinados-component/subordinados-component';
import { seguridadGuard } from './guards/seguridad-guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'perfil', component: PerfilComponent, canActivate: [seguridadGuard] },
  { path: 'subordinados', component: SubordinadosComponent, canActivate: [seguridadGuard] },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
