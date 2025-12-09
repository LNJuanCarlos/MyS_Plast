import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from 'src/app/views/pages/auth/login/auth.service';
import Swal from 'sweetalert2';
import { Actividad } from './actividad';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ActividadService {

  //private urlEndpoint: string = 'http://localhost:8080/actividad';
  private urlEndpoint: string = `${environment.apiUrl}/actividad`;


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


  obtenerActividades():Observable<Actividad[]>{
    return this.http.get<Actividad[]>(`${this.urlEndpoint}/listar`, {headers: this.agregarAutorizationHeader()}).pipe(
      catchError(e=>{
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }

  crearActividad(actividad: Actividad) : Observable<any>{
    return this.http.post<any>(`${this.urlEndpoint}/crear`, actividad,  {headers: this.agregarAutorizationHeader()}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        if(this.isNoAutorizado(e)){
          return throwError(e);
        }
        Swal.fire('Error al crear la Actvididad',e.error.mensaje,'error');
        return throwError(e);
      })
    );
  }

  obtenerActividad(id:number): Observable<Actividad>{
    return this.http.get<Actividad>(`${this.urlEndpoint}/buscar/${id}`, {headers: this.agregarAutorizationHeader()}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        if(this.isNoAutorizado(e)){
          return throwError(e);
        }
        Swal.fire('Error al obtener la Actividad',e.error.mensaje,'error');
        return throwError(e);
      })
    );
  }

  actualizarActividad(actividad: Actividad): Observable<any>{
    return this.http.put<any>(`${this.urlEndpoint}/actualizar`,actividad, {headers: this.agregarAutorizationHeader()}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        if(this.isNoAutorizado(e)){
          return throwError(e);
        }
        Swal.fire('Error al editar la Actividad',e.error.mensaje,'error');
        return throwError(e);
      })
    );
  }

  eliminarActividad(id : number): Observable<Actividad>{
    return this.http.delete<Actividad>(`${this.urlEndpoint}/eliminar/${id}`, {headers: this.agregarAutorizationHeader()}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        if(this.isNoAutorizado(e)){
          return throwError(e);
        }
        Swal.fire('Error al eliminar la Actividad',e.error.mensaje,'error');
        return throwError(e);
      })
    );
  }

}
