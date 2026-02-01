import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Almacen } from '../../almacen/almacen';
import { AlmacenService } from '../../almacen/almacen.service';
import { Producto } from '../../producto/producto';
import { ProductoService } from '../../producto/producto.service';
import { Sector } from '../../sector/sector';
import { SectorService } from '../../sector/sector.service';
import { Kardex } from '../kardex/kardex';
import { KardexService } from '../kardex/kardex.service';
import Swal from 'sweetalert2';
declare var $: any;

@Component({
  selector: 'app-kardex',
  templateUrl: './kardex.component.html',
  styleUrls: []
})
export class KardexComponent implements OnInit {

  kardex: Kardex = new Kardex();
  kardexs: Kardex[];
  sectores: Sector[];
  almacenes: Almacen[];
  a: null;
  b: null;
  c: null;
  rootNode: any;
  idProducto: string = "";

  selectedAlmacen: Almacen = { id_ALMACEN: '', nom_ALMACEN: '', estado: '',reg_USER:null,fech_REG_USER:'', fech_MOD_USER:'',mod_USER:''};
  selectedSector: Sector = { id_SECTOR: '', nom_SECTOR: '',  id_ALMACEN:null,fech_REG_USER:null,reg_USER:''};

  AutoComplete = new FormControl();
  productosFiltrados: Observable<Producto[]>;

  constructor(private kardexservice: KardexService, private almacenService: AlmacenService, private sectorService: SectorService,
    private productoService: ProductoService) { }

  ngOnInit(): void {
    this.almacenService.obtenerAlmacenes().subscribe(almacen => this.almacenes = almacen);
    this.productosFiltrados = this.AutoComplete.valueChanges
    .pipe(
      map(value => typeof value === 'string' ? value : value.id_producto),
      mergeMap(value => value ? this._filter(value) : [])
    );
    this.createDataTable();
  }

  handleAlmacenChange(id: string): void {
    this.sectorService.obtenerSectoresxAlmacen(id).subscribe((sector) => this.sectores = sector);
  }

  private _filter(value: string): Observable<Producto[]> {
    const filterValue = value.toLowerCase();
    return this.productoService.obtenerProductosFiltrados(filterValue);
  }

  mostrarNombre(producto?: Producto): string | undefined {
    return producto ? producto.nombre : undefined;
  }

  createDataTable() {

    $(function () {
      $("#kardexs").DataTable({
        "responsive": false, "lengthChange": false, "autoWidth": false,
        "buttons": ["copy", "csv", "excel", "pdf", "print", "colvis"]
      }).buttons().container().appendTo('#kardexs_wrapper .col-md-6:eq(0)');
      /*    
         $('#example1').dataTable().fnClearTable();
         $('#example1').dataTable().fnDestroy(); */

    });

  }
  deleteTable() {
    $('#kardexs').dataTable().fnDestroy();
  }

  filtrarKardex(event: Event): void {
    event.preventDefault();
    
    // Obtener las fechas directamente de los elementos
    const fecha1Element = document.getElementById('fecha1') as HTMLInputElement;
    const fecha2Element = document.getElementById('fecha2') as HTMLInputElement;
    let fecha1 = fecha1Element.value;
    let fecha2 = fecha2Element.value;
    
    // Validaciones
    if (!this.selectedAlmacen.id_ALMACEN) {
      Swal.fire('Advertencia', 'Por favor selecciona un almacén', 'warning');
      return;
    }
    
    if (!this.selectedSector.id_SECTOR) {
      Swal.fire('Advertencia', 'Por favor selecciona un sector', 'warning');
      return;
    }
    
    if (!fecha1 || !fecha2) {
      Swal.fire('Advertencia', 'Por favor selecciona ambas fechas', 'warning');
      return;
    }
  
    // SOLUCIÓN: Agregar hora a las fechas
    // Fecha1: inicio del día (00:00:00)
    fecha1 = fecha1 + ' 00:00:00';
    
    // Fecha2: fin del día (23:59:59)
    fecha2 = fecha2 + ' 23:59:59';
    
    console.log('Fecha inicio:', fecha1);
    console.log('Fecha final:', fecha2);
  
    this.kardexservice.obtenerKardexFiltro(
      this.selectedSector.id_SECTOR,
      this.selectedAlmacen.id_ALMACEN,
      this.idProducto || '',
      fecha1,
      fecha2
    ).subscribe(
      (kardexs) => {
        this.kardexs = kardexs;
        this.deleteTable();
        this.createDataTable();
      },
      (error) => {
        console.error('Error en la petición:', error);
      }
    );
  }
  

asignarValorProducto(id:string):void{
  this.idProducto = id;
}

limpiarCampos():void{
  $(function () {
    $("#almacenes").val('');
    $("#fecha1").val('');
    $("#sectores").val('');
    $("#productos").val('');
    $("#fecha2").val('')
  });
}

}
