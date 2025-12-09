import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from 'src/app/views/pages/auth/login/auth.service';
import Swal from 'sweetalert2';
import { Producto } from './producto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  //private urlEndpoint: string = 'http://localhost:8080/producto';
  private urlEndpoint: string = `${environment.apiUrl}/producto`;

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


  obtenerProductos():Observable<Producto[]>{
    return this.http.get<Producto[]>(`${this.urlEndpoint}/listar`, {headers: this.agregarAutorizationHeader()}).pipe(
      catchError(e=>{
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }

  crearProducto(producto: Producto) : Observable<any>{
    return this.http.post<any>(`${this.urlEndpoint}/crear`, producto,  {headers: this.agregarAutorizationHeader()}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        if(this.isNoAutorizado(e)){
          return throwError(e);
        }
        Swal.fire('Error al crear el Producto',e.error.mensaje,'error');
        return throwError(e);
      })
    );
  }

  obtenerProducto(id:number): Observable<Producto>{
    return this.http.get<Producto>(`${this.urlEndpoint}/buscar/${id}`, {headers: this.agregarAutorizationHeader()}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        if(this.isNoAutorizado(e)){
          return throwError(e);
        }
        Swal.fire('Error al obtener el Producto',e.error.mensaje,'error');
        return throwError(e);
      })
    );
  }

  actualizarProducto(centrocosto: Producto): Observable<any>{
    return this.http.put<any>(`${this.urlEndpoint}/actualizar`,centrocosto, {headers: this.agregarAutorizationHeader()}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        if(this.isNoAutorizado(e)){
          return throwError(e);
        }
        Swal.fire('Error al editar el Producto',e.error.mensaje,'error');
        return throwError(e);
      })
    );
  }

  eliminarProducto(id : string): Observable<Producto>{
    return this.http.delete<Producto>(`${this.urlEndpoint}/eliminar/${id}`, {headers: this.agregarAutorizationHeader()}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        if(this.isNoAutorizado(e)){
          return throwError(e);
        }
        Swal.fire('Error al eliminar el Producto',e.error.mensaje,'error');
        return throwError(e);
      })
    );
  }

  obtenerProductosFiltro( categoria, nombre, marca): Observable<Producto[]>{
    return this.http.get<Producto[]>(`${this.urlEndpoint}/filtro?categoria=${categoria}&nombre=${nombre}&marca=${marca}`, {headers: this.agregarAutorizationHeader()}).pipe(
      catchError(e=>{
        console.error(e.error.mensaje);
        if(this.isNoAutorizado(e)){
          return throwError(e);
        }
        Swal.fire({
          icon: 'error',
          title: "<b><h1 style='color:red'>" + 'Error!' + "</h1></b>",
          text: e.error.mensaje,
          
        })
        return throwError(e); 
      })
    );
  }

  obtenerProductosFiltrados(term: String): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.urlEndpoint}/filtrar-producto/${term}`, { headers: this.agregarAutorizationHeader() }).pipe(
      catchError(e => {
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }

  obtenerProductosProducciónFiltrados(term: String): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.urlEndpoint}/filtrar-productoprod/${term}`, { headers: this.agregarAutorizationHeader() }).pipe(
      catchError(e => {
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }

  obtenerProductosInventarioFisico(sector: String): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.urlEndpoint}/buscar/sector/${sector}`, { headers: this.agregarAutorizationHeader() }).pipe(
      catchError(e => {
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }

  obtenerProductosInsumosFiltrados(term: String): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.urlEndpoint}/filtrar-productoinsm/${term}`, { headers: this.agregarAutorizationHeader() }).pipe(
      catchError(e => {
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }
}