import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/views/pages/auth/login/auth.service';
import Swal from 'sweetalert2';
import { Almacen } from '../../almacen/almacen';
import { AlmacenService } from '../../almacen/almacen.service';
import { Egreso } from '../../egreso/egreso';
import { Ingreso } from '../../ingreso/ingreso';
import { Inventariofisico } from '../../inventariofisico/inventariofisico';
import { InventariofisicoService } from '../../inventariofisico/inventariofisico.service';
import { Iteminventariofisico } from '../../iteminventariofisico/iteminventariofisico';
import { ModalService } from '../../modal.service';
import { Natural } from '../../natural/natural';
import { Producto } from '../../producto/producto';
import { ProductoService } from '../../producto/producto.service';
import { Stock } from '../../reportes/stock/stock';
import { StockService } from '../../reportes/stock/stock.service';
import { ReportsService } from '../../reports.service';
import { Sector } from '../../sector/sector';
import { SectorService } from '../../sector/sector.service';
declare var $: any;


@Component({
  selector: 'app-forminventariofisico',
  templateUrl: './forminventariofisico.component.html',
  styleUrls: []
})
export class ForminventariofisicoComponent implements OnInit {

  inventariofisico: Inventariofisico = new Inventariofisico();

  fechaSoloIn: string; // yyyy-MM-dd

  sector: Sector[];

  almacen: Almacen[];

  productosFiltrados: Producto[];

  stockFiltrado: Stock[];

  naturalSeleccionada: Natural;

  selectedAlmacen: Almacen = { id_ALMACEN: '', nom_ALMACEN: '', estado: '', reg_USER: null, fech_REG_USER: '', fech_MOD_USER: '', mod_USER: '' };

  AutoComplete = new FormControl();

  constructor(private inventariofisicoservice: InventariofisicoService, private router: Router, public modalService: ModalService,
    public authService: AuthService, public almacenService: AlmacenService, public sectorService: SectorService,
    private productoService: ProductoService, private stockService: StockService) { }

  ngOnInit(): void {
    this.cargarData();
  }

  cargarData() {
    this.almacenService.obtenerAlmacenes().subscribe((almacenes) => {
      this.almacen = almacenes
    })
  }

  handleAlmacenChange(id: number): void {
    this.sectorService.obtenerSectoresxAlmacen(id).subscribe((sector) => this.sector = sector);
  }

  obtenerProductosFiltrados(sector: Sector) {
    this.productoService.obtenerProductosInventarioFisico(sector.id_SECTOR).subscribe((productosFiltrados) => {
      this.productosFiltrados = productosFiltrados;
    });
    this.stockService.obtenerStockXSector(sector.id_SECTOR).subscribe((stockfiltrado) => {
      this.stockFiltrado = stockfiltrado;
    });
  }

  cargarDataTabla() {

    if (this.inventariofisico.items.length !== 0) {
      this.inventariofisico.items = [];
    }
    let cantidadArregloProductos: number = this.productosFiltrados.length;
    let cantidadArregloStock: number = this.stockFiltrado.length;
    if (cantidadArregloProductos !== cantidadArregloStock) {
      Swal.fire('Error! ', `Revisar El Stock de Productos!`, 'error');
    } else {
      for (let numero of this.productosFiltrados) {
        let inventario: Iteminventariofisico = new Iteminventariofisico();
        for (let numero2 of this.stockFiltrado) {
          if (numero.id_PRODUCTO == numero2.id_PRODUCTO.id_PRODUCTO) {
            inventario.cantidadsistema = numero2.cantidad
          }
        }
        inventario.id_PRODUCTO = numero;
        this.inventariofisico.items.push(inventario);
      }


    }
    this.deleteTable();
    this.createDataTable();
  }

  actualizarCantidad(id: string, event: any): void {
    let cantidad: number = event.target.value as number;
    this.inventariofisico.items = this.inventariofisico.items.map((item: Iteminventariofisico) => {
      if (id == item.id_PRODUCTO.id_PRODUCTO) {
        item.cantidad = cantidad;
        item.diferencia = item.cantidad - item.cantidadsistema
      }
      return item;
    });

  }

  actualizarObservacion(id: string, event: any): void {
    let observacion: string = event.target.value as string;
    this.inventariofisico.items = this.inventariofisico.items.map((item: Iteminventariofisico) => {
      if (id == item.id_PRODUCTO.id_PRODUCTO) {
        item.observacion = observacion;
      }
      return item;
    });

  }


  create(): void {

    // Obtener hora actual
    const ahora = new Date();
    const hora =
      ahora.getHours().toString().padStart(2, '0') + ':' +
      ahora.getMinutes().toString().padStart(2, '0');

    // Armar LocalDateTime compatible con Spring Boot
    // yyyy-MM-ddTHH:mm
    this.inventariofisico.fecha = `${this.fechaSoloIn}T${hora}`;

    let itemInventarioFisicos: Array<Iteminventariofisico> = this.inventariofisico.items;
    let nulos: string;
    for (let number of itemInventarioFisicos) {
      if (number.cantidad == null) {
        nulos = 'Y';
      }
    }
    if (nulos == 'Y') {
      Swal.fire('Advertencia! ', `Todos los campos de cantidad deben estar registrados!`, 'error');
    } else {
      console.log(this.inventariofisico)
      this.inventariofisicoservice.crearInventarioFisico(this.inventariofisico).subscribe(inventariofisico => {
        this.router.navigate(['/generalif/inventariofisico']);
        Swal.fire('Inventario Físico Registrado', `El Inventario Físico se ha registrado correctamente!`, 'success')
      })
    }

  }

  actualizarCamposNatural(): void {
    let nombre = this.inventariofisico.responsable.nombres + ' ' + this.inventariofisico.responsable.ape_PAT + ' ' + this.inventariofisico.responsable.ape_MAT;
    $(function () {
      $("#responsable").val(nombre);
    });
  }

  abrirModalNatural() {
    this.naturalSeleccionada = new Natural();
    this.modalService.abrirModal2();
  }


  createDataTable() {

    $(function () {
      $("#inventariofisico").DataTable({
        "responsive": false, "lengthChange": false, "autoWidth": false, "searching": false,
        "buttons": ["copy", "csv", "excel", "pdf", "print", "colvis"]
      }).buttons().container().appendTo('#inventariofisico_wrapper .col-md-6:eq(0)');
      /*    
         $('#example1').dataTable().fnClearTable();
         $('#example1').dataTable().fnDestroy(); */

    });

  }
  deleteTable() {
    $('#inventariofisico').dataTable().fnDestroy();
  }


}