import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from 'src/app/views/pages/auth/login/auth.service';
import Swal from 'sweetalert2';
import { Marca } from './marca';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MarcaService {
  //private urlEndPoint: string = 'http://localhost:8080/marca';
  private urlEndPoint: string = `${environment.apiUrl}/marca`;

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

  obtenerMarcas():Observable<Marca[]>{
    return this.http.get<Marca[]>(`${this.urlEndPoint}/listar`, {headers: this.agregarAutorizationHeader()}).pipe(
      catchError(e=>{
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }

  crearMarca(marca: Marca) : Observable<any>{
    return this.http.post<any>(`${this.urlEndPoint}/crear`, marca,  {headers: this.agregarAutorizationHeader()}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        if(this.isNoAutorizado(e)){
          return throwError(e);
        }
        Swal.fire('Error al crear la Marca',e.error.mensaje,'error');
        return throwError(e);
      })
    );
  }

  obtenerMarca(id:number): Observable<Marca>{
    return this.http.get<Marca>(`${this.urlEndPoint}/buscar/${id}`, {headers: this.agregarAutorizationHeader()}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        if(this.isNoAutorizado(e)){
          return throwError(e);
        }
        Swal.fire('Error al obtener la Marca',e.error.mensaje,'error');
        return throwError(e);
      })
    );
  }

  obtenerMarcasxTermino(term:string): Observable<Marca[]>{
    return this.http.get<Marca[]>(`${this.urlEndPoint}/filtrar-marca/${term}`, {headers: this.agregarAutorizationHeader()}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        if(this.isNoAutorizado(e)){
          return throwError(e);
        }
        Swal.fire('Error al obtener las Marcas',e.error.mensaje,'error');
        return throwError(e);
      })
    );
  }

  actualizarMarca(categoria: Marca): Observable<any>{
    return this.http.put<any>(`${this.urlEndPoint}/actualizar`,categoria, {headers: this.agregarAutorizationHeader()}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        if(this.isNoAutorizado(e)){
          return throwError(e);
        }
        Swal.fire('Error al editar la Marca',e.error.mensaje,'error');
        return throwError(e);
      })
    );
  }

  eliminarMarca(id : string): Observable<Marca>{
    return this.http.delete<Marca>(`${this.urlEndPoint}/eliminar/${id}`, {headers: this.agregarAutorizationHeader()}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        if(this.isNoAutorizado(e)){
          return throwError(e);
        }
        Swal.fire('Error al eliminar la Marca',e.error.mensaje,'error');
        return throwError(e);
      })
    );
  }
}
