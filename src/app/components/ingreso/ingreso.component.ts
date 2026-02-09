import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/views/pages/auth/login/auth.service';
import Swal from 'sweetalert2';
import { Almacen } from '../almacen/almacen';
import { AlmacenService } from '../almacen/almacen.service';
import { ModalService } from '../modal.service';
import { Producto } from '../producto/producto';
import { ReportsService } from '../reports.service';
import { Sector } from '../sector/sector';
import { SectorService } from '../sector/sector.service';
import { Ingreso } from './ingreso';
import { IngresoService } from './ingreso.service';
declare var $: any;

@Component({
  selector: 'app-ingreso',
  templateUrl: './ingreso.component.html',
  styleUrls: []
})
export class IngresoComponent implements OnInit {

  ingreso: Ingreso = new Ingreso();
  ingresos: Ingreso[];
  sectores: Sector[];
  almacenes: Almacen[];
  a: null;
  b: null;
  c: null;
  rootNode: any;

  ingresoSeleccionado: Ingreso;
  selectedAlmacen: Almacen = { id_ALMACEN: '', nom_ALMACEN: '', estado: '',reg_USER:null,fech_REG_USER:'', fech_MOD_USER:'',mod_USER:''};
  selectedSector: Sector = { id_SECTOR: '', nom_SECTOR: '',  id_ALMACEN:null,fech_REG_USER:null,reg_USER:''};

  AutoComplete = new FormControl();
  productosFiltrados: Observable<Producto[]>;

  constructor(private ingresoservice: IngresoService, public modalService: ModalService, public authService: AuthService, public almacenService: AlmacenService,
    public sectorService: SectorService,private _reportS: ReportsService) { }

  ngOnInit(): void {
    
    this.cargarIngresos();
  }

  cargarIngresos(){
    this.almacenService.obtenerAlmacenes().subscribe(almacen => this.almacenes = almacen);
    this.ingresoservice.obtenerIngresos().subscribe((mydata) => {
    this.ingresos = mydata;
    this.createDataTable();
    })          
  }

  anularWhingreso(ingreso: Ingreso): void {
    Swal.fire({
      title: 'Advertencia!',
      text: "Está seguro que desea anular el Ingreso de Produtos?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Anular!'
    }).then((result) => {
      if (result.isConfirmed) {
          ingreso.estado = "N"
          this.ingresoservice.anularWhingreso(ingreso).subscribe(
            response => {
              this.ingresos = this.ingresos.filter(wh => wh!== ingreso)
              this.deleteTable();
              this.cargarIngresos();
              Swal.fire(
                'Anulado!',
                'Se ha anulado el Ingreso de Productos',
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
   abrirModal(ingreso: Ingreso){
    this.ingresoSeleccionado = ingreso;
    this.modalService.abrirModal();
  }

  //METODO PARA ASIGNAR LOS DATOS DE LA PERSONA COMO NUEVO PARA LA CREACION DE PERSONA Y CAMBIA EL ESTADO DEL MODAL
  abrirModalNuevo(){
    this.ingresoSeleccionado = new Ingreso();
    this.modalService.abrirModal();
  }

  
  createDataTable() {

    $(function () {
      $("#ingresos").DataTable({
        "responsive": false, "lengthChange": false, "autoWidth": false,
        "buttons": ["copy", "csv", "excel", "pdf", "print", "colvis"]
      }).buttons().container().appendTo('#ingresos_wrapper .col-md-6:eq(0)');
      /*    
         $('#example1').dataTable().fnClearTable();
         $('#example1').dataTable().fnDestroy(); */

    });

  }
  deleteTable() {
    $('#ingresos').dataTable().fnDestroy();
  }

  filtrarIngresos(sector, almacen, fecha1, fecha2):void{
    this.ingresoservice.obtenerIngresoFiltro(sector, almacen, fecha1, fecha2).subscribe((ingresos) => {
    this.ingresos = ingresos;
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

createPDFIngreso(ingreso: Ingreso) {
  let doc = this._reportS.getIngresoPDF(ingreso);
  this._reportS.openPDF(doc);
}


}
