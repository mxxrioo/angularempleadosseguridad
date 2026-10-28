import { TestBed } from '@angular/core/testing';
import { provideHttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router, UrlTree } from '@angular/router';
import { ServiceEmpleados } from './services/service.empleados';
import { seguridadGuard } from './guards/seguridad-guard';
import { Usuario } from './models/usuario';
import { environment } from '../environments/environment';

describe('Seguridad de empleados', () => {
  let service: ServiceEmpleados;
  let http: HttpTestingController;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({
      providers: [ServiceEmpleados, provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(ServiceEmpleados);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    sessionStorage.clear();
  });

  function comprobarAcceso() {
    return TestBed.runInInjectionContext(() => seguridadGuard({} as never, {} as never));
  }

  it('redirige a login cuando no hay token', () => {
    let resultado = comprobarAcceso() as UrlTree;
    expect(TestBed.inject(Router).serializeUrl(resultado)).toBe('/login');
  });

  it('permite el acceso con token y lo bloquea tras cerrar sesión', () => {
    sessionStorage.setItem('token', 'token-prueba');
    expect(comprobarAcceso()).toBe(true);
    service.cerrarSesion();
    expect(comprobarAcceso() instanceof UrlTree).toBe(true);
  });

  it('envía las credenciales y guarda el token devuelto por la API', async () => {
    let resultado = service.login(new Usuario('REY', '7839'));
    let request = http.expectOne(environment.urlApiEmpleados + 'Auth/Login');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ userName: 'REY', password: '7839' });
    request.flush({ response: 'token-prueba' });
    await resultado;
    expect(service.getToken()).toBe('token-prueba');
  });

  it('envía Bearer al consultar perfil y subordinados', async () => {
    sessionStorage.setItem('token', 'token-prueba');
    let perfil = service.getPerfilEmpleado();
    let request = http.expectOne(environment.urlApiEmpleados + 'api/Empleados/PerfilEmpleado');
    expect(request.request.headers.get('Authorization')).toBe('Bearer token-prueba');
    request.flush({ idEmpleado: 7839, apellido: 'REY', oficio: 'PRESIDENTE', salario: 650000, director: 0 });
    expect((await perfil).apellido).toBe('REY');
    let subordinados = service.getSubordinados();
    request = http.expectOne(environment.urlApiEmpleados + 'api/Empleados/Subordinados');
    expect(request.request.headers.get('Authorization')).toBe('Bearer token-prueba');
    request.flush([]);
    expect(await subordinados).toEqual([]);
  });

  it('elimina un token anterior si las credenciales son incorrectas', async () => {
    sessionStorage.setItem('token', 'token-anterior');
    let resultado = service.login(new Usuario('REY', 'incorrecta'));
    let comprobacion = expect(resultado).rejects.toBeInstanceOf(HttpErrorResponse);
    http.expectOne(environment.urlApiEmpleados + 'Auth/Login').flush({}, { status: 401, statusText: 'Unauthorized' });
    await comprobacion;
    expect(service.getToken()).toBeNull();
  });
});
