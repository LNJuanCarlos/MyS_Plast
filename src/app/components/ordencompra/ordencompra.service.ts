import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from 'src/app/views/pages/auth/login/auth.service';
import Swal from 'sweetalert2';
import { OrdenCompra } from './ordencompra';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrdencompraService {

  //private urlEndpoint: string = 'http://localhost:8080/ordencompra';
  private urlEndpoint: string = `${environment.apiUrl}/ordencompra`;

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
      if(this.authService.isAuthenticated){
        this.authService.logout();
      }
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

  obtenerOrdenesdeCompra(): Observable<OrdenCompra[]> {
    return this.http.get<OrdenCompra[]>(`${this.urlEndpoint}/listartop`, { headers: this.agregarAutorizationHeader() }).pipe(
      catchError(e => {
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }

  crearOrdenCompra(ordencompra: OrdenCompra): Observable<any> {
    return this.http.post<any>(`${this.urlEndpoint}/ordencompra`, ordencompra, { headers: this.agregarAutorizationHeader() }).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        if (this.isNoAutorizado(e)) {
          return throwError(e);
        }
        Swal.fire('Error al crear la Orden de Compra', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  obtenerOrdenCompra(id): Observable<OrdenCompra> {
    return this.http.get<OrdenCompra>(`${this.urlEndpoint}/buscar/${id}`, { headers: this.agregarAutorizationHeader() }).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        if (this.isNoAutorizado(e)) {
          return throwError(e);
        }
        Swal.fire('Error al obtener la Ordend de Compra', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  anularOrdenCompra(ordencompra: OrdenCompra): Observable<any> {
    return this.http.put<any>(`${this.urlEndpoint}/estado/${ordencompra.id_ORDENCOMPRA}`, ordencompra, { headers: this.agregarAutorizationHeader() }).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        if (this.isNoAutorizado(e)) {
          return throwError(e);
        }
        Swal.fire('Error al anular la Orden de Compra', e.error.mensaje, 'error');
        return throwError(e);
      })
    )
  }

  aprobarOrdenCompra(ordencompra: OrdenCompra): Observable<any> {
    return this.http.put<any>(`${this.urlEndpoint}/aprobar/${ordencompra.id_ORDENCOMPRA}`, ordencompra, { headers: this.agregarAutorizationHeader() }).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        if (this.isNoAutorizado(e)) {
          return throwError(e);
        }
        Swal.fire('Error al aprobar la Orden de Compra', e.error.mensaje, 'error');
        return throwError(e);
      })
    )
  }

  inventariarOrdenCompra(ordencompra: OrdenCompra): Observable<any> {
    return this.http.put<any>(`${this.urlEndpoint}/inventariar/${ordencompra.id_ORDENCOMPRA}`, ordencompra, { headers: this.agregarAutorizationHeader() }).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        if (this.isNoAutorizado(e)) {
          return throwError(e);
        }
        Swal.fire('Error al inventariar la Orden de Compra', e.error.mensaje, 'error');
        return throwError(e);
      })
    )
  }

  
  obtenerOrdenCompraFiltro(subalmacen, almacen, fecha1, fecha2): Observable<OrdenCompra[]> {
    return this.http.get<OrdenCompra[]>(`${this.urlEndpoint}/filtro?subalmacen=${subalmacen}&almacen=${almacen}&fecha1=${fecha1}&fecha2=${fecha2}`, { headers: this.agregarAutorizationHeader() }).pipe(
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

  obtenerOrdenesPendientesxUsuario(): Observable<OrdenCompra[]> {
    return this.http.get<OrdenCompra[]>(`${this.urlEndpoint}/ordenespendientes`, { headers: this.agregarAutorizationHeader() }).pipe(
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

  obtenerOrdenesDelMes(): Observable<OrdenCompra[]> {
    return this.http.get<OrdenCompra[]>(`${this.urlEndpoint}/ordenesdelmes`, { headers: this.agregarAutorizationHeader() }).pipe(
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
}
