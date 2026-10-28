import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceEmpleados } from '../../services/service.empleados';

@Component({
  selector: 'app-menu-component',
  standalone: false,
  templateUrl: './menu-component.html',
  styleUrl: './menu-component.css'
})
export class MenuComponent {
  constructor(public _service: ServiceEmpleados, private _router: Router) {}

  cerrarSesion(): void {
    this._service.cerrarSesion();
    void this._router.navigate(['/login']);
  }
}
