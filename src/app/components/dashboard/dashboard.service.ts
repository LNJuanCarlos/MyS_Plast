import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from 'src/app/views/pages/auth/login/auth.service';
import Swal from 'sweetalert2';
import { Inventariofisico } from '../inventariofisico/inventariofisico';
import { OrdenCompra } from '../ordencompra/ordencompra';
import { Ordenprod } from '../ordenprod/ordenprod';
import { ConsultaGastosMes } from './consultagastosmes';
import { TopProductosKardex } from './topproductoskardex';
import { TopProductosProduccion } from './topproductosproduccion';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  //private urlEndpoint: string = 'http://localhost:8080/dashboard';
  private urlEndpoint: string = `${environment.apiUrl}/dashboard`;

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

  topProductosProduccion(): Observable<TopProductosProduccion[]> {
    return this.http.get<TopProductosProduccion[]>(`${this.urlEndpoint}/topproductosproduccion`, { headers: this.agregarAutorizationHeader() }).pipe(
      catchError(e => {
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }

  topProductosEgresos(): Observable<TopProductosKardex[]> {
    return this.http.get<TopProductosKardex[]>(`${this.urlEndpoint}/topproductosegresos`, { headers: this.agregarAutorizationHeader() }).pipe(
      catchError(e => {
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }

  topProductosIngresos(): Observable<TopProductosKardex[]> {
    return this.http.get<TopProductosKardex[]>(`${this.urlEndpoint}/topproductosingresos`, { headers: this.agregarAutorizationHeader() }).pipe(
      catchError(e => {
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }

  obtenerGastosMesLocal(): Observable<ConsultaGastosMes[]> {
    return this.http.get<ConsultaGastosMes[]>(`${this.urlEndpoint}/gastosmeslocal`, { headers: this.agregarAutorizationHeader() }).pipe(
      catchError(e => {
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }

  obtenerGastosMesExtranjera(): Observable<ConsultaGastosMes[]> {
    return this.http.get<ConsultaGastosMes[]>(`${this.urlEndpoint}/gastosmesextranjera`, { headers: this.agregarAutorizationHeader() }).pipe(
      catchError(e => {
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }

  obtenerInventariosPendientes(): Observable<Inventariofisico[]> {
    return this.http.get<Inventariofisico[]>(`${this.urlEndpoint}/inventariofisico/pendientes`, { headers: this.agregarAutorizationHeader() }).pipe(
      catchError(e => {
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }

  obtenerOrdenesCompraPendientes(): Observable<OrdenCompra[]> {
    return this.http.get<OrdenCompra[]>(`${this.urlEndpoint}/ordencompra/pendiente`, { headers: this.agregarAutorizationHeader() }).pipe(
      catchError(e => {
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }

  obtenerOrdenProdPendientes(): Observable<Ordenprod[]> {
    return this.http.get<Ordenprod[]>(`${this.urlEndpoint}/ordenprod/pendiente`, { headers: this.agregarAutorizationHeader() }).pipe(
      catchError(e => {
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }

}
