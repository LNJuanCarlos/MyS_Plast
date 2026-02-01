import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from 'src/app/views/pages/auth/login/auth.service';
import Swal from 'sweetalert2';
import { Natural } from './natural';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NaturalService {

  //private urlEndpoint: string = 'http://localhost:8080/natural';
  private urlEndpoint: string = `${environment.apiUrl}/natural`;

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

  obtenerPersonasNaturales(): Observable<Natural[]> {
    return this.http.get<Natural[]>(`${this.urlEndpoint}/listar`, {headers: this.agregarAutorizationHeader()}).pipe(
      catchError(e => {
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }

  crearPersonaNatural(natural: Natural): Observable<any> {
    return this.http.post<any>(`${this.urlEndpoint}/crear`, natural, {headers: this.agregarAutorizationHeader()}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        if(this.isNoAutorizado(e)){
          return throwError(e);
        }
        Swal.fire('Error al crear a la persona Natural', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  obtenerPersonaNatural(id): Observable<Natural> {
    return this.http.get<Natural>(`${this.urlEndpoint}/buscar/${id}`, {headers: this.agregarAutorizationHeader()}).pipe(
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

  actualizarPersonaNatural(natural: Natural): Observable<any> {
    return this.http.put<any>(`${this.urlEndpoint}/actualizar`, natural, {headers: this.agregarAutorizationHeader()}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        if(this.isNoAutorizado(e)){
          return throwError(e);
        }
        Swal.fire('Error al editar a la persona natural', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  eliminarPersonaNatural(id: string): Observable<Natural> {
    return this.http.delete<Natural>(`${this.urlEndpoint}/eliminar/${id}`, {headers: this.agregarAutorizationHeader()}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        if(this.isNoAutorizado(e)){
          return throwError(e);
        }
        Swal.fire('Error al eliminar a la persona natural', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  obtenerNaturalFiltro(nombre, nrodoc): Observable<Natural[]>{
    return this.http.get<Natural[]>(`${this.urlEndpoint}/filtroC?nombre=${nombre}&nrodoc=${nrodoc}`, {headers: this.agregarAutorizationHeader()}).pipe(
      catchError(e=>{
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }
}
