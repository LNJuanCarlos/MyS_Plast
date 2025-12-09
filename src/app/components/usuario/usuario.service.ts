import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/views/pages/auth/login/auth.service';
import { Usuario } from './usuario';
import { Rol } from '../rol/rol';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
  })

  @Injectable()
  export class UsuarioService {

    //private urlEndpoint: string = 'http://localhost:8080/usuarios';
    private urlEndpoint: string = `${environment.apiUrl}/usuarios`;

    constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }

    private agregarAutorizationHeader(){
      let token = this.authService.token;
      if(token!=null){
        return this.httpHeaders.append('Authorization','Bearer ' + token);
      }
      return this.httpHeaders;
    }

    private isNoAutorizado(e): boolean{
        if(e.status==401){
          this.router.navigate(['/login'])
          return true;
        }
        if(e.status==403){
          Swal.fire('Acceso Denegado',`Hola ${this.authService.usuario.username}, no tienes permiso para acceder a este recurso!`,'warning');
          this.router.navigate(['/dashboard'])
          return true;
        }
        return false;
    }
    
    getRoles(): Observable<Rol[]>{
      return this.http.get<Rol[]>(`${this.urlEndpoint}/roles`, {headers: this.agregarAutorizationHeader()}).pipe(
        catchError(e=>{
          this.isNoAutorizado(e);
          return throwError(e);
        })
      );
    }
    
    private httpHeaders =  new HttpHeaders({'Content-Type':'application/json'})
  
    gerPersonas():Observable<Usuario[]>{  
      return this.http.get<Usuario[]>(`${this.urlEndpoint}/listar`, {headers: this.agregarAutorizationHeader()}).pipe(
        catchError(e => {
          console.error(e.error.mensaje);
          if(this.isNoAutorizado(e)){
            return throwError(e);
          }
          Swal.fire('Error al crear al usuario',e.error.mensaje,'error');
          return throwError(e);
        })
      );
    }

    create(usuario: Usuario, roles) : Observable<any>{
      return this.http.post<any>(`${this.urlEndpoint}/crear?roles=${roles}`, usuario,  {headers: this.agregarAutorizationHeader()}).pipe(
        catchError(e => {
          console.error(e.error.mensaje);
          if(this.isNoAutorizado(e)){
            return throwError(e);
          }
          Swal.fire('Error al crear al usuario',e.error.mensaje,'error');
          return throwError(e);
        })
      );
    }
  
    getPersona(id): Observable<Usuario>{
      return this.http.get<Usuario>(`${this.urlEndpoint}/buscar/${id}`, {headers: this.agregarAutorizationHeader()}).pipe(
        catchError(e => {
          if(this.isNoAutorizado(e)){
            return throwError(e);
          }
          this.router.navigate(['/usuarios']);
          console.error(e.error.mensaje);
          Swal.fire('Error al editar',e.error.mensaje,'error');
          return throwError(e);
        })
      );
    }
  
    update(usuario: Usuario, roles): Observable<any>{
      return this.http.put<any>(`${this.urlEndpoint}/actualizar/${usuario.id}?roles=${roles}`,usuario, {headers: this.agregarAutorizationHeader()}).pipe(
        catchError(e => {
          if(this.isNoAutorizado(e)){
            return throwError(e);
          }
          console.error(e.error.mensaje);
          Swal.fire('Error al editar al usuario',e.error.mensaje,'error');
          return throwError(e);
        })
      );
    }

    updateEstado(usuario: Usuario): Observable<any>{
      return this.http.put<any>(`${this.urlEndpoint}/estado/${usuario.id}`,usuario, {headers: this.agregarAutorizationHeader()}).pipe(
        catchError(e => {
          if(this.isNoAutorizado(e)){
            return throwError(e);
          }
          console.error(e.error.mensaje);
          Swal.fire('Error al editar al usuario',e.error.mensaje,'error');
          return throwError(e);
        })
      );
    }

    updatePassword(usuario: Usuario): Observable<any>{
        return this.http.put<any>(`${this.urlEndpoint}/actualizarpassword/${usuario.id}`,usuario, {headers: this.agregarAutorizationHeader()}).pipe(
          catchError(e => {
            if(this.isNoAutorizado(e)){
              return throwError(e);
            }
            console.error(e.error.mensaje);
            Swal.fire('Error al editar la contraseña del usuario',e.error.mensaje,'error');
            return throwError(e);
          })
        );
      }

    delete(id : number): Observable<Usuario>{
      return this.http.delete<Usuario>(`${this.urlEndpoint}/eliminar/${id}`, {headers: this.agregarAutorizationHeader()}).pipe(
        catchError(e => {
          if(this.isNoAutorizado(e)){
            return throwError(e);
          }
          console.error(e.error.mensaje);
          Swal.fire('Error al eliminar al usuario',e.error.mensaje,'error');
          return throwError(e);
        })
      );
    }
    
  }