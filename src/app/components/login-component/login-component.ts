import { ChangeDetectorRef, Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Usuario } from '../../models/usuario';
import { ServiceEmpleados } from '../../services/service.empleados';

@Component({
  selector: 'app-login-component',
  standalone: false,
  templateUrl: './login-component.html'
})
export class LoginComponent {
  public usuario: Usuario;
  public mensaje: string;
  public cargando: boolean;

  constructor(
    private _service: ServiceEmpleados,
    private _router: Router,
    private _cdr: ChangeDetectorRef
  ) {
    this.usuario = new Usuario('', '');
    this.mensaje = '';
    this.cargando = false;
  }

  async login(): Promise<void> {
    if (this.cargando) return;
    this.mensaje = '';
    this.cargando = true;
    try {
      await this._service.login(new Usuario(this.usuario.userName.trim().toUpperCase(), this.usuario.password));
      this.usuario.password = '';
      await this._router.navigate(['/perfil']);
    } catch (error) {
      this.mensaje = error instanceof HttpErrorResponse && (error.status === 400 || error.status === 401)
        ? 'Usuario o contraseña incorrectos.'
        : 'No se ha podido iniciar sesión. Comprueba la conexión e inténtalo de nuevo.';
    } finally {
      this.cargando = false;
      this._cdr.markForCheck();
    }
  }
}
