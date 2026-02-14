import { Component, OnInit } from '@angular/core';
declare var $: any;
import Swal from 'sweetalert2';
import { ModalService } from '../modal.service';
import { Producto } from './producto';
import { ProductoService } from './producto.service';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: []
})
export class ProductoComponent implements OnInit {

  productos: Producto[];

  rootNode: any;

  productoSeleccionado: Producto;


  constructor(private productoService: ProductoService, public modalService: ModalService) { }

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos() {
    this.productoService.obtenerProductos().subscribe((producto) => {
      this.productos = producto
      this.createDataTable();
    });
  }

  delete(producto: Producto): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: 'Estás Seguro?',
      text: `Está seguro que desea eliminar el Producto ${producto.nombre}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, Eliminar!',
      cancelButtonText: 'No, Cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.productoService.eliminarProducto(producto.id_PRODUCTO).subscribe(
          response => {
            this.deleteTable();
            this.productos = this.productos.filter(prod => prod !== producto)
            this.createDataTable();
            swalWithBootstrapButtons.fire(
              'Eliminado!',
              'El Producto ha sido eliminado',
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

  createDataTable() {

    $(function () {
      $("#productos").DataTable({
        "responsive": false, "lengthChange": false, "autoWidth": false,
        language: {
          "url":"assets/data/idiomadatatable.json"
        },
        "buttons": ["copy", "csv", "excel", "pdf", "print", "colvis"]
      }).buttons().container().appendTo('#productos_wrapper .col-md-6:eq(0)');
    });

  }

  //METODO PARA ASIGNAR LOS DATOS DE LA PERSONA SELECCIONADA Y CAMBIA EL ESTADO DEL MODAL
  abrirModal(producto: Producto) {
    this.productoSeleccionado = producto;
    this.modalService.abrirModal();
  }

  //METODO PARA ASIGNAR LOS DATOS DE LA PERSONA COMO NUEVO PARA LA CREACION DE PERSONA Y CAMBIA EL ESTADO DEL MODAL
  abrirModalNuevo() {
    this.productoSeleccionado = new Producto();
    this.modalService.abrirModal();
  }

  deleteTable() {
    $('#productos').dataTable().fnDestroy();
  }

  actualizarListadoProductos(producto: Producto) {
   
    const index = this.productos.findIndex(prod => prod.id_PRODUCTO === producto.id_PRODUCTO);
    if (index !== -1) {
      this.productos[index].codexterno = producto.codexterno;
      this.productos[index].desc_PRODUCTO = producto.desc_PRODUCTO;
      this.productos[index].estado = producto.estado;
      this.productos[index].flag_INSUMO = producto.flag_INSUMO;
      this.productos[index].flag_PRODUCCION = producto.flag_PRODUCCION;
      this.productos[index].id_CATEGORIA = producto.id_CATEGORIA;
      this.productos[index].id_MARCA = producto.id_MARCA;
      this.productos[index].id_UNMEDIDA = producto.id_UNMEDIDA;
      this.productos[index].nombre = producto.nombre;
    }
    
  }

}
