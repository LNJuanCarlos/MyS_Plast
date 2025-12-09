import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from 'src/app/views/pages/auth/login/auth.service';
import Swal from 'sweetalert2';
import { Categoria } from './categoria';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  //private urlEndPoint: string = 'http://localhost:8080/categoria';
  private urlEndPoint: string = `${environment.apiUrl}/categoria`;

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

  obtenerCategorias():Observable<Categoria[]>{
    return this.http.get<Categoria[]>(`${this.urlEndPoint}/listar`, {headers: this.agregarAutorizationHeader()}).pipe(
      catchError(e=>{
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }

  crearCategoria(categoria: Categoria) : Observable<any>{
    return this.http.post<any>(`${this.urlEndPoint}/crear`, categoria,  {headers: this.agregarAutorizationHeader()}).pipe(
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

  obtenerCategoria(id:number): Observable<Categoria>{
    return this.http.get<Categoria>(`${this.urlEndPoint}/buscar/${id}`, {headers: this.agregarAutorizationHeader()}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        if(this.isNoAutorizado(e)){
          return throwError(e);
        }
        Swal.fire('Error al obtener la Categoria',e.error.mensaje,'error');
        return throwError(e);
      })
    );
  }

  actualizarCategoria(categoria: Categoria): Observable<any>{
    return this.http.put<any>(`${this.urlEndPoint}/actualizar`,categoria, {headers: this.agregarAutorizationHeader()}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        if(this.isNoAutorizado(e)){
          return throwError(e);
        }
        Swal.fire('Error al editar la Categoria',e.error.mensaje,'error');
        return throwError(e);
      })
    );
  }

  eliminarCategoria(id : string): Observable<Categoria>{
    return this.http.delete<Categoria>(`${this.urlEndPoint}/eliminar/${id}`, {headers: this.agregarAutorizationHeader()}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        if(this.isNoAutorizado(e)){
          return throwError(e);
        }
        Swal.fire('Error al eliminar la Categoria',e.error.mensaje,'error');
        return throwError(e);
      })
    );
  }

}
