import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from 'src/app/views/pages/auth/login/auth.service';
import Swal from 'sweetalert2';
import { Ordenprod } from './ordenprod';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrdenprodService {

  //private urlEndpoint: string = 'http://localhost:8080/ordenprod';
  private urlEndpoint: string = `${environment.apiUrl}/ordenprod`;

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

  obtenerOrdenesdeProduccion(): Observable<Ordenprod[]> {
    return this.http.get<Ordenprod[]>(`${this.urlEndpoint}/listartop`, { headers: this.agregarAutorizationHeader() }).pipe(
      catchError(e => {
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }

  crearOrdenprod(ordenprod: Ordenprod): Observable<any> {
    return this.http.post<any>(`${this.urlEndpoint}/ordenprod`, ordenprod, { headers: this.agregarAutorizationHeader() }).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        if (this.isNoAutorizado(e)) {
          return throwError(e);
        }
        Swal.fire('Error al crear la Orden de Producción', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  obtenerOrdenprod(id): Observable<Ordenprod> {
    return this.http.get<Ordenprod>(`${this.urlEndpoint}/buscar/${id}`, { headers: this.agregarAutorizationHeader() }).pipe(
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

  anularOrdenprod(ordenprod: Ordenprod): Observable<any> {
    return this.http.put<any>(`${this.urlEndpoint}/estado/${ordenprod.id_ORDENPROD}`, ordenprod, { headers: this.agregarAutorizationHeader() }).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        if (this.isNoAutorizado(e)) {
          return throwError(e);
        }
        Swal.fire('Error al anular la Orden de Producción', e.error.mensaje, 'error');
        return throwError(e);
      })
    )
  }

  aprobarOrdenprod(ordenprod: Ordenprod): Observable<any> {
    return this.http.put<any>(`${this.urlEndpoint}/aprobar/${ordenprod.id_ORDENPROD}`, ordenprod, { headers: this.agregarAutorizationHeader() }).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        if (this.isNoAutorizado(e)) {
          return throwError(e);
        }
        Swal.fire('Error al aprobar la Orden de Producción', e.error.mensaje, 'error');
        return throwError(e);
      })
    )
  }

  inventariarOrdenprod(ordenprod: Ordenprod): Observable<any> {
    return this.http.put<any>(`${this.urlEndpoint}/inventariar/${ordenprod.id_ORDENPROD}`, ordenprod, { headers: this.agregarAutorizationHeader() }).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        if (this.isNoAutorizado(e)) {
          return throwError(e);
        }
        Swal.fire('Error al inventariar la Orden de Producción', e.error.mensaje, 'error');
        return throwError(e);
      })
    )
  }

  
  obtenerOrdenprodFiltro(subalmacen, almacen, fecha1, fecha2, estado): Observable<Ordenprod[]> {
    return this.http.get<Ordenprod[]>(`${this.urlEndpoint}/filtro?subalmacen=${subalmacen}&almacen=${almacen}&fecha1=${fecha1}&fecha2=${fecha2}&estado=${estado}`, { headers: this.agregarAutorizationHeader() }).pipe(
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

  obtenerOrdenesPendientesxUsuario(): Observable<Ordenprod[]> {
    return this.http.get<Ordenprod[]>(`${this.urlEndpoint}/ordenespendientes`, { headers: this.agregarAutorizationHeader() }).pipe(
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
