import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Almacen } from '../almacen/almacen';
import { ModalService } from '../modal.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { Producto } from '../producto/producto';
import { ReportsService } from '../reports.service';
import { Categoriatransaccion } from '../categoriatransaccion/categoriatransaccion';
import { AuthService } from 'src/app/views/pages/auth/login/auth.service';
import { Ingreso } from '../ingreso/ingreso';
import { Sector } from '../sector/sector';
import { IngresoService } from '../ingreso/ingreso.service';
import { SectorService } from '../sector/sector.service';
import { AlmacenService } from '../almacen/almacen.service';
import { CategoriatransaccionService } from '../categoriatransaccion/categoriatransaccion.service';
import { Ordenprod } from './ordenprod';
import { OrdenprodService } from './ordenprod.service';
import { RecetaprodService } from '../recetaprod/recetaprod.service';
import { EgresoService } from '../egreso/egreso.service';


declare var $: any;


@Component({
  selector: 'app-ordenprod',
  templateUrl: './ordenprod.component.html',
  styleUrls: []
})
export class OrdenprodComponent implements OnInit {

  ordenprod: Ordenprod = new Ordenprod();
  categoria: Categoriatransaccion;
  categoriaInsumos: Categoriatransaccion;
  ordenprods: Ordenprod[];
  ingresos: Ingreso[];
  sectores: Sector[];
  almacenes: Almacen[];
  a: null;
  b: null;
  c: null;
  rootNode: any;

  fechaInicio: string = '';
  fechaFin: string = '';

  ordenprodSeleccionado: Ordenprod;
  selectedAlmacen: Almacen = { id_ALMACEN: '', nom_ALMACEN: '', estado: '', reg_USER: null, fech_REG_USER: '', fech_MOD_USER: '', mod_USER: '' };
  selectedSector: Sector = { id_SECTOR: '', nom_SECTOR: '', id_ALMACEN: null, fech_REG_USER: null, reg_USER: '' };

  AutoComplete = new FormControl();
  productosFiltrados: Observable<Producto[]>;

  constructor(private ordenprodservice: OrdenprodService, public modalService: ModalService, private _reportS: ReportsService,
    private ingresoservice: IngresoService, public authService: AuthService, public almacenService: AlmacenService, public sectorService: SectorService,
    private categoriaService: CategoriatransaccionService, private recetaService: RecetaprodService, private egresoService: EgresoService) { }

  ngOnInit(): void {

    this.almacenService.obtenerAlmacenes().subscribe(almacen => this.almacenes = almacen);
    this.categoriaService.obtenerCategoriaTransaccion(2).subscribe(categoria => this.categoria = categoria);
    this.categoriaService.obtenerCategoriaTransaccion(7).subscribe(categoria => this.categoriaInsumos = categoria);
    this.cargarIngresos();
    this.getFechaActualY7DiasAtras();
    //this.cargarIngresos();
  }

  cargarIngresos() {
    
    this.ordenprodservice.obtenerOrdenesdeProduccion().subscribe((mydata) => {
      this.ordenprods = mydata;
      this.createDataTable();
    })
  }

  despacharOrdenprod(ordenprod: Ordenprod): void {
    Swal.fire({
      title: "<b><h1 style='color:#311b92'>" + '¿Está seguro que desea Inventariar la Orden de Producción?' + "</h1></b>",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, inventariar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.ordenprodservice.inventariarOrdenprod(ordenprod).subscribe(
          response => {
            this.ordenprods = this.ordenprods.filter(oc => oc !== ordenprod)
            this.deleteTable();
            this.cargarIngresos();
            Swal.fire(
              'Inventariado!',
              'Se ha Inventariado la Orden de Producción!',
              'success'
            )
          }
        )

      }
    });
  }

  anularOrdenprod(ordenprod: Ordenprod): void {
    Swal.fire({
      title: 'Advertencia!',
      text: "Está seguro que desea anular la Orden de Producción?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, anular!'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(ordenprod.estado)
        if (ordenprod.estado == "I") {
          console.log(ordenprod.estado)
          this.ingresoservice.obtenerIngresoxOrden(ordenprod.nro_ORDENPROD).subscribe((ingreso) => {

            Swal.fire(
              'Error!',
              'La Orden de Producción se Encuentra Inventariada, anular su Nota de Ingreso (' + ingreso.nro_TRAN + ' correspondiente a la fecha ' + ingreso.fechatran + ') para proceder con la anulación!',
              'warning'
            )
          })

        } else {
          ordenprod.estado = "N"
          this.ordenprodservice.anularOrdenprod(ordenprod).subscribe(
            response => {
              this.ordenprods = this.ordenprods.filter(oc => oc !== ordenprod)
              this.deleteTable();
              this.cargarIngresos();
              Swal.fire(
                'Anulado!',
                'Se ha anulado la Orden de Producción!',
                'success'
              )
            }
          )
        }
      }
    })
  }

  aprobarOrdenprod(ordenprod: Ordenprod): void {
    Swal.fire({
      title: 'Advertencia!',
      text: "Está seguro que desea aprobar la Orden de Producción?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, aprobar!'
    }).then((result) => {
      if (result.isConfirmed) {
        if (ordenprod.estado == "A") {
          Swal.fire(
            'Error!',
            'La Orden de Producción ya se Encuentra Aprobada!',
            'warning'
          )
        } else {
          ordenprod.estado = "A"
          this.ordenprodservice.aprobarOrdenprod(ordenprod).subscribe(
            response => {
              this.ordenprods = this.ordenprods.filter(oc => oc !== ordenprod)
              this.deleteTable();
              this.cargarIngresos();
              Swal.fire(
                'Aprobado!',
                'Se ha aprobado la Orden de Producción!',
                'success'
              )
            }
          )
        }
      }
    })
  }

  handleAlmacenChange(id: string): void {
    this.sectorService.obtenerSectoresxAlmacen(id).subscribe((sector) => this.sectores = sector);
  }

  //METODO PARA ASIGNAR LOS DATOS DE LA PERSONA SELECCIONADA Y CAMBIA EL ESTADO DEL MODAL
  abrirModal(ordenprod: Ordenprod) {
    this.ordenprodSeleccionado = ordenprod;
    this.modalService.abrirModal();
  }

  //METODO PARA ASIGNAR LOS DATOS DE LA PERSONA COMO NUEVO PARA LA CREACION DE PERSONA Y CAMBIA EL ESTADO DEL MODAL
  abrirModalNuevo() {
    this.ordenprodSeleccionado = new Ordenprod();
    this.modalService.abrirModal();
  }


  createDataTable() {

    $(function () {
      $("#ordenprods").DataTable({
        "responsive": false, "lengthChange": false, "autoWidth": false,
        "buttons": ["copy", "csv", "excel", "pdf", "print", "colvis"], order: [[0, 'desc']]
      }).buttons().container().appendTo('#ordenprods_wrapper .col-md-6:eq(0)');
      /*    
         $('#example1').dataTable().fnClearTable();
         $('#example1').dataTable().fnDestroy(); */

    });

  }
  deleteTable() {
    $('#ordenprods').dataTable().fnDestroy();
  }

  filtrarOrdenprods(sector, almacen, fecha1, fecha2, estado): void {
    this.ordenprodservice.obtenerOrdenprodFiltro(sector, almacen, fecha1, fecha2, estado).subscribe((ordenprods) => {
      this.ordenprods = ordenprods;
      this.deleteTable();
      this.createDataTable();
      this.limpiarCampos();
    })

  }

  limpiarCampos(): void {
    $(function () {
      $("#almacenes").val('');
      $("#fecha1").val('');
      $("#sectores").val('');
      $("#fecha2").val('');
      $("#estado").val('')
    });
  }

  createPDFOrdenprod(ordenprod: Ordenprod) {
    let doc = this._reportS.getOrdenprodPDF(ordenprod);
    this._reportS.openPDF(doc);
  }

  getFechaActualY7DiasAtras() {
    const hoy = new Date();
    const hace7Dias = new Date();
    hace7Dias.setDate(hoy.getDate() - 7);

    const formatoFecha = (fecha: Date) => {
      const year = fecha.getFullYear();
      const month = String(fecha.getMonth() + 1).padStart(2, '0');
      const day = String(fecha.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    this.fechaInicio = formatoFecha(hace7Dias);
    this.fechaFin = formatoFecha(hoy);
    this.filtrarOrdenprodsNew(this.selectedSector.id_SECTOR, this.selectedAlmacen.id_ALMACEN, this.ordenprodSeleccionado.estado);
  }

  filtrarOrdenprodsNew(sector, almacen, estado): void {
    console.log(this.fechaInicio, this.fechaFin);
    this.ordenprodservice.obtenerOrdenprodFiltro(sector, almacen, this.fechaInicio, this.fechaFin , estado).subscribe((ordenprods) => {
      this.ordenprods = ordenprods;
      this.deleteTable();
      this.createDataTable();
      //this.limpiarCampos();
    })

  }

}
