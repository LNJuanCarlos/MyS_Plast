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
import { Stock } from './stock';
import { StockService } from './stock.service';
declare var $: any;


@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: []
})
export class StockComponent implements OnInit {

  productostock: Stock = new Stock();
  productostocks: Stock[];
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

  constructor(private productostockservice: StockService, private almacenService: AlmacenService, private sectorService: SectorService,
    private productoService: ProductoService) { }

  ngOnInit(): void {
    this.almacenService.obtenerAlmacenes().subscribe(almacen => this.almacenes = almacen);
    this.productosFiltrados = this.AutoComplete.valueChanges
    .pipe(
      map(value => typeof value === 'string' ? value : value.nombre),
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
      $("#productostocks").DataTable({
        "responsive": false, "lengthChange": false, "autoWidth": false,
        "buttons": ["copy", "csv", "excel", "pdf", "print", "colvis"]
      }).buttons().container().appendTo('#productostocks_wrapper .col-md-6:eq(0)');
      /*    
         $('#example1').dataTable().fnClearTable();
         $('#example1').dataTable().fnDestroy(); */

    });

  }
  deleteTable() {
    $('#productostocks').dataTable().fnDestroy();
  }

  filtrarStock(subalm, almacen,):void{
    this.productostockservice.obtenerProductoStockFiltro(subalm, almacen, this.idProducto).subscribe((productostocks) => {
    this.productostocks = productostocks;
    this.deleteTable();
    this.createDataTable();
    this.limpiarCampos();
    this.idProducto = "";
    this.AutoComplete.setValue('');
  })          
 
}


asignarValorProducto(productoId: string) {
  this.idProducto = productoId;
}

limpiarCampos():void{
  $(function () {
    $("#almacenes").val('');
    $("#sectores").val('');
    $("#productos").val('')
  });
}


}