import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Empleado } from '../../models/empleado';
import { ServiceEmpleados } from '../../services/service.empleados';

@Component({
  selector: 'app-subordinados-component',
  standalone: false,
  templateUrl: './subordinados-component.html'
})
export class SubordinadosComponent implements OnInit {
  public empleados: Array<Empleado> = [];
  public mensaje: string = '';
  public cargando: boolean = true;

  constructor(private _service: ServiceEmpleados, private _cdr: ChangeDetectorRef) {}

  async ngOnInit(): Promise<void> {
    try {
      this.empleados = await this._service.getSubordinados();
    } catch (error) {
      this.mensaje = this._service.gestionarError(error);
    } finally {
      this.cargando = false;
      this._cdr.markForCheck();
    }
  }
}
