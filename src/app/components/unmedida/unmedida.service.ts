import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from 'src/app/views/pages/auth/login/auth.service';
import Swal from 'sweetalert2';
import { Unmedida } from './unmedida';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UnmedidaService {

  //private urlEndPoint: string = 'http://localhost:8080/unmedida';
  private urlEndPoint: string = `${environment.apiUrl}/unmedida`;

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

  obtenerUnmedidas():Observable<Unmedida[]>{
    return this.http.get<Unmedida[]>(`${this.urlEndPoint}/listar`, {headers: this.agregarAutorizationHeader()}).pipe(
      catchError(e=>{
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }

  crearUnmedida(unmedida: Unmedida) : Observable<any>{
    return this.http.post<any>(`${this.urlEndPoint}/crear`, unmedida,  {headers: this.agregarAutorizationHeader()}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        if(this.isNoAutorizado(e)){
          return throwError(e);
        }
        Swal.fire('Error al crear la Unidad de Medida',e.error.mensaje,'error');
        return throwError(e);
      })
    );
  }

  obtenerUnmedida(id:number): Observable<Unmedida>{
    return this.http.get<Unmedida>(`${this.urlEndPoint}/buscar/${id}`, {headers: this.agregarAutorizationHeader()}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        if(this.isNoAutorizado(e)){
          return throwError(e);
        }
        Swal.fire('Error al obtener la Unidad de Medida',e.error.mensaje,'error');
        return throwError(e);
      })
    );
  }

  actualizarUnmedida(categoria: Unmedida): Observable<any>{
    return this.http.put<any>(`${this.urlEndPoint}/actualizar`,categoria, {headers: this.agregarAutorizationHeader()}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        if(this.isNoAutorizado(e)){
          return throwError(e);
        }
        Swal.fire('Error al editar la Unidad de Medida',e.error.mensaje,'error');
        return throwError(e);
      })
    );
  }

  eliminarUnmedida(id : string): Observable<Unmedida>{
    return this.http.delete<Unmedida>(`${this.urlEndPoint}/eliminar/${id}`, {headers: this.agregarAutorizationHeader()}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        if(this.isNoAutorizado(e)){
          return throwError(e);
        }
        Swal.fire('Error al eliminar la Unidad de Medida',e.error.mensaje,'error');
        return throwError(e);
      })
    );
  }
}
