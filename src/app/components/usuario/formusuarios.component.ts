import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { Rol } from '../rol/rol';
import { Usuario } from './usuario';
import { UsuarioService } from './usuario.service';
declare var $: any;

@Component({
    selector: 'app-formusuarios',
    templateUrl: './formusuarios.component.html'
  })

  export class FormUsuariosComponent implements OnInit {

    usuario: Usuario = new Usuario();
    rol: Rol[];
    seleccionado: Rol;
    roles: Array<String> = new Array<String>();
    rolesSeleccionados: Array<Rol> = new Array<Rol>();
    rolesmodelSeleccionado: Rol = {id:null,nombre:''};

    constructor(private usuarioService: UsuarioService,
        private router: Router, private activatedRoute: ActivatedRoute) { }

        ngOnInit(): void {
            this.usuarioService.getRoles().subscribe(rol => this.rol = rol);
          }

          create(id: string): void {
            this.usuarioService.create(this.usuario, this.roles)
              .subscribe(() => {
                this.router.navigate(['/generalus/usuario']);
                swal.fire(
                  'Nuevo Usuario',
                  `Usuario ${this.usuario.username} creado con éxito`,
                  'success'
                );
              });
          }

          asignarValorRoles(rol: Rol){
                let existe = "";
                for(let numero of this.roles){
                  if(numero.includes(rol.id.toString())==true){
                    existe = "Y"
                  } 
                }
                if(existe == "Y"){
                  swal.fire('Roles', `El Rol ya se encuentra agregado`, 'warning')
                } else {
                  this.rolesSeleccionados.push(rol);
                  this.roles.push(rol.id.toString());
                  this.deleteTable();
                  this.createDataTable();
                }
          }

          eliminarRol(rol: Rol){
            var pos = this.rolesSeleccionados.findIndex(i => i.id === rol.id);
            this.rolesSeleccionados.splice(pos, 1);
            var indice = this.roles.indexOf(rol.id.toString());
            this.roles.splice(indice, 1);
            this.deleteTable();
            this.createDataTable();
          }

              
  createDataTable() {

    $(function () {
      $("#roles").DataTable({
        "responsive": false, "lengthChange": false, "autoWidth": false, "bFilter": false,
      }).buttons().container().appendTo('#roles_wrapper .col-md-6:eq(0)');
      /*    
         $('#example1').dataTable().fnClearTable();
         $('#example1').dataTable().fnDestroy(); */

    });

  }

  deleteTable() {
    $('#roles').dataTable().fnDestroy();
  }

  createDataTableAlmacen() {

    $(function () {
      $("#almacenes").DataTable({
        "responsive": false, "lengthChange": false, "autoWidth": false
      }).buttons().container().appendTo('#almacenes_wrapper .col-md-6:eq(0)');
      /*    
         $('#example1').dataTable().fnClearTable();
         $('#example1').dataTable().fnDestroy(); */

    });

  }

  deleteTableAlmacen() {
    $('#almacenes').dataTable().fnDestroy();
  }





  }