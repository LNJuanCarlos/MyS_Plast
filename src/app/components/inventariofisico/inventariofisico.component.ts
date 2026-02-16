import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Almacen } from '../almacen/almacen';
import { ModalService } from '../modal.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { Producto } from '../producto/producto';
import { ReportsService } from '../reports.service';
import { AuthService } from 'src/app/views/pages/auth/login/auth.service';
import { Sector } from '../sector/sector';
import { SectorService } from '../sector/sector.service';
import { AlmacenService } from '../almacen/almacen.service';
import { InventariofisicoService } from './inventariofisico.service';
import { Inventariofisico } from './inventariofisico';
import { Ingreso } from '../ingreso/ingreso';
import { Egreso } from '../egreso/egreso';
import { CategoriatransaccionService } from '../categoriatransaccion/categoriatransaccion.service';
import { Categoriatransaccion } from '../categoriatransaccion/categoriatransaccion';
import { Itemtransaccion } from '../itemtransaccion/itemtransaccion';
import { stringify } from 'querystring';
import { IngresoService } from '../ingreso/ingreso.service';
import { EgresoService } from '../egreso/egreso.service';


declare var $: any;

@Component({
  selector: 'app-inventariofisico',
  templateUrl: './inventariofisico.component.html',
  styleUrls: []
})
export class InventariofisicoComponent implements OnInit {

  inventariofisico: Inventariofisico = new Inventariofisico();
  inventariofisicos: Inventariofisico[];
  categoriaIngreso: Categoriatransaccion;
  categoriaSalida: Categoriatransaccion;
  almacenes: Almacen[]
  sectores: Sector[];
  a: null;
  b: null;
  c: null;
  rootNode: any;

  fechaInicio: string = '';
  fechaFin: string = '';

  inventariofisicoSeleccionado: Inventariofisico;
  selectedAlmacen: Almacen = { id_ALMACEN: '', nom_ALMACEN: '', estado: '',reg_USER:null,fech_REG_USER:'', fech_MOD_USER:'',mod_USER:''};
  selectedSector: Sector = { id_SECTOR: '', nom_SECTOR: '',  id_ALMACEN:null,fech_REG_USER:null,reg_USER:''};

  AutoComplete = new FormControl();
  productosFiltrados: Observable<Producto[]>;

  constructor(private inventariofisicoservice: InventariofisicoService, public modalService: ModalService, private _reportS: ReportsService,
     public authService: AuthService, public almacenService: AlmacenService,public sectorService: SectorService, private categoriaService: CategoriatransaccionService,
      private ingresoservice: IngresoService, private egresoService: EgresoService) { }

  ngOnInit(): void {
    
    this.almacenService.obtenerAlmacenes().subscribe(almacen => this.almacenes = almacen);
    this.categoriaService.obtenerCategoriaTransaccion(8).subscribe(categoria => this.categoriaIngreso = categoria);
    this.categoriaService.obtenerCategoriaTransaccion(9).subscribe(categoria => this.categoriaSalida = categoria);
    this.getFechaActualY7DiasAtras();
    
    //this.cargarIngresos();
  }

  regularizarInventarioFisico(inventariofisico: Inventariofisico){
    Swal.fire({
      title: "<b><h1 style='color:#311b92'>" + '¿Está seguro que desea regularizar su inventario según el Inventario Físico Registrado?' + "</h1></b>",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, regularizar!'
    }).then((result) => {
      if (result.isConfirmed) {
        let confirmarIngreso: string = '';
        let confirmarEgreso: string = '';
        for (let numero of inventariofisico.items) {
                if(numero.diferencia > 0 ){
                  confirmarIngreso = 'Y';
                }
                if(numero.diferencia < 0 ){
                  confirmarEgreso = 'Y';
                }
        }
        if(confirmarIngreso == 'Y'){
          let ingreso: Ingreso = new Ingreso();
          ingreso.id_PERSONA = inventariofisico.responsable,
            ingreso.id_SECTOR = inventariofisico.id_SECTOR,
            ingreso.nro_ORDEN = inventariofisico.nroinventario,
            ingreso.categoriatransaccion = this.categoriaIngreso
          let line: number = 0;
          for (let numero of inventariofisico.items) {
            let ingresoitem: Itemtransaccion = new Itemtransaccion();
            if(numero.diferencia>0){
              ingresoitem.cantidad = (numero.cantidad - numero.cantidadsistema),
              ingresoitem.id_PRODUCTO = numero.id_PRODUCTO,
              ingresoitem.linea = line +1;
              ingreso.items.push(ingresoitem);
            }
          }
          this.ingresoservice.crearWhingreso(ingreso).subscribe(response => { })
  
        }

        if(confirmarEgreso == 'Y'){
          let egreso: Egreso = new Egreso();
          egreso.categoriatransaccion = this.categoriaSalida;
          egreso.id_SECTOR = inventariofisico.id_SECTOR;
          egreso.nro_ORDEN = inventariofisico.nroinventario;
          egreso.id_PERSONA = inventariofisico.responsable
          let line: number = 0;
          for (let numero of inventariofisico.items) {
            let egresoitem: Itemtransaccion = new Itemtransaccion();
            if(numero.diferencia<0){
              egresoitem.cantidad = (numero.cantidadsistema - numero.cantidad),
              egresoitem.id_PRODUCTO = numero.id_PRODUCTO,
              egresoitem.linea = line +1;
              egreso.items.push(egresoitem);
            }
          }
          this.egresoService.crearEgreso(egreso).subscribe(response => { })
          }

        this.inventariofisicoservice.regularizarInventarioFisico(inventariofisico).subscribe(
          response => {
            this.inventariofisicos = this.inventariofisicos.filter(oc => oc !== inventariofisico)
            this.deleteTable();
            this.getFechaActualY7DiasAtras();
            Swal.fire(
              'Inventariado!',
              'Se ha regularizado el Inventario Físico!',
              'success'
            )
          }
        )

      }
    });
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
    this.filtrarInventarios(this.selectedSector.id_SECTOR);
  }

  filtrarInventarios(sector): void {
    console.log(this.fechaInicio, this.fechaFin);
    this.inventariofisicoservice.obtenerInventariofisicoFiltro(sector, this.fechaInicio, this.fechaFin).subscribe((inventariofisicos) => {
      this.inventariofisicos = inventariofisicos;
      this.deleteTable();
      this.createDataTable();
      //this.limpiarCampos();
    })

  }

  anularInventarioFisico(inventariofisico: Inventariofisico): void {
    Swal.fire({
      title: 'Advertencia!',
      text: "Está seguro que desea anular el Inventario Físico?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, anular!'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(inventariofisico.estado)
        if(inventariofisico.estado=="N"||inventariofisico.estado=="R"){
          Swal.fire(
            'Error!',
            'El Inventario Físico debe estar Pendiente o Aprobado para poder Anularlo!',
            'warning'
          )
      }  else {
        inventariofisico.estado = "N"
          this.inventariofisicoservice.anularInventarioFisico(inventariofisico).subscribe(
            response => {
              this.inventariofisicos = this.inventariofisicos.filter(oc => oc !== inventariofisico)
              this.deleteTable();
              this.cargarIngresos();
              Swal.fire(
                'Anulado!',
                'Se ha anulado el Inventario Físico!',
                'success'
              )
            }
          )
        }
      }
    })
  }

  aprobarInventarioFisico(inventariofisico: Inventariofisico): void {
    Swal.fire({
      title: 'Advertencia!',
      text: "Está seguro que desea aprobar el Inventario Físico?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, aprobar!'
    }).then((result) => {
      if (result.isConfirmed) {
        if(inventariofisico.estado!="P"){
            Swal.fire(
              'Error!',
              'El Inventario Físico debe estar Pendiente para poder Aprobarlo!',
              'warning'
            )
        } else {
          inventariofisico.estado = "A"
          this.inventariofisicoservice.aprobarInventarioFisico(inventariofisico).subscribe(
            response => {
              this.inventariofisicos = this.inventariofisicos.filter(oc => oc !== inventariofisico)
              this.deleteTable();
              this.getFechaActualY7DiasAtras();
              Swal.fire(
                'Aprobado!',
                'Se ha aprobado el Inventario Físico!',
                'success'
              )
            }
          )
        }
      }
    })
  }


  cargarIngresos() {
    
    this.inventariofisicoservice.obtenerInventariosfisicos().subscribe((data) => {
      this.inventariofisicos = data
      this.createDataTable();});

  }
  handleAlmacenChange(id: string): void {
    this.sectorService.obtenerSectoresxAlmacen(id).subscribe((sector) => this.sectores = sector);
  }

  //METODO PARA ASIGNAR LOS DATOS DE LA PERSONA SELECCIONADA Y CAMBIA EL ESTADO DEL MODAL
  abrirModal(inventariofisico: Inventariofisico) {
    this.inventariofisicoSeleccionado = inventariofisico;
    this.modalService.abrirModal();
  }

  //METODO PARA ASIGNAR LOS DATOS DE LA PERSONA COMO NUEVO PARA LA CREACION DE PERSONA Y CAMBIA EL ESTADO DEL MODAL
  abrirModalNuevo() {
    this.inventariofisicoSeleccionado = new Inventariofisico();
    this.modalService.abrirModal();
  }


  createDataTable() {

    $(function () {
      $("#inventariofisicos").DataTable({
        "responsive": false, "lengthChange": false, "autoWidth": false,
        "buttons": ["copy", "csv", "excel", "pdf", "print", "colvis"], order: [[0, 'desc']]
      }).buttons().container().appendTo('#inventariofisicos_wrapper .col-md-6:eq(0)');
      /*    
         $('#example1').dataTable().fnClearTable();
         $('#example1').dataTable().fnDestroy(); */

    });

  }
  deleteTable() {
    $('#inventariofisicos').dataTable().fnDestroy();
  }

  filtrarInventariofisicos(sector, fecha1, fecha2): void {
    this.inventariofisicoservice.obtenerInventariofisicoFiltro(sector,  fecha1, fecha2).subscribe((inventariofisicos) => {
      this.inventariofisicos = inventariofisicos;
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
      $("#fecha2").val('')
    });
  }

  createPDFInventariofisico(inventariofisico: Inventariofisico) {
    let doc = this._reportS.getInventarioFisicoPDF(inventariofisico);
    this._reportS.openPDF(doc);
  }

}
