import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { Almacen } from '../almacen/almacen';
import { ModalService } from '../modal.service';
import { Producto } from '../producto/producto';
import { ReportsService } from '../reports.service';
import { AuthService } from 'src/app/views/pages/auth/login/auth.service';
import { Egreso } from './egreso';
import { Sector } from '../sector/sector';
import { Centrocosto } from '../centrocosto/centrocosto';
import { EgresoService } from './egreso.service';
import { SectorService } from '../sector/sector.service';
import { AlmacenService } from '../almacen/almacen.service';
import { CentrocostoService } from '../centrocosto/centrocosto.service';
declare var $: any;

@Component({
  selector: 'app-egreso',
  templateUrl: './egreso.component.html',
  styleUrls: []
})
export class EgresoComponent implements OnInit {

  whsalida: Egreso = new Egreso();
  egresos: Egreso[];
  sectores: Sector[];
  almacenes: Almacen[];
  centrocostos: Centrocosto[];
  a: null;
  b: null;
  c: null;
  rootNode: any;

  whsalidaSeleccionado: Egreso;
  selectedAlmacen: Almacen = { id_ALMACEN: '', nom_ALMACEN: '', estado: '',reg_USER:null,fech_REG_USER:'', fech_MOD_USER:'',mod_USER:''};
  selectedSector: Sector = { id_SECTOR: '', nom_SECTOR: '',  id_ALMACEN:null,fech_REG_USER:null,reg_USER:''};

  AutoComplete = new FormControl();
  productosFiltrados: Observable<Producto[]>;

  constructor(private egresoservice: EgresoService, public modalService: ModalService, private _reportS: ReportsService, public authService: AuthService,
    public almacenService: AlmacenService, public sectorService: SectorService, public centrocostoService: CentrocostoService) { }

  ngOnInit(): void {
    
    this.cargarEgresos();
  }

  cargarEgresos(){
    this.almacenService.obtenerAlmacenes().subscribe(almacen => this.almacenes = almacen);
    this.centrocostoService.obtenerCentrocostos().subscribe(centrocosto => this.centrocostos = centrocosto);
    this.egresoservice.obtenerEgresos().subscribe((mydata) => {
    this.egresos = mydata;
    this.createDataTable();
    })          
  }

  anularEgreso(whsalida: Egreso): void {
    Swal.fire({
      title: 'Advertencia!',
      text: "Está seguro que desea anular la Salida de Produto?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Anular!'
    }).then((result) => {
      if (result.isConfirmed) {
        whsalida.estado = "N"
          this.egresoservice.anularEgreso(whsalida).subscribe(
            response => {
              this.egresos = this.egresos.filter(wh => wh!== whsalida)
              this.deleteTable();
              this.cargarEgresos();
              Swal.fire(
                'Anulado!',
                'Se ha anulado la Salida de Producto',
                'success'
              )
            }
          )
      }
    })
  }

  handleAlmacenChange(id: string): void {
    this.sectorService.obtenerSectoresxAlmacen(id).subscribe((sector) => this.sectores = sector);
  }

   //METODO PARA ASIGNAR LOS DATOS DE LA PERSONA SELECCIONADA Y CAMBIA EL ESTADO DEL MODAL
   abrirModal(whsalida: Egreso){
    this.whsalidaSeleccionado = whsalida;
    this.modalService.abrirModal();
  }

  //METODO PARA ASIGNAR LOS DATOS DE LA PERSONA COMO NUEVO PARA LA CREACION DE PERSONA Y CAMBIA EL ESTADO DEL MODAL
  abrirModalNuevo(){
    this.whsalidaSeleccionado = new Egreso();
    this.modalService.abrirModal();
  }

  
  createDataTable() {

    $(function () {
      $("#egresos").DataTable({
        "responsive": false, "lengthChange": false, "autoWidth": false,
        "buttons": ["copy", "csv", "excel", "pdf", "print", "colvis"]
      }).buttons().container().appendTo('#egresos_wrapper .col-md-6:eq(0)');
      /*    
         $('#example1').dataTable().fnClearTable();
         $('#example1').dataTable().fnDestroy(); */

    });

  }
  deleteTable() {
    $('#egresos').dataTable().fnDestroy();
  }

  filtrarEgresos(sector, almacen, fecha1, fecha2):void{
    this.egresoservice.obtenerEgresoFiltro(sector, almacen, fecha1, fecha2).subscribe((egresos) => {
    this.egresos = egresos;
    this.deleteTable();
    this.createDataTable();
    this.limpiarCampos();
  })          
 
}

limpiarCampos():void{
  $(function () {
    $("#almacenes").val('');
    $("#fecha1").val('');
    $("#sector").val('');
    $("#fecha2").val('')
  });
}

createPDFEgreso(egreso: Egreso) {
  let doc = this._reportS.getEgresoPDF(egreso);
  this._reportS.openPDF(doc);
}


}
