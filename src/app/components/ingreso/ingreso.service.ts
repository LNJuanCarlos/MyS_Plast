import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/views/pages/auth/login/auth.service';
import { Ingreso } from './ingreso';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IngresoService {

  //private urlEndpoint: string = 'http://localhost:8080/ingreso';
  private urlEndpoint: string = `${environment.apiUrl}/ingreso`;

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  private agregarAutorizationHeader() {
    let token = this.authService.token;
    if (token != null) {
      return this.httpHeaders.append('Authorization', 'Bearer ' + token);
    }
    return this.httpHeaders;
  }

  private isNoAutorizado(e): boolean {
    if (e.status == 401) {
      this.router.navigate(['/auth/login']);
      return true;
    }
    if (e.status == 403) {
      Swal.fire('Acceso Denegado', `Hola ${this.authService.usuario.username}, no tienes permiso para acceder a este recurso!`, 'warning');
      this.router.navigate(['/']);
      return true;
    }
    return false;
  }

  obtenerIngresoFiltro(subalmacen, almacen, fecha1, fecha2): Observable<Ingreso[]> {
    return this.http.get<Ingreso[]>(`${this.urlEndpoint}/filtro?subalmacen=${subalmacen}&almacen=${almacen}&fecha1=${fecha1}&fecha2=${fecha2}`, { headers: this.agregarAutorizationHeader() }).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        if (this.isNoAutorizado(e)) {
          return throwError(e);
        }
        Swal.fire({
          icon: 'error',
          title: "<b><h1 style='color:red'>" + 'Error!' + "</h1></b>",
          text: e.error.mensaje,

        })
        return throwError(e);
      })
    );
  }

  obtenerIngresos(): Observable<Ingreso[]> {
    return this.http.get<Ingreso[]>(`${this.urlEndpoint}/listartop`, { headers: this.agregarAutorizationHeader() }).pipe(
      catchError(e => {
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }

  crearWhingreso(ingreso: Ingreso): Observable<any> {
    return this.http.post<any>(`${this.urlEndpoint}/ingreso`, ingreso, { headers: this.agregarAutorizationHeader() }).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        if (this.isNoAutorizado(e)) {
          return throwError(e);
        }
        Swal.fire('Error al crear el Ingreso de Producto', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  obtenerWhingreso(id): Observable<Ingreso> {
    return this.http.get<Ingreso>(`${this.urlEndpoint}/buscar/${id}`, { headers: this.agregarAutorizationHeader() }).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        if (this.isNoAutorizado(e)) {
          return throwError(e);
        }
        Swal.fire('Error al obtener el Ingreso de Producto', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  obtenerWhingresoxOrden(norden): Observable<Ingreso> {
    return this.http.get<Ingreso>(`${this.urlEndpoint}/buscarnorden/${norden}`, { headers: this.agregarAutorizationHeader() }).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        if (this.isNoAutorizado(e)) {
          return throwError(e);
        }
        Swal.fire('Error al obtener el Ingreso de Producto', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  anularWhingreso(ingreso: Ingreso): Observable<any> {
    return this.http.put<any>(`${this.urlEndpoint}/estado/${ingreso.id_TRAN}`, ingreso, { headers: this.agregarAutorizationHeader() }).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        if (this.isNoAutorizado(e)) {
          return throwError(e);
        }
        Swal.fire('Error al anular el Ingreso de Producto', e.error.mensaje, 'error');
        return throwError(e);
      })
    )
  }

  obtenerIngresosDelMes(): Observable<Ingreso[]> {
    return this.http.get<Ingreso[]>(`${this.urlEndpoint}/ingresosmesactual`, { headers: this.agregarAutorizationHeader() }).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        if (this.isNoAutorizado(e)) {
          return throwError(e);
        }
        Swal.fire({
          icon: 'error',
          title: "<b><h1 style='color:red'>" + 'Error!' + "</h1></b>",
          text: e.error.mensaje,

        })
        return throwError(e);
      })
    );
  }

  obtenerIngresoxOrden(norden): Observable<Ingreso> {
    return this.http.get<Ingreso>(`${this.urlEndpoint}/buscarnorden/${norden}`, { headers: this.agregarAutorizationHeader() }).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        if (this.isNoAutorizado(e)) {
          return throwError(e);
        }
        Swal.fire('Error al obtener el Ingreso de Producto', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

}
