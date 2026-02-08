import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { Almacen } from '../almacen/almacen';
import { ModalService } from '../modal.service';
import { Producto } from '../producto/producto';
import { ReportsService } from '../reports.service';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/views/pages/auth/login/auth.service';
import { Transferencia } from './transferencia';
import { Sector } from '../sector/sector';
import { TransferenciaService } from './transferencia.service';
import { AlmacenService } from '../almacen/almacen.service';
import { SectorService } from '../sector/sector.service';
declare var $: any;


@Component({
  selector: 'app-transferencia',
  templateUrl: './transferencia.component.html',
  styleUrls: []
})
export class TransferenciaComponent implements OnInit {

  transferencia: Transferencia = new Transferencia();
  transferencias: Transferencia[];
  sectores: Sector[];
  almacenes: Almacen[];
  sectoresdest: Sector[];
  almacenesdest: Almacen[];
  a: null;
  b: null;
  c: null;
  rootNode: any;

  transferenciaSeleccionado: Transferencia;
  selectedAlmacen: Almacen = { id_ALMACEN: '', nom_ALMACEN: '', estado: '',reg_USER:null,fech_REG_USER:'', fech_MOD_USER:'',mod_USER:''};
  selectedSector: Sector = { id_SECTOR: '', nom_SECTOR: '',  id_ALMACEN:null,fech_REG_USER:null,reg_USER:''};
  selectedAlmacendest: Almacen = { id_ALMACEN: '', nom_ALMACEN: '', estado: '',reg_USER:null,fech_REG_USER:'', fech_MOD_USER:'',mod_USER:''};
  selectedSectordest: Sector = { id_SECTOR: '', nom_SECTOR: '',  id_ALMACEN:null,fech_REG_USER:null,reg_USER:''};

  AutoComplete = new FormControl();
  productosFiltrados: Observable<Producto[]>;

  constructor(private transferenciaservice: TransferenciaService, public modalService: ModalService, private _reportS: ReportsService, public authService: AuthService,
  public almacenService: AlmacenService, public sectorService: SectorService) { }

  ngOnInit(): void {
    
    this.cargarWhsalidas();
  }

  cargarWhsalidas(){
    this.almacenService.obtenerAlmacenes().subscribe(almacen => this.almacenes = almacen);
    this.transferenciaservice.obtenerTransferencias().subscribe((mydata) => {
    this.transferencias = mydata;
    this.createDataTable();
    })          
  }

  anularWhtransferencia(transferencia: Transferencia): void {
    Swal.fire({
      title: 'Advertencia!',
      text: "Está seguro que desea anular la Salida de Produto?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, actualizar!'
    }).then((result) => {
      if (result.isConfirmed) {
        transferencia.estado = "N"
          this.transferenciaservice.anularTransferencia(transferencia).subscribe(
            response => {
              this.transferencias = this.transferencias.filter(wh => wh!== transferencia)
              this.deleteTable();
              this.cargarWhsalidas();
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
    this.sectorService.obtenerSectoresxAlmacen(id).subscribe((subalmacen) => this.sectores = subalmacen);
  }

   //METODO PARA ASIGNAR LOS DATOS DE LA PERSONA SELECCIONADA Y CAMBIA EL ESTADO DEL MODAL
   abrirModal(transferencia: Transferencia){
    this.transferenciaSeleccionado = transferencia;
    this.modalService.abrirModal();
  }

  //METODO PARA ASIGNAR LOS DATOS DE LA PERSONA COMO NUEVO PARA LA CREACION DE PERSONA Y CAMBIA EL ESTADO DEL MODAL
  abrirModalNuevo(){
    this.transferenciaSeleccionado = new Transferencia();
    this.modalService.abrirModal();
  }

  
  createDataTable() {

    $(function () {
      $("#whtransferencias").DataTable({
        "responsive": false, "lengthChange": false, "autoWidth": false,
        "buttons": ["copy", "csv", "excel", "pdf", "print", "colvis"]
      }).buttons().container().appendTo('#whtransferencias_wrapper .col-md-6:eq(0)');
      /*    
         $('#example1').dataTable().fnClearTable();
         $('#example1').dataTable().fnDestroy(); */

    });

  }
  deleteTable() {
    $('#whtransferencias').dataTable().fnDestroy();
  }

  filtrarWhtransferencias(sector, almacen, fecha1, fecha2):void{
    this.transferenciaservice.obtenerTransferenciaFiltro(sector, almacen, fecha1, fecha2).subscribe((transferencias) => {
    this.transferencias = transferencias;
    this.deleteTable();
    this.createDataTable();
    this.limpiarCampos();
  })          
 
}

limpiarCampos():void{
  $(function () {
    $("#almacenes").val('');
    $("#fecha1").val('');
    $("#sectores").val('');
    $("#fecha2").val('')
  });
}

createPDFTransferencia(transferencia: Transferencia) {
  let doc = this._reportS.getTransferenciaPDF(transferencia);
  this._reportS.openPDF(doc);
}


}
