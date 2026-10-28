import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Empleado } from '../../models/empleado';
import { ServiceEmpleados } from '../../services/service.empleados';

@Component({
  selector: 'app-perfil-component',
  standalone: false,
  templateUrl: './perfil-component.html'
})
export class PerfilComponent implements OnInit {
  public empleado: Empleado | null = null;
  public mensaje: string = '';
  public cargando: boolean = true;

  constructor(private _service: ServiceEmpleados, private _cdr: ChangeDetectorRef) {}

  async ngOnInit(): Promise<void> {
    try {
      this.empleado = await this._service.getPerfilEmpleado();
    } catch (error) {
      this.mensaje = this._service.gestionarError(error);
    } finally {
      this.cargando = false;
      this._cdr.markForCheck();
    }
  }
}
