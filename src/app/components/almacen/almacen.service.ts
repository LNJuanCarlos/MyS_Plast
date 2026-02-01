import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from 'src/app/views/pages/auth/login/auth.service';
import Swal from 'sweetalert2';
import { Almacen } from './almacen';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AlmacenService {
  //private urlEndpoint: string = 'http://localhost:8080/almacen';
  private urlEndpoint: string = `${environment.apiUrl}/almacen`;

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }

  private httpHeaders =  new HttpHeaders({'Content-Type':'application/json'})

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


  obtenerAlmacenes():Observable<Almacen[]>{
    return this.http.get<Almacen[]>(`${this.urlEndpoint}/listar`, {headers: this.agregarAutorizationHeader()}).pipe(
      catchError(e=>{
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }

  crearAlmacen(almacen: Almacen) : Observable<any>{
    return this.http.post<any>(`${this.urlEndpoint}/crear`, almacen,  {headers: this.agregarAutorizationHeader()}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        if(this.isNoAutorizado(e)){
          return throwError(e);
        }
        Swal.fire('Error al crear el Almacen',e.error.mensaje,'error');
        return throwError(e);
      })
    );
  }

  obtenerAlmacen(id:number): Observable<Almacen>{
    return this.http.get<Almacen>(`${this.urlEndpoint}/buscar/${id}`, {headers: this.agregarAutorizationHeader()}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        if(this.isNoAutorizado(e)){
          return throwError(e);
        }
        Swal.fire('Error al obtener el Almacen',e.error.mensaje,'error');
        return throwError(e);
      })
    );
  }

  actualizarAlmacen(almacen: Almacen): Observable<any>{
    return this.http.put<any>(`${this.urlEndpoint}/actualizar`,almacen, {headers: this.agregarAutorizationHeader()}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        if(this.isNoAutorizado(e)){
          return throwError(e);
        }
        Swal.fire('Error al editar el Almacen',e.error.mensaje,'error');
        return throwError(e);
      })
    );
  }

  eliminarAlmacen(id : string): Observable<Almacen>{
    return this.http.delete<Almacen>(`${this.urlEndpoint}/eliminar/${id}`, {headers: this.agregarAutorizationHeader()}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        if(this.isNoAutorizado(e)){
          return throwError(e);
        }
        Swal.fire('Error al eliminar el Almacen',e.error.mensaje,'error');
        return throwError(e);
      })
    );
  }
}
