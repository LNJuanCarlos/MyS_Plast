import { Component, OnInit } from '@angular/core';
declare var $: any;
import Swal from 'sweetalert2';
import { ModalService } from '../modal.service';
import { Almacen } from './almacen';
import { AlmacenService } from './almacen.service';

@Component({
  selector: 'app-almacen',
  templateUrl: './almacen.component.html',
  styleUrls: []
})
export class AlmacenComponent implements OnInit {

  almacenes: Almacen[];

  rootNode: any;

  almacenSeleccionada: Almacen;


  constructor(private almacenService: AlmacenService, public modalService: ModalService) { }

  ngOnInit(): void {
    this.cargarAlmacenes();
  }

  cargarAlmacenes() {
    this.almacenService.obtenerAlmacenes().subscribe((almacen) => {
      this.almacenes = almacen
      this.deleteTable();
      this.createDataTable();
    });
  }

  delete(almacen: Almacen): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: 'Estás Seguro?',
      text: `Está seguro que desea eliminar el Almacén ${almacen.nom_ALMACEN}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, Eliminar!',
      cancelButtonText: 'No, Cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.almacenService.eliminarAlmacen(almacen.id_ALMACEN).subscribe(
          response => {
            this.almacenes = this.almacenes.filter(act => act !== almacen)
            swalWithBootstrapButtons.fire(
              'Eliminado!',
              'La Almacen ha sido eliminada',
              'success'
            )
          }
        )
        this.cargarAlmacenes();
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

  createDataTable() {

    $(function () {
      $("#almacenes").DataTable({
        "responsive": false, "lengthChange": false, "autoWidth": false,
        "buttons": ["copy", "csv", "excel", "pdf", "print", "colvis"]
      }).buttons().container().appendTo('#almacenes_wrapper .col-md-6:eq(0)');
    });

  }

  //METODO PARA ASIGNAR LOS DATOS DE LA PERSONA SELECCIONADA Y CAMBIA EL ESTADO DEL MODAL
  abrirModal(almacen: Almacen) {
    this.almacenSeleccionada = almacen;
    this.modalService.abrirModal();
  }

  //METODO PARA ASIGNAR LOS DATOS DE LA PERSONA COMO NUEVO PARA LA CREACION DE PERSONA Y CAMBIA EL ESTADO DEL MODAL
  abrirModalNuevo() {
    this.almacenSeleccionada = new Almacen();
    this.modalService.abrirModal();
  }

  deleteTable() {
    $('#almacenes').dataTable().fnDestroy();
  }

}
