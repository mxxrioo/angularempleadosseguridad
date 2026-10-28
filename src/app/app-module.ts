import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { FormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { LoginComponent } from './components/login-component/login-component';
import { PerfilComponent } from './components/perfil-component/perfil-component';
import { SubordinadosComponent } from './components/subordinados-component/subordinados-component';
import { MenuComponent } from './components/menu-component/menu-component';
import { ServiceEmpleados } from './services/service.empleados';

@NgModule({
  declarations: [
    App, LoginComponent, PerfilComponent, SubordinadosComponent, MenuComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    ServiceEmpleados,
  ],
  bootstrap: [App]
})
export class AppModule { }
