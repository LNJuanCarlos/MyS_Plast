import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Almacen } from '../../almacen/almacen';
import { AlmacenService } from '../../almacen/almacen.service';
import { Categoriatransaccion } from '../../categoriatransaccion/categoriatransaccion';
import { CategoriatransaccionService } from '../../categoriatransaccion/categoriatransaccion.service';
import { Centrocosto } from '../../centrocosto/centrocosto';
import { CentrocostoService } from '../../centrocosto/centrocosto.service';
import { Itemtransaccion } from '../../itemtransaccion/itemtransaccion';
import { ModalService } from '../../modal.service';
import { Natural } from '../../natural/natural';
import { Producto } from '../../producto/producto';
import { ProductoService } from '../../producto/producto.service';
import { Sector } from '../../sector/sector';
import { SectorService } from '../../sector/sector.service';
import { Egreso } from '../egreso';
import { EgresoService } from '../egreso.service';
import Swal from 'sweetalert2';
declare var $: any;

@Component({
  selector: 'app-formegreso',
  templateUrl: './formegreso.component.html',
  styleUrls: []
})
export class FormegresoComponent implements OnInit {

 //SE INYECTA LA CLASE PERSONA

 fechaSoloe: string; // yyyy-MM-dd

 egreso: Egreso = new Egreso();

 sector: Sector[];

 categoriatransaccion: Categoriatransaccion[];

 almacen: Almacen[];

 centrocosto: Centrocosto[];

 naturalSeleccionada: Natural;
 
 selectedAlmacen: Almacen = { id_ALMACEN: '', nom_ALMACEN: '', estado: '',reg_USER:null,fech_REG_USER:'', fech_MOD_USER:'',mod_USER:''};
AutoComplete = new FormControl();
productosFiltrados: Observable<Producto[]>;

constructor(private egresoservice: EgresoService, private router: Router, public modalService: ModalService, public almacenService: AlmacenService,
  public sectorService: SectorService, public categoriastransaccionService: CategoriatransaccionService, public productoService: ProductoService,
  public centrocostoService: CentrocostoService) { }


ngOnInit(): void {
  this.almacenService.obtenerAlmacenes().subscribe(almacen => this.almacen = almacen);
  this.cargarCategoriasTransaccion();
  this.centrocostoService.obtenerCentrocostos().subscribe(centrocosto => this.centrocosto = centrocosto);
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
  this.categoriastransaccionService.obtenerCategoriasTransaccion(2).subscribe((categoriatransaccion) => this.categoriatransaccion = categoriatransaccion);
}

private _filter(value: string): Observable<Producto[]> {
  const filterValue = value.toLowerCase();
  return this.productoService.obtenerProductosFiltrados(filterValue);
}

mostrarNombre(producto?: Producto): string | undefined {
  return producto ? producto.nombre : undefined;
}

seleccionarProducto(event: MatAutocompleteSelectedEvent): void {
  let producto = event.option.value as Producto;

  if(this.existeItem(producto.id_PRODUCTO)){
    this.incrementaCantidad(producto.id_PRODUCTO);
  } else {
  let nuevoItem = new Itemtransaccion();
  nuevoItem.linea = this.egreso.items.length + 1;
  nuevoItem.id_PRODUCTO = producto;
  this.egreso.items.push(nuevoItem);
  }

  this.AutoComplete.setValue('');
  event.option.focus();
  event.option.deselect();
}

actualizarCantidad(id: string, event: any): void {
  let cantidad: number = event.target.value as number;

  if(cantidad ==0){
      return this.eliminarItemSalida(id);
  }

  this.egreso.items = this.egreso.items.map((item: Itemtransaccion) => {
    if (id === item.id_PRODUCTO.id_PRODUCTO) {
      item.cantidad = cantidad;
    }
    return item;
  });

}

existeItem(id: string): boolean {
    let existe = false;

    this.egreso.items.forEach((item: Itemtransaccion)=>{
      if(id === item.id_PRODUCTO.id_PRODUCTO){
        existe = true;
      }
    })
    return existe;
}

incrementaCantidad(id: string): void {

  this.egreso.items = this.egreso.items.map((item: Itemtransaccion) => {
    if (id === item.id_PRODUCTO.id_PRODUCTO) {
      ++item.cantidad;
    }
    return item;
  });
  
}

eliminarItemSalida(id: string):void{
  this.egreso.items = this.egreso.items.filter((item: Itemtransaccion)=> id !== item.id_PRODUCTO.id_PRODUCTO);
}

create(): void {

  // Obtener hora actual
  const ahora = new Date();
  const hora =
    ahora.getHours().toString().padStart(2, '0') + ':' +
    ahora.getMinutes().toString().padStart(2, '0');

  // Armar LocalDateTime compatible con Spring Boot
  // yyyy-MM-ddTHH:mm
  this.egreso.fechatran = `${this.fechaSoloe}T${hora}`;

  this.egresoservice.crearEgreso(this.egreso).subscribe(egreso => {
    this.router.navigate(['/generalws/egreso']);
    Swal.fire(
      'Salida Registrada',
      'La Salida de Mercadería se ha registrado con Éxito!',
      'success'
    );
  });
}


actualizarCamposNatural():void{
  let nombre = this.egreso.id_PERSONA.nombres + ' ' + this.egreso.id_PERSONA.ape_PAT + ' ' + this.egreso.id_PERSONA.ape_MAT;
  $(function () {
    $("#responsable").val(nombre);
  });
}

  //METODO PARA ASIGNAR LOS DATOS DE LA PERSONA COMO NUEVO PARA LA CREACION DE PERSONA Y CAMBIA EL ESTADO DEL MODAL

  abrirModalNatural(){
    this.naturalSeleccionada = new Natural();
    this.modalService.abrirModal2();
  }

}
