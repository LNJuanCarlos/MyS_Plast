import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { Usuario } from './usuario';
import { environment } from 'src/environments/environment';


@Injectable({
    providedIn: 'root'
})

export class AuthService{

    private _usuario: Usuario;
    private _token: string;

    constructor(private hhtp: HttpClient){}

    public get usuario():Usuario{
        if(this._usuario!=null){
            return this._usuario;
         }else if (this._usuario == null && sessionStorage.getItem('usuario')!=null){
            this._usuario = JSON.parse(sessionStorage.getItem('usuario')) as Usuario;
             return this._usuario;  
         }

         return new Usuario();

    }

    public get token():string{
        if(this._token!=null){
            return this._token;
         }else if (this._token == null && sessionStorage.getItem('token')!=null){
             this._token = sessionStorage.getItem('token');
             return this._token;
         }

         return null;
    }

    login(usuario: Usuario):Observable<any>{
        //const urlEndpint = 'http://localhost:8080/oauth/token';
        const urlEndpint = `${environment.apiUrl}/oauth/token`;
        
        const credenciales = btoa('angularapp' + ':' + '12345');
        const httpHeaders = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + credenciales});
        let params = new URLSearchParams();
        params.set('grant_type','password');
        params.set('username',usuario.username);
        params.set('password',usuario.password);    
        console.log(params.toString());
        return this.hhtp.post(urlEndpint, params.toString(), {headers: httpHeaders});
    }

    guardarUsuario(accessToken: string): void{
        let payload = this.obtenerDatosToken(accessToken);
        this._usuario = new Usuario();
        this._usuario.username = payload.user_name;
        this._usuario.rol = payload.authorities;
        this._usuario.nombre = payload.nombre;
        this._usuario.correo = payload.correo;
        sessionStorage.setItem('usuario', JSON.stringify(this._usuario));
    }

    guardarToken(accessToken: string): void{
        this._token = accessToken;
        sessionStorage.setItem('token',accessToken);
    }

    obtenerDatosToken(accessToken: string): any{
        if(accessToken !=null){
            return JSON.parse(atob(accessToken.split(".")[1]));
        }
        return null;
    }

    isAuthenticated():boolean{
        let payload = this.obtenerDatosToken(this.token);
        if(payload != null && payload.user_name && payload.user_name.length>0){
            return true; 
        }
        return false;
    }


    hasRole(role: string): boolean{
        if(this.usuario.rol.includes(role)){
            return true;
        }
        return false;
    }

    nothasRole(role: string): boolean{
        if(this.usuario.rol.includes(role)){
            return false;
        }
        return true;
    }


    logout():void{
        this._token = null;
        this._usuario = null;
        sessionStorage.clear();
    }

}