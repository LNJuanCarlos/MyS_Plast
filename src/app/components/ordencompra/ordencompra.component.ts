import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Almacen } from '../almacen/almacen';
import { ModalService } from '../modal.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { Producto } from '../producto/producto';
import { ReportsService } from '../reports.service';
import { OrdenCompra } from './ordencompra';
import { OrdencompraService } from './ordencompra.service';
import { Categoriatransaccion } from '../categoriatransaccion/categoriatransaccion';
import { AuthService } from 'src/app/views/pages/auth/login/auth.service';
import { Ingreso } from '../ingreso/ingreso';
import { Sector } from '../sector/sector';
import { IngresoService } from '../ingreso/ingreso.service';
import { SectorService } from '../sector/sector.service';
import { AlmacenService } from '../almacen/almacen.service';
import { CategoriatransaccionService } from '../categoriatransaccion/categoriatransaccion.service';
import { Itemtransaccion } from '../itemtransaccion/itemtransaccion';

declare var $: any;

@Component({
  selector: 'app-ordencompra',
  templateUrl: './ordencompra.component.html',
  styleUrls: []
})
export class OrdencompraComponent implements OnInit {

  ordencompra: OrdenCompra = new OrdenCompra();
  categoria: Categoriatransaccion;
  ordencompras: OrdenCompra[];
  ingresos: Ingreso[];
  sectores: Sector[];
  almacenes: Almacen[];
  a: null;
  b: null;
  c: null;
  rootNode: any;

  fechaInicio: string = '';
  fechaFin: string = '';

  ordencompraSeleccionado: OrdenCompra;
  selectedAlmacen: Almacen = { id_ALMACEN: '', nom_ALMACEN: '', estado: '',reg_USER:null,fech_REG_USER:'', fech_MOD_USER:'',mod_USER:''};
  selectedSector: Sector = { id_SECTOR: '', nom_SECTOR: '',  id_ALMACEN:null,fech_REG_USER:null,reg_USER:''};

  AutoComplete = new FormControl();
  productosFiltrados: Observable<Producto[]>;

  constructor(private ordencompraservice: OrdencompraService, public modalService: ModalService, private _reportS: ReportsService,
    private ingresoservice: IngresoService, public authService: AuthService, public almacenService: AlmacenService,public sectorService: SectorService,
    private categoriaService: CategoriatransaccionService) { }

  ngOnInit(): void {
    this.almacenService.obtenerAlmacenes().subscribe(almacen => this.almacenes = almacen);
    this.categoriaService.obtenerCategoriaTransaccion(1).subscribe(categoria => this.categoria = categoria);
    this.getFechaActualY7DiasAtras();
    //this.cargarIngresos();
  }

  cargarIngresos() {
    
    this.ordencompraservice.obtenerOrdenesdeCompra().subscribe((mydata) => {
      this.ordencompras = mydata;
      this.createDataTable();
    })
  }

 /* despacharOrdenCompra(ordencompra: OrdenCompra): void {
    Swal.fire({
      title: "<b><h1 style='color:#311b92'>" + '¿Está seguro que desea Despachar la Orden de Compra?' + "</h1></b>",
      html: '<b><h3 style="color:#263238">Seleccione la fecha de Despacho e Ingrese la Guía de Remisión para poder Continuar!</h3></b>' +
        '<div class="col"><div class="box-body"><div class="form-group"><label for="">Documento de Referencia</label><div><input id="docreferencia" type="text" required #docreferencia></div></div></div></div></div>' +
        ' <tr *ngFor="let item of ordencompra.items"><td>'+ordencompra.items+'</td></tr>',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, despachar!'
    }).then((result) => {
      if (result.isConfirmed) {
        let ingreso: Ingreso = new Ingreso();
        let docreferencia: string;
        docreferencia = $('#docreferencia').val();
        ingreso.proveedor = ordencompra.proveedor,
          ingreso.id_PERSONA = ordencompra.empleado,
          ingreso.id_SECTOR = ordencompra.sector,
          ingreso.guia_REF = docreferencia,
          ingreso.nro_ORDEN = ordencompra.nroordencompra,
          ingreso.categoriatransaccion = this.categoria
        for (let numero of ordencompra.items) {

          let ingresoitem: Itemtransaccion = new Itemtransaccion();
          ingresoitem.cantidad = numero.cantidad,
            ingresoitem.id_PRODUCTO = numero.id_PRODUCTO,
            ingresoitem.linea = numero.line
          ingreso.items.push(ingresoitem);

        }
        if (docreferencia == "") {
          Swal.fire({
            icon: 'error',
            title: "<b><h1 style='color:red'>" + 'Error, tiene que ingresar el documento de referencia!' + "</h1></b>",

          })
        } else {
          this.ingresoservice.crearWhingreso(ingreso).subscribe(response => {})
          this.ordencompraservice.inventariarOrdenCompra(ordencompra).subscribe(
            response => {
              this.ordencompras = this.ordencompras.filter(oc => oc !== ordencompra)
              this.deleteTable();
              this.cargarIngresos();
              Swal.fire(
                'Despachado!',
                'Se ha despachado la Orden de Compra!',
                'success'
              )
            }
          )
        }
      }
    });
  }*/

  anularOrdenCompra(ordencompra: OrdenCompra): void {
    Swal.fire({
      title: 'Advertencia!',
      text: "Está seguro que desea anular la Orden de Compra?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, anular!'
    }).then((result) => {
      if (result.isConfirmed) {
        if(ordencompra.estado=="I"){
          this.ingresoservice.obtenerIngresoxOrden(ordencompra.nroordencompra).subscribe((ingreso)=>{

            Swal.fire(
              'Error!',
              'La Orden de Compra se Encuentra Inventariada, anular su Nota de Ingreso ('+ingreso.nro_TRAN+' correspondiente a la fecha '+ingreso.fechatran+') para proceder con la anulación!',
              'warning'
            )
          })

        } else {
          ordencompra.estado = "N"
          this.ordencompraservice.anularOrdenCompra(ordencompra).subscribe(
            response => {
              this.ordencompras = this.ordencompras.filter(oc => oc !== ordencompra)
              this.deleteTable();
              this.cargarIngresos();
              Swal.fire(
                'Anulado!',
                'Se ha anulado la Orden de Compra!',
                'success'
              )
            }
          )
        }
      }
    })
  }

  aprobarOrdenCompra(ordencompra: OrdenCompra): void {
    Swal.fire({
      title: 'Advertencia!',
      text: "Está seguro que desea aprobar la Orden de Compra?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, aprobar!'
    }).then((result) => {
      if (result.isConfirmed) {
        if(ordencompra.estado=="A"){
            Swal.fire(
              'Error!',
              'La Orden de Compra ya se Encuentra Aprobada!',
              'warning'
            )
        } else {
          ordencompra.estado = "A"
          this.ordencompraservice.aprobarOrdenCompra(ordencompra).subscribe(
            response => {
              this.ordencompras = this.ordencompras.filter(oc => oc !== ordencompra)
              this.deleteTable();
              this.cargarIngresos();
              Swal.fire(
                'Aprobado!',
                'Se ha aprobado la Orden de Compra!',
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
  abrirModal(ordencompra: OrdenCompra) {
    this.ordencompraSeleccionado = ordencompra;
    this.modalService.abrirModal();
  }

  //METODO PARA ASIGNAR LOS DATOS DE LA PERSONA COMO NUEVO PARA LA CREACION DE PERSONA Y CAMBIA EL ESTADO DEL MODAL
  abrirModalNuevo() {
    this.ordencompraSeleccionado = new OrdenCompra();
    this.modalService.abrirModal();
  }


  createDataTable() {

    $(function () {
      $("#ordencompras").DataTable({
        "responsive": false, "lengthChange": false, "autoWidth": false,
        "buttons": ["copy", "csv", "excel", "pdf", "print", "colvis"], order: [[0, 'desc']]
      }).buttons().container().appendTo('#ordencompras_wrapper .col-md-6:eq(0)');
      /*    
         $('#example1').dataTable().fnClearTable();
         $('#example1').dataTable().fnDestroy(); */

    });

  }
  deleteTable() {
    $('#ordencompras').dataTable().fnDestroy();
  }

  filtrarOrdenCompras(sector, almacen): void {
    this.ordencompraservice.obtenerOrdenCompraFiltro(sector, almacen, this.fechaInicio, this.fechaFin).subscribe((ordencompras) => {
      this.ordencompras = ordencompras;
      this.deleteTable();
      this.createDataTable();
      //this.limpiarCampos();
    })

  }

  limpiarCampos(): void {
    $(function () {
      $("#almacenes").val('');
      $("#fecha1").val('');
      $("#sectores").val('');
      $("#fecha2").val('')
    });
  }

  createPDFOrdenCompra(ordencompra: OrdenCompra) {
    let doc = this._reportS.getOrdenCompraPDF(ordencompra);
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
    this.filtrarOrdenCompras(this.selectedSector.id_SECTOR, this.selectedAlmacen.id_ALMACEN);
  }


}
