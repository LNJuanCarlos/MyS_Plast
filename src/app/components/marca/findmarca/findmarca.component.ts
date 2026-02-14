import { Component, Input, OnInit } from '@angular/core';
import { ModalService } from '../../modal.service';
import { FormproductoComponent } from '../../producto/formproducto/formproducto.component';
import { Marca } from '../marca';
import { MarcaService } from '../marca.service';
declare var $: any;

@Component({
  selector: 'app-findmarca',
  templateUrl: './findmarca.component.html',
  styleUrls: []
})
export class FindmarcaComponent implements OnInit {

  @Input() marca: Marca;

  marcas:Marca[];

  constructor(private marcaService: MarcaService,public modalservice: ModalService,
     private formproductocomponent: FormproductoComponent) { }

  ngOnInit(): void {
    this.createDataTable();
  }

  cerrarModal() {
    this.modalservice.cerrarModal2();
    this.formproductocomponent.mostrarModal();
  }

  
  filtrarMarcas():void{
    this.marcaService.obtenerMarcas().subscribe((marcas) => {
    this.marcas = marcas;
    this.deleteTable();
    this.createDataTable();
    this.limpiarCampos();
  })          
 
}

createDataTable() {

  $(function () {
    $("#findmarcas").DataTable({
      "responsive": false, "lengthChange": false, "autoWidth": false, "searching": false
    }).buttons().container().appendTo('#findmarcas_wrapper .col-md-6:eq(0)');
    /*    
       $('#example1').dataTable().fnClearTable();
       $('#example1').dataTable().fnDestroy(); */

  });

}

deleteTable() {
  $('#findmarcas').dataTable().fnDestroy();
}

limpiarCampos():void{
  $(function () {
    $("#term").val('');
  });
}

seleccionarMarca(marca: Marca){
    this.marca = marca;
    this.formproductocomponent.producto.id_MARCA = marca;
    this.formproductocomponent.actualizarCamposMarca();
    this.modalservice.cerrarModal2();
    this.formproductocomponent.mostrarModal();
}

}
