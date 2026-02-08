import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Almacen } from '../../almacen/almacen';
import { AlmacenService } from '../../almacen/almacen.service';
import { Categoriatransaccion } from '../../categoriatransaccion/categoriatransaccion';
import { CategoriatransaccionService } from '../../categoriatransaccion/categoriatransaccion.service';
import { Itemtransaccion } from '../../itemtransaccion/itemtransaccion';
import { Juridica } from '../../juridica/juridica';
import { ModalService } from '../../modal.service';
import { Natural } from '../../natural/natural';
import { Producto } from '../../producto/producto';
import { ProductoService } from '../../producto/producto.service';
import { Sector } from '../../sector/sector';
import { SectorService } from '../../sector/sector.service';
import { Ingreso } from '../ingreso';
import { IngresoService } from '../ingreso.service';
declare var $: any;

@Component({
  selector: 'app-formingreso',
  templateUrl: './formingreso.component.html',
  styleUrls: []
})
export class FormingresoComponent implements OnInit {

 //SE INYECTA LA CLASE PERSONA

 fechaSolo: string; // yyyy-MM-dd

 ingreso: Ingreso = new Ingreso();

 sector: Sector[];

 categoriatransaccion: Categoriatransaccion[];

 almacen: Almacen[];

 juridicaSeleccionada: Juridica;

 naturalSeleccionada: Natural;
 
selectedAlmacen: Almacen = { id_ALMACEN: '', nom_ALMACEN: '', estado: '',reg_USER:null,fech_REG_USER:'', fech_MOD_USER:'',mod_USER:''};

AutoComplete = new FormControl();
productosFiltrados: Observable<Producto[]>;

constructor(private ingresoservice: IngresoService, private router: Router, public modalService: ModalService, public almacenService: AlmacenService,
  public sectorService: SectorService, public categoriastransaccionService: CategoriatransaccionService, public productoService: ProductoService) { }

ngOnInit(): void {
  this.almacenService.obtenerAlmacenes().subscribe(almacen => this.almacen = almacen);
  this.cargarCategoriasTransaccion();
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
  this.categoriastransaccionService.obtenerCategoriasTransaccion(1).subscribe((categoriatransaccion) => this.categoriatransaccion = categoriatransaccion);
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
  nuevoItem.linea = this.ingreso.items.length + 1;
  nuevoItem.id_PRODUCTO = producto;
  this.ingreso.items.push(nuevoItem);
  }

  this.AutoComplete.setValue('');
  event.option.focus();
  event.option.deselect();
}

actualizarCantidad(id: string, event: any): void {
  let cantidad: number = event.target.value as number;

  if(cantidad ==0){
      return this.eliminarItemIngreso(id);
  }

  this.ingreso.items = this.ingreso.items.map((item: Itemtransaccion) => {
    if (id === item.id_PRODUCTO.id_PRODUCTO) {
      item.cantidad = cantidad;
    }
    return item;
  });

}

existeItem(id: string): boolean {
    let existe = false;

    this.ingreso.items.forEach((item: Itemtransaccion)=>{
      if(id === item.id_PRODUCTO.id_PRODUCTO){
        existe = true;
      }
    })
    return existe;
}

incrementaCantidad(id: string): void {

  this.ingreso.items = this.ingreso.items.map((item: Itemtransaccion) => {
    if (id === item.id_PRODUCTO.id_PRODUCTO) {
      ++item.cantidad;
    }
    return item;
  });
  
}

eliminarItemIngreso(id: string):void{
  this.ingreso.items = this.ingreso.items.filter((item: Itemtransaccion)=> id !== item.id_PRODUCTO.id_PRODUCTO);
}

create(): void {

  // Obtener hora actual
  const ahora = new Date();
  const hora =
    ahora.getHours().toString().padStart(2, '0') + ':' +
    ahora.getMinutes().toString().padStart(2, '0');

  // Armar LocalDateTime compatible con Spring Boot
  // yyyy-MM-ddTHH:mm
  this.ingreso.fechatran = `${this.fechaSolo}T${hora}`;

  this.ingresoservice.crearWhingreso(this.ingreso).subscribe(ingreso => {
    this.router.navigate(['/generalwi/ingreso']);
    Swal.fire(
      'Ingreso Registrado',
      'El Ingreso de Mercadería se ha registrado con Éxito!',
      'success'
    );
  });
}

actualizarCamposJuridica():void{
  let nombre = this.ingreso.proveedor.razonsocial;
  $(function () {
    $("#empresa").val(nombre);
  });
}

actualizarCamposNatural():void{
  let nombre = this.ingreso.id_PERSONA.nombres + ' ' + this.ingreso.id_PERSONA.ape_PAT + ' ' + this.ingreso.id_PERSONA.ape_MAT;
  $(function () {
    $("#responsable").val(nombre);
  });
}

  //METODO PARA ASIGNAR LOS DATOS DE LA PERSONA COMO NUEVO PARA LA CREACION DE PERSONA Y CAMBIA EL ESTADO DEL MODAL
  abrirModalJuridica(){
    this.juridicaSeleccionada = new Juridica();
    this.modalService.abrirModal();
  }

  abrirModalNatural(){
    this.naturalSeleccionada = new Natural();
    this.modalService.abrirModal2();
  }

}
