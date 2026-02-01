import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ModalService } from '../modal.service';
import { Natural } from './natural';
import { NaturalService } from './natural.service';
declare var $: any;

@Component({
  selector: 'app-natural',
  templateUrl: './natural.component.html',
  styleUrls: []
})
export class NaturalComponent implements OnInit {

  naturales: Natural[];
  
  rootNode: any;

  //NUEVA VARIABLE CREADA DEL TIPO PERSONA DONDE SE VA A ALOJAR LA PERSONA SELECCIONADA PARA MOSTRAR LA INOFMRACIÓN DE LA PERSONA
  naturalSeleccionada: Natural;

  constructor(private naturalService: NaturalService, public modalService: ModalService) { }

  ngOnInit(): void {
    
    this.cargarPersonasNaturales();
  }

  cargarPersonasNaturales(){
    this.naturalService.obtenerPersonasNaturales().subscribe((mydata) => {
    this.naturales = mydata;
    this.createDataTable();
    })          
  }

  delete(natural: Natural): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    
    swalWithBootstrapButtons.fire({
      title: 'Estás Seguro?',
      text: `Está seguro que desea eliminar a la persona natural ${natural.nombres}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, Eliminar!',
      cancelButtonText: 'No, Cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.naturalService.eliminarPersonaNatural(natural.id_PERSONA).subscribe(
          
          response => {
            this.naturales = this.naturales.filter(nat => nat!== natural)
            swalWithBootstrapButtons.fire(
              'Eliminado!',
              'La persona natural ha sido eliminada',
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

  activarPersonaNatural(natural: Natural): void {
    Swal.fire({
      title: 'Advertencia!',
      text: "Está seguro que desea activar la persona natural?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, activar!'
    }).then((result) => {
      if (result.isConfirmed) {
          natural.estado = "A"
          this.naturalService.actualizarPersonaNatural(natural).subscribe(
            response => {
              this.naturales = this.naturales.filter(nat => nat!== natural)
              this.deleteTable();
              this.cargarPersonasNaturales();
              Swal.fire(
                'Actualizado!',
                'Se ha activado la persona Natural',
                'success'
              )
            }
          )
      }
    })
  }

  inactivarPersonaNatural(natural: Natural): void {
    Swal.fire({
      title: 'Advertencia!',
      text: "Está seguro que desea inactivar la persona natural?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, inactivar!'
    }).then((result) => {
      if (result.isConfirmed) {
        natural.estado = "I"
          this.naturalService.actualizarPersonaNatural(natural).subscribe(
            response => {
              this.naturales = this.naturales.filter(jur => jur!== natural)
              this.deleteTable();
              this.cargarPersonasNaturales();
              Swal.fire(
                'Actualizado!',
                'Se ha inactivado a la persona natural',
                'success'
              )
            }
          )

        
      }
    })
  }

  
  createDataTable() {

    $(function () {
      $("#naturales").DataTable({
        "responsive": false, "lengthChange": false, "autoWidth": false,
        "buttons": ["copy", "csv", "excel", "pdf", "print", "colvis"]
      }).buttons().container().appendTo('#naturales_wrapper .col-md-6:eq(0)');
      /*    
         $('#example1').dataTable().fnClearTable();
         $('#example1').dataTable().fnDestroy(); */

    });

  }

    //METODO PARA ASIGNAR LOS DATOS DE LA PERSONA SELECCIONADA Y CAMBIA EL ESTADO DEL MODAL
    abrirModal(natural: Natural){
      this.naturalSeleccionada = natural;
      this.modalService.abrirModal();
    }
  
    //METODO PARA ASIGNAR LOS DATOS DE LA PERSONA COMO NUEVO PARA LA CREACION DE PERSONA Y CAMBIA EL ESTADO DEL MODAL
    abrirModalNuevo(){
      this.naturalSeleccionada = new Natural();
      this.modalService.abrirModal();
    }

  deleteTable() {
    $('#naturales').dataTable().fnDestroy();
  }


}
