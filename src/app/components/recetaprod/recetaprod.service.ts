import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from 'src/app/views/pages/auth/login/auth.service';
import Swal from 'sweetalert2';
import { Recetaprod } from './recetaprod';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecetaprodService {

  //private urlEndpoint: string = 'http://localhost:8080/recetaprod';
  private urlEndpoint: string = `${environment.apiUrl}/recetaprod`;

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

  obtenerRecetas(): Observable<Recetaprod[]> {
    return this.http.get<Recetaprod[]>(`${this.urlEndpoint}/listar`, { headers: this.agregarAutorizationHeader() }).pipe(
      catchError(e => {
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }

  crearRecetaprod(recetaprod: Recetaprod): Observable<any> {
    return this.http.post<any>(`${this.urlEndpoint}/crear`, recetaprod, { headers: this.agregarAutorizationHeader() }).pipe(
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

  obtenerRecetaprod(id): Observable<Recetaprod> {
    return this.http.get<Recetaprod>(`${this.urlEndpoint}/buscar/${id}`, { headers: this.agregarAutorizationHeader() }).pipe(
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

  anularRecetaprod(recetaprod: Recetaprod): Observable<any> {
    return this.http.put<any>(`${this.urlEndpoint}/actualizar/${recetaprod.id_RECETA}`, recetaprod, { headers: this.agregarAutorizationHeader() }).pipe(
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

  
  obtenerRecetaprodFiltro(nroreceta, producto, nomreceta): Observable<Recetaprod[]> {
    return this.http.get<Recetaprod[]>(`${this.urlEndpoint}/filtro?nroreceta=${nroreceta}&producto=${producto}&nomreceta=${nomreceta}`, { headers: this.agregarAutorizationHeader() }).pipe(
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

  obtenerRecetaxProducto(producto: String): Observable<Recetaprod> {
    return this.http.get<Recetaprod>(`${this.urlEndpoint}/filtrar-recetaprod/${producto}`, { headers: this.agregarAutorizationHeader() }).pipe(
      catchError(e => {
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }
}
