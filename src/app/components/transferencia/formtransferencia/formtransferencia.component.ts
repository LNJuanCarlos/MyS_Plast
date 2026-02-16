import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { mergeMap, map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Almacen } from '../../almacen/almacen';
import { ModalService } from '../../modal.service';
import { Producto } from '../../producto/producto';
import Swal from 'sweetalert2';
import { Natural } from '../../natural/natural';
import { Router } from '@angular/router';
import { Categoriatransaccion } from '../../categoriatransaccion/categoriatransaccion';
import { Transferencia } from '../transferencia';
import { Sector } from '../../sector/sector';
import { TransferenciaService } from '../transferencia.service';
import { ProductoService } from '../../producto/producto.service';
import { CategoriatransaccionService } from '../../categoriatransaccion/categoriatransaccion.service';
import { SectorService } from '../../sector/sector.service';
import { AlmacenService } from '../../almacen/almacen.service';
import { Itemtransaccion } from '../../itemtransaccion/itemtransaccion';
import { KardexService } from '../../reportes/kardex/kardex.service';
declare var $: any;


@Component({
  selector: 'app-formtransferencia',
  templateUrl: './formtransferencia.component.html',
  styleUrls: []
})
export class FormtransferenciaComponent implements OnInit {

 //SE INYECTA LA CLASE PERSONA

 fechaSoloT: string; // yyyy-MM-dd

 transferencia: Transferencia = new Transferencia();

 sector: Sector[];

 categoriatransaccion: Categoriatransaccion[];

 sectordest: Sector[];

 almacen: Almacen[];

 almacendest: Almacen[];

 naturalSeleccionada: Natural;
 
selectedAlmacen: Almacen = { id_ALMACEN: '', nom_ALMACEN: '', estado: '',reg_USER:null,fech_REG_USER:'', fech_MOD_USER:'',mod_USER:''};
selectedAlmacendest: Almacen = { id_ALMACEN: '', nom_ALMACEN: '', estado: '',reg_USER:null,fech_REG_USER:'', fech_MOD_USER:'',mod_USER:''};
AutoComplete = new FormControl();
productosFiltrados: Observable<Producto[]>;

constructor(private kardexService: KardexService, private transferenciaservice: TransferenciaService, private router: Router, public modalService: ModalService, public almacenService: AlmacenService,
  public sectorService: SectorService, public categoriastransaccionService: CategoriatransaccionService, public productoService: ProductoService) { }

ngOnInit(): void {
  this.almacenService.obtenerAlmacenes().subscribe(almacen => this.almacen = almacen);
  this.cargarCategoriasTransaccion();
  this.almacenService.obtenerAlmacenes().subscribe(almacendest => this.almacendest = almacendest);
  this.productosFiltrados = this.AutoComplete.valueChanges
  .pipe(
    map(value => typeof value === 'string' ? value : value.nombre),
    mergeMap(value => value ? this._filter(value) : [])
  );
}

handleAlmacenChange(id: number): void {
  this.sectorService.obtenerSectoresxAlmacen(id).subscribe((sector) => this.sector = sector);
}

cargarCategoriasTransaccion(): void {
  this.categoriastransaccionService.obtenerCategoriasTransaccion(3).subscribe((categoriatransaccion) => this.categoriatransaccion = categoriatransaccion);
}

handleAlmacenDestChange(id: number): void {
  this.sectorService.obtenerSectoresxAlmacen(id).subscribe((sectordest) => this.sectordest = sectordest);
}

private _filter(value: string): Observable<Producto[]> {
  const filterValue = value.toLowerCase();
  return this.productoService.obtenerProductosFiltrados(filterValue);
}

mostrarNombre(producto?: Producto): string | undefined {
  return producto ? producto.nombre : undefined;
}

/*seleccionarProducto(event: MatAutocompleteSelectedEvent): void {
  let producto = event.option.value as Producto;

  if(this.existeItem(producto.id_PRODUCTO)){
    this.incrementaCantidad(producto.id_PRODUCTO);
  } else {
  let nuevoItem = new Itemtransaccion();
  nuevoItem.linea = this.transferencia.items.length + 1;
  nuevoItem.id_PRODUCTO = producto;
  this.transferencia.items.push(nuevoItem);
  }

  this.AutoComplete.setValue('');
  event.option.focus();
  event.option.deselect();
}*/

seleccionarProducto(event: MatAutocompleteSelectedEvent): void {
  const producto = event.option.value;

  if (!this.transferencia.id_SECTOR) {
    Swal.fire('Advertencia', 'Seleccione un sector primero', 'warning');
    return;
  }

  // evitar duplicados
  if (this.existeItem(producto.id_PRODUCTO)) {
    this.incrementaCantidad(producto.id_PRODUCTO);
    return;
  }

  const item = new Itemtransaccion();
  item.linea = this.transferencia.items.length + 1;
  item.id_PRODUCTO = producto;
  item.cantidad = null;

  this.transferencia.items.push(item);

  this.obtenerStockProducto(item);

  this.AutoComplete.setValue('');
  event.option.focus();
  event.option.deselect();
}

actualizarCantidad(id: string, event: any): void {
  let cantidad: number = event.target.value as number;

  if(cantidad ==0){
      return this.eliminarItemTransferencia(id);
  }

  this.transferencia.items = this.transferencia.items.map((item: Itemtransaccion) => {
    if (id === item.id_PRODUCTO.id_PRODUCTO) {
      item.cantidad = cantidad;
    }
    return item;
  });

}

existeItem(id: string): boolean {
    let existe = false;

    this.transferencia.items.forEach((item: Itemtransaccion)=>{
      if(id === item.id_PRODUCTO.id_PRODUCTO){
        existe = true;
      }
    })
    return existe;
}

incrementaCantidad(id: string): void {

  this.transferencia.items = this.transferencia.items.map((item: Itemtransaccion) => {
    if (id === item.id_PRODUCTO.id_PRODUCTO) {
      ++item.cantidad;
    }
    return item;
  });
  
}

eliminarItemTransferencia(id: string):void{
  this.transferencia.items = this.transferencia.items.filter((item: Itemtransaccion)=> id !== item.id_PRODUCTO.id_PRODUCTO);
}

create(): void {

  // Obtener hora actual
  const ahora = new Date();
  const hora =
    ahora.getHours().toString().padStart(2, '0') + ':' +
    ahora.getMinutes().toString().padStart(2, '0');

  // Armar LocalDateTime compatible con Spring Boot
  // yyyy-MM-ddTHH:mm
  this.transferencia.fechatran = `${this.fechaSoloT}T${hora}`;

  this.transferenciaservice.crearTransferencia(this.transferencia).subscribe(transferencia => {
    this.router.navigate(['/generalwt/transferencia']);
    Swal.fire(
      'Transferencia Registrada',
      'La Transferencia de Mercaderia se ha registrado con Éxito!',
      'success'
    );
  });
}


actualizarCamposNatural():void{
  let nombre = this.transferencia.id_PERSONA.nombres + ' ' + this.transferencia.id_PERSONA.ape_PAT + ' ' + this.transferencia.id_PERSONA.ape_MAT;
  $(function () {
    $("#responsable").val(nombre);
  });
}

  //METODO PARA ASIGNAR LOS DATOS DE LA PERSONA COMO NUEVO PARA LA CREACION DE PERSONA Y CAMBIA EL ESTADO DEL MODAL

  abrirModalNatural(){
    this.naturalSeleccionada = new Natural();
    this.modalService.abrirModal2();
  }

  obtenerStockProducto(item: Itemtransaccion): void {

    if (!this.transferencia?.id_SECTOR || !item?.id_PRODUCTO) {
      item.stockActual = 0;
      return;
    }
  
    this.kardexService
      .obtenerStockActual(
        this.transferencia.id_SECTOR.id_SECTOR,
        item.id_PRODUCTO.id_PRODUCTO
      )
      .subscribe(stock => {
        item.stockActual = stock;
      });
  }

}
