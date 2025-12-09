import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Almacen } from '../almacen/almacen';
import { Producto } from '../producto/producto';
import { Natural } from '../natural/natural';
import { AuthService } from 'src/app/views/pages/auth/login/auth.service';
import { Router } from '@angular/router';
import { Categoriatransaccion } from '../categoriatransaccion/categoriatransaccion';
import { Transferencia } from './transferencia';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransferenciaService {

  //private urlEndpoint: string = 'http://localhost:8080/transferencia';
  private urlEndpoint: string = `${environment.apiUrl}/transferencia`;

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


  obtenerTransferenciaFiltro(subalmacen, almacen, fecha1, fecha2): Observable<Transferencia[]>{
    return this.http.get<Transferencia[]>(`${this.urlEndpoint}/filtro?subalmacen=${subalmacen}&almacen=${almacen}&fecha1=${fecha1}&fecha2=${fecha2}`, {headers: this.agregarAutorizationHeader()}).pipe(
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

  obtenerTransferencias(): Observable<Transferencia[]> {
    return this.http.get<Transferencia[]>(`${this.urlEndpoint}/listartop`, {headers: this.agregarAutorizationHeader()}).pipe(
      catchError(e => {
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }

  crearTransferencia(transferencia: Transferencia): Observable<any> {
    return this.http.post<any>(`${this.urlEndpoint}/transferencia`, transferencia, {headers: this.agregarAutorizationHeader()}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        if(this.isNoAutorizado(e)){
          return throwError(e);
        }
        Swal.fire('Error al crear la Transferencia de Producto', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  obtenerTransferencia(id): Observable<Transferencia> {
    return this.http.get<Transferencia>(`${this.urlEndpoint}/buscar/${id}`, {headers: this.agregarAutorizationHeader()}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        if(this.isNoAutorizado(e)){
          return throwError(e);
        }
        Swal.fire('Error al obtener la Transferencia de Producto', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  anularTransferencia(transferencia: Transferencia): Observable<any> {
    return this.http.put<any>(`${this.urlEndpoint}/estado/${transferencia.id_TRAN}`, transferencia, {headers: this.agregarAutorizationHeader()}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        if(this.isNoAutorizado(e)){
          return throwError(e);
        }
        Swal.fire('Error al anular la Transferencia de Producto', e.error.mensaje, 'error');
        return throwError(e);
      })
    )
  }
}
