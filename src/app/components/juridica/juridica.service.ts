import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from 'src/app/views/pages/auth/login/auth.service';
import Swal from 'sweetalert2';
import { Juridica } from './juridica';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JuridicaService {

  //private urlEndpoint: string = 'http://localhost:8080/juridica';
  private urlEndpoint: string = `${environment.apiUrl}/juridica`;

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

  obtenerPersonasJuridicas(): Observable<Juridica[]> {
    return this.http.get<Juridica[]>(`${this.urlEndpoint}/listar`, {headers: this.agregarAutorizationHeader()}).pipe(
      catchError(e => {
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }

  crearPersonaJurídica(juridica: Juridica): Observable<any> {
    return this.http.post<any>(`${this.urlEndpoint}/crear`, juridica, {headers: this.agregarAutorizationHeader()}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        if(this.isNoAutorizado(e)){
          return throwError(e);
        }
        Swal.fire('Error al crear a la persona jurídica', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  obtenerPersonaJurídica(id): Observable<Juridica> {
    return this.http.get<Juridica>(`${this.urlEndpoint}/buscar/${id}`, {headers: this.agregarAutorizationHeader()}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        if(this.isNoAutorizado(e)){
          return throwError(e);
        }
        Swal.fire('Error al editar', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  actualizarPersonaJuridica(juridica: Juridica): Observable<any> {
    return this.http.put<any>(`${this.urlEndpoint}/actualizar`, juridica, {headers: this.agregarAutorizationHeader()}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        if(this.isNoAutorizado(e)){
          return throwError(e);
        }
        Swal.fire('Error al editar a la persona jurídica', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  eliminarPersonaJuridica(id: string): Observable<Juridica> {
    return this.http.delete<Juridica>(`${this.urlEndpoint}/eliminar/${id}`, {headers: this.agregarAutorizationHeader()}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        if(this.isNoAutorizado(e)){
          return throwError(e);
        }
        Swal.fire('Error al eliminar a la persona jurídica', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  obtenerJuridicaFiltro(nrodoc, razsoc): Observable<Juridica[]>{
    return this.http.get<Juridica[]>(`${this.urlEndpoint}/filtro?nrodoc=${nrodoc}&razsoc=${razsoc}`, {headers: this.agregarAutorizationHeader()}).pipe(
      catchError(e=>{
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }

}
