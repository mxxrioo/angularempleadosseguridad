import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { Empleado } from '../models/empleado';
import { Usuario } from '../models/usuario';

@Injectable()
export class ServiceEmpleados {
  constructor(private _http: HttpClient, private _router: Router) {}

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  async login(usuario: Usuario): Promise<void> {
    this.cerrarSesion();
    let url = environment.urlApiEmpleados + 'Auth/Login';
    // La API devuelve el token dentro de la propiedad response.
    let data = await firstValueFrom(this._http.post<{ response: string }>(url, usuario));
    if (!data.response || typeof data.response !== 'string') {
      throw new Error('La API no ha devuelto un token válido.');
    }
    sessionStorage.setItem('token', data.response);
  }

  getPerfilEmpleado(): Promise<Empleado> {
    let url = environment.urlApiEmpleados + 'api/Empleados/PerfilEmpleado';
    return firstValueFrom(this._http.get<Empleado>(url, { headers: this.getHeaders() }));
  }

  getSubordinados(): Promise<Empleado[]> {
    let url = environment.urlApiEmpleados + 'api/Empleados/Subordinados';
    return firstValueFrom(this._http.get<Empleado[]>(url, { headers: this.getHeaders() }));
  }

  cerrarSesion(): void {
    sessionStorage.removeItem('token');
  }

  gestionarError(error: unknown): string {
    if (error instanceof HttpErrorResponse && (error.status === 401 || error.status === 403)) {
      this.cerrarSesion();
      void this._router.navigate(['/login']);
      return 'La sesión ha caducado. Vuelve a iniciar sesión.';
    }
    return 'No se han podido cargar los datos. Inténtalo de nuevo.';
  }

  private getHeaders(): HttpHeaders {
    // Enviamos el token en las peticiones protegidas.
    return new HttpHeaders({ Authorization: 'Bearer ' + this.getToken() });
  }
}
