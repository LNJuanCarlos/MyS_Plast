import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from 'src/app/views/pages/auth/login/auth.service';
import Swal from 'sweetalert2';
import { Centrocosto } from './centrocosto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CentrocostoService {

  //private urlEndpoint: string = 'http://localhost:8080/centrocosto';
  private urlEndpoint: string = `${environment.apiUrl}/centrocosto`;

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


  obtenerCentrocostos():Observable<Centrocosto[]>{
    return this.http.get<Centrocosto[]>(`${this.urlEndpoint}/listar`, {headers: this.agregarAutorizationHeader()}).pipe(
      catchError(e=>{
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }

  crearCentrocosto(centrocosto: Centrocosto) : Observable<any>{
    return this.http.post<any>(`${this.urlEndpoint}/crear`, centrocosto,  {headers: this.agregarAutorizationHeader()}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        if(this.isNoAutorizado(e)){
          return throwError(e);
        }
        Swal.fire('Error al crear el Centro de costo',e.error.mensaje,'error');
        return throwError(e);
      })
    );
  }

  obtenerCentrocosto(id:number): Observable<Centrocosto>{
    return this.http.get<Centrocosto>(`${this.urlEndpoint}/buscar/${id}`, {headers: this.agregarAutorizationHeader()}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        if(this.isNoAutorizado(e)){
          return throwError(e);
        }
        Swal.fire('Error al obtener el Centro de costo',e.error.mensaje,'error');
        return throwError(e);
      })
    );
  }

  actualizarCentrocosto(centrocosto: Centrocosto): Observable<any>{
    return this.http.put<any>(`${this.urlEndpoint}/actualizar`,centrocosto, {headers: this.agregarAutorizationHeader()}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        if(this.isNoAutorizado(e)){
          return throwError(e);
        }
        Swal.fire('Error al editar el Centrocosto',e.error.mensaje,'error');
        return throwError(e);
      })
    );
  }

  eliminarCentrocosto(id : number): Observable<Centrocosto>{
    return this.http.delete<Centrocosto>(`${this.urlEndpoint}/eliminar/${id}`, {headers: this.agregarAutorizationHeader()}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        if(this.isNoAutorizado(e)){
          return throwError(e);
        }
        Swal.fire('Error al eliminar el Centrocosto',e.error.mensaje,'error');
        return throwError(e);
      })
    );
  }

}
