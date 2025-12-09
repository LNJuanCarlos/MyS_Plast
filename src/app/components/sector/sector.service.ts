import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from 'src/app/views/pages/auth/login/auth.service';
import Swal from 'sweetalert2';
import { Sector } from './sector';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SectorService {

  //private urlEndpoint: string = 'http://localhost:8080/sector';
  private urlEndpoint: string = `${environment.apiUrl}/sector`;

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


  obtenerSectores():Observable<Sector[]>{
    return this.http.get<Sector[]>(`${this.urlEndpoint}/listar`, {headers: this.agregarAutorizationHeader()}).pipe(
      catchError(e=>{
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }

  crearSector(sector: Sector) : Observable<any>{
    return this.http.post<any>(`${this.urlEndpoint}/crear`, sector,  {headers: this.agregarAutorizationHeader()}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        if(this.isNoAutorizado(e)){
          return throwError(e);
        }
        Swal.fire('Error al crear el Sector',e.error.mensaje,'error');
        return throwError(e);
      })
    );
  }

  obtenerSector(id:number): Observable<Sector>{
    return this.http.get<Sector>(`${this.urlEndpoint}/buscar/${id}`, {headers: this.agregarAutorizationHeader()}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        if(this.isNoAutorizado(e)){
          return throwError(e);
        }
        Swal.fire('Error al obtener el Sector',e.error.mensaje,'error');
        return throwError(e);
      })
    );
  }

  actualizarSector(centrocosto: Sector): Observable<any>{
    return this.http.put<any>(`${this.urlEndpoint}/actualizar`,centrocosto, {headers: this.agregarAutorizationHeader()}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        if(this.isNoAutorizado(e)){
          return throwError(e);
        }
        Swal.fire('Error al editar el Sector',e.error.mensaje,'error');
        return throwError(e);
      })
    );
  }

  eliminarSector(id : string): Observable<Sector>{
    return this.http.delete<Sector>(`${this.urlEndpoint}/eliminar/${id}`, {headers: this.agregarAutorizationHeader()}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        if(this.isNoAutorizado(e)){
          return throwError(e);
        }
        Swal.fire('Error al eliminar el Sector',e.error.mensaje,'error');
        return throwError(e);
      })
    );
  }

  obtenerSectoresxAlmacen(alm): Observable<Sector[]> {
    return this.http.get<Sector[]>(`${this.urlEndpoint}/buscar/almacen/${alm}`, { headers: this.agregarAutorizationHeader() }).pipe(
      catchError(e => {
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }

}
