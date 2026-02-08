import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Almacen } from '../../almacen/almacen';
import { Itemordenprod } from '../../itemordenprod/itemordenprod';
import { Juridica } from '../../juridica/juridica';
import { ModalService } from '../../modal.service';
import { Natural } from '../../natural/natural';
import { Producto } from '../../producto/producto';
import { Ordenprod } from '../ordenprod';
import { OrdenprodService } from '../ordenprod.service';
import Swal from 'sweetalert2';
import { Sector } from '../../sector/sector';
import { CategoriatransaccionService } from '../../categoriatransaccion/categoriatransaccion.service';
import { AlmacenService } from '../../almacen/almacen.service';
import { SectorService } from '../../sector/sector.service';
import { AuthService } from 'src/app/views/pages/auth/login/auth.service';
import { ProductoService } from '../../producto/producto.service';
declare var $: any;


@Component({
  selector: 'app-formordenprod',
  templateUrl: './formordenprod.component.html',
  styleUrls: []
})
export class FormordenprodComponent implements OnInit {
  ordenprod: Ordenprod = new Ordenprod();

  fechaSoloOP: string; // yyyy-MM-dd

  sector: Sector[];
  sectorinsumos: Sector[];
  
  almacen: Almacen[];
  
  juridicaSeleccionada: Juridica;
  
  naturalSeleccionada: Natural;
  
  selectedAlmacen: Almacen = { id_ALMACEN: '', nom_ALMACEN: '', estado: '',reg_USER:null,fech_REG_USER:'', fech_MOD_USER:'',mod_USER:''};
  AutoComplete = new FormControl();
  productosFiltrados: Observable<Producto[]>;
  
  constructor(private ordenprodservice: OrdenprodService, private router: Router, public modalService: ModalService, public authService: AuthService, 
    public almacenService: AlmacenService,public sectorService: SectorService,
    private categoriaService: CategoriatransaccionService, private productoService: ProductoService) { }
  
  ngOnInit(): void {
   this.almacenService.obtenerAlmacenes().subscribe(almacen => this.almacen = almacen);
   this.productosFiltrados = this.AutoComplete.valueChanges
   .pipe(
     map(value => typeof value === 'string' ? value : value.nombre),
     mergeMap(value => value ? this._filter(value) : [])
   );
  }
  
  handleAlmacenChange(id: number): void {
   this.sectorService.obtenerSectoresxAlmacen(id).subscribe((sector) => this.sector = sector);
   this.sectorService.obtenerSectoresxAlmacen(id).subscribe((sector) => this.sectorinsumos = sector);
  }
  
  private _filter(value: string): Observable<Producto[]> {
   const filterValue = value.toLowerCase();
   return this.productoService.obtenerProductosProducciónFiltrados(filterValue);
  }
  
  mostrarNombre(producto?: Producto): string | undefined {
   return producto ? producto.nombre : undefined;
  }
  
  seleccionarProducto(event: MatAutocompleteSelectedEvent): void {
   let producto = event.option.value as Producto;
  
   if(this.existeItem(producto.id_PRODUCTO)){
     this.incrementaCantidad(producto.id_PRODUCTO);
   } else {
   let nuevoItem = new Itemordenprod();
   nuevoItem.line = this.ordenprod.items.length + 1;
   nuevoItem.id_PRODUCTO = producto;
   this.ordenprod.items.push(nuevoItem);
   }
  
   this.AutoComplete.setValue('');
   event.option.focus();
   event.option.deselect();
  }
  
  actualizarCantidad(id: string, event: any): void {
   let cantidad: number = event.target.value as number;
  
   if(cantidad ==0){
       return this.eliminarItemordenprod(id);
   }
  
   this.ordenprod.items = this.ordenprod.items.map((item: Itemordenprod) => {
     if (id === item.id_PRODUCTO.id_PRODUCTO) {
       item.cantidad = cantidad;
     }
     return item;
   });
  
  }
  
  existeItem(id: string): boolean {
     let existe = false;
  
     this.ordenprod.items.forEach((item: Itemordenprod)=>{
       if(id === item.id_PRODUCTO.id_PRODUCTO){
         existe = true;
       }
     })
     return existe;
  }
  
  incrementaCantidad(id: string): void {
  
   this.ordenprod.items = this.ordenprod.items.map((item: Itemordenprod) => {
     if (id === item.id_PRODUCTO.id_PRODUCTO) {
       ++item.cantidad;
     }
     return item;
   });
   
  }
  
  
  eliminarItemordenprod(id: string):void{
   this.ordenprod.items = this.ordenprod.items.filter((item: Itemordenprod)=> id !== item.id_PRODUCTO.id_PRODUCTO);
  }
  
  create(): void{

    
  // Obtener hora actual
  const ahora = new Date();
  const hora =
    ahora.getHours().toString().padStart(2, '0') + ':' +
    ahora.getMinutes().toString().padStart(2, '0');

  // Armar LocalDateTime compatible con Spring Boot
  // yyyy-MM-ddTHH:mm
  this.ordenprod.fecha = `${this.fechaSoloOP}T${hora}`;

   let total = this.ordenprod
   this.ordenprodservice.crearOrdenprod(this.ordenprod).subscribe(ordenprod=>{
     this.router.navigate(['/generalop/ordenprod']);
     Swal.fire('Orden de Producción Registrado', `La Orden de Producción se ha registrado con Éxito!`, 'success')
   })
  }
 
  actualizarCamposNatural():void{
   let nombre = this.ordenprod.id_PERSONA.nombres + ' ' + this.ordenprod.id_PERSONA.ape_PAT + ' ' + this.ordenprod.id_PERSONA.ape_MAT;
   $(function () {
     $("#responsable").val(nombre);
   });
  }
  
   abrirModalNatural(){
     this.naturalSeleccionada = new Natural();
     this.modalService.abrirModal2();
   }

}
