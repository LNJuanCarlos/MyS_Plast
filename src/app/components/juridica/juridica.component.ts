import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ModalService } from '../modal.service';
import { Juridica } from './juridica';
import { JuridicaService } from './juridica.service';
declare var $: any;

@Component({
  selector: 'app-juridica',
  templateUrl: './juridica.component.html',
  styleUrls: []
})
export class JuridicaComponent implements OnInit {

  juridicas: Juridica[];
  rootNode: any;

  //NUEVA VARIABLE CREADA DEL TIPO PERSONA DONDE SE VA A ALOJAR LA PERSONA SELECCIONADA PARA MOSTRAR LA INOFMRACIÓN DE LA PERSONA
  juridicaSeleccionada: Juridica;

  constructor(private juridicaService: JuridicaService, public modalService: ModalService) { }

  ngOnInit(): void {
    
    this.cargarPersonasJurídicas();
  }

  cargarPersonasJurídicas(){
    this.juridicaService.obtenerPersonasJuridicas().subscribe((mydata) => {
    this.juridicas = mydata;
    this.createDataTable();
    })          
  }

  delete(juridica: Juridica): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    
    swalWithBootstrapButtons.fire({
      title: 'Estás Seguro?',
      text: `Está seguro que desea eliminar a la persona jurídica ${juridica.razonsocial}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, Eliminar!',
      cancelButtonText: 'No, Cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.juridicaService.eliminarPersonaJuridica(juridica.id_PERSONA).subscribe(
          
          response => {
            this.juridicas = this.juridicas.filter(jur => jur!== juridica)
            swalWithBootstrapButtons.fire(
              'Eliminado!',
              'La persona jurídica ha sido eliminada',
              'success'
            )
          }
        )
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelado',
          'Se ha cancelado la operación',
          'error'
        )
      }
    })
  }

  activarPersonaJuridica(juridica: Juridica): void {
    Swal.fire({
      title: 'Advertencia!',
      text: "Está seguro que desea activar la persona jurídica?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, activar!'
    }).then((result) => {
      if (result.isConfirmed) {
          juridica.estado = "A"
          this.juridicaService.actualizarPersonaJuridica(juridica).subscribe(
            response => {
              this.juridicas = this.juridicas.filter(jur => jur!== juridica)
              this.deleteTable();
              this.cargarPersonasJurídicas();
              Swal.fire(
                'Actualizado!',
                'Se ha activado la persona jurídica',
                'success'
              )
            }
          )
      }
    })
  }

  inactivarPersonaJuridica(juridica: Juridica): void {
    Swal.fire({
      title: 'Advertencia!',
      text: "Está seguro que desea inactivar la persona jurídica?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, inactivar!'
    }).then((result) => {
      if (result.isConfirmed) {
          juridica.estado = "I"
          this.juridicaService.actualizarPersonaJuridica(juridica).subscribe(
            response => {
              this.juridicas = this.juridicas.filter(jur => jur!== juridica)
              this.deleteTable();
              this.cargarPersonasJurídicas();
              Swal.fire(
                'Actualizado!',
                'Se ha inactivado a la persona jurídica',
                'success'
              )
            }
          )
      }
    })
  }

  
  createDataTable() {

    $(function () {
      $("#juridicas").DataTable({
        "responsive": false, "lengthChange": false, "autoWidth": false,
        "buttons": ["copy", "csv", "excel", "pdf", "print", "colvis"]
      }).buttons().container().appendTo('#juridicas_wrapper .col-md-6:eq(0)');
      /*    
         $('#example1').dataTable().fnClearTable();
         $('#example1').dataTable().fnDestroy(); */

    });

  }

    //METODO PARA ASIGNAR LOS DATOS DE LA PERSONA SELECCIONADA Y CAMBIA EL ESTADO DEL MODAL
    abrirModal(juridica: Juridica){
      this.juridicaSeleccionada = juridica;
      this.modalService.abrirModal();
    }
  
    //METODO PARA ASIGNAR LOS DATOS DE LA PERSONA COMO NUEVO PARA LA CREACION DE PERSONA Y CAMBIA EL ESTADO DEL MODAL
    abrirModalNuevo(){
      this.juridicaSeleccionada = new Juridica();
      this.modalService.abrirModal();
    }

  deleteTable() {
    $('#juridicas').dataTable().fnDestroy();
  }
}
