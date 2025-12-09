import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/views/pages/auth/login/auth.service';
import { Egreso } from './egreso';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class EgresoService {

  //private urlEndpoint: string = 'http://localhost:8080/egreso';
  private urlEndpoint: string = `${environment.apiUrl}/egreso`;

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  private agregarAutorizationHeader(){
    let token = this.authService.token;
    if(token!=null){
      return this.httpHeaders.append('Authorization','Bearer ' + token);
    }
    return this.httpHeaders;
  }

  private isNoAutorizado(e): boolean{
      if(e.status==401){
        this.router.navigate(['/auth/login']);
        return true;
      }
      if(e.status==403){
        Swal.fire('Acceso Denegado',`Hola ${this.authService.usuario.username}, no tienes permiso para acceder a este recurso!`,'warning');
        this.router.navigate(['/']);
        return true;
      }
      return false;
  }


  obtenerEgresoFiltro(subalmacen, almacen, fecha1, fecha2): Observable<Egreso[]>{
    return this.http.get<Egreso[]>(`${this.urlEndpoint}/filtro?subalmacen=${subalmacen}&almacen=${almacen}&fecha1=${fecha1}&fecha2=${fecha2}`, {headers: this.agregarAutorizationHeader()}).pipe(
      catchError(e=>{
        console.error(e.error.mensaje);
        if(this.isNoAutorizado(e)){
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

  obtenerEgresos(): Observable<Egreso[]> {
    return this.http.get<Egreso[]>(`${this.urlEndpoint}/listartop`, {headers: this.agregarAutorizationHeader()}).pipe(
      catchError(e => {
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }

  crearEgreso(egreso: Egreso): Observable<any> {
    return this.http.post<any>(`${this.urlEndpoint}/egreso`, egreso, {headers: this.agregarAutorizationHeader()}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        if(this.isNoAutorizado(e)){
          return throwError(e);
        }
        Swal.fire('Error al crear la Salida de Producto', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  obtenerEgreso(id): Observable<Egreso> {
    return this.http.get<Egreso>(`${this.urlEndpoint}/buscar/${id}`, {headers: this.agregarAutorizationHeader()}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        if(this.isNoAutorizado(e)){
          return throwError(e);
        }
        Swal.fire('Error al obtener la Salida de Producto', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  anularEgreso(egreso: Egreso): Observable<any> {
    return this.http.put<any>(`${this.urlEndpoint}/estado/${egreso.id_TRAN}`, egreso, {headers: this.agregarAutorizationHeader()}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        if(this.isNoAutorizado(e)){
          return throwError(e);
        }
        Swal.fire('Error al anular la Salida de Producto', e.error.mensaje, 'error');
        return throwError(e);
      })
    )
  }

  obtenerSalidasDelMes(): Observable<Egreso[]> {
    return this.http.get<Egreso[]>(`${this.urlEndpoint}/salidasmesactual`, { headers: this.agregarAutorizationHeader() }).pipe(
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
