import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ServiceEmpleados } from '../services/service.empleados';

// Sin token, redirigimos antes de entrar al componente.
export const seguridadGuard: CanActivateFn = () => {
  let service = inject(ServiceEmpleados);
  let router = inject(Router);
  return service.getToken() ? true : router.createUrlTree(['/login']);
};
