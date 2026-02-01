import { Component, Input, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Categoria } from '../../categoria/categoria';
import { CategoriaService } from '../../categoria/categoria.service';
import { Marca } from '../../marca/marca';
import { MarcaService } from '../../marca/marca.service';
import { ModalService } from '../../modal.service';
import { Unmedida } from '../../unmedida/unmedida';
import { UnmedidaService } from '../../unmedida/unmedida.service';
import { Producto } from '../producto';
import { ProductoComponent } from '../producto.component';
import { ProductoService } from '../producto.service';
declare var $: any;

@Component({
  selector: 'app-formproducto',
  templateUrl: './formproducto.component.html',
  styleUrls: []
})
export class FormproductoComponent implements OnInit {

  @Input() producto: Producto;
  marcas: Marca[];
  categorias: Categoria[];
  unmedidas: Unmedida[];
  marcaSeleccionada: Marca = {id_MARCA:'',nom_MARCA:'',fech_REG_USER:'',reg_USER:''};
  categoriaSeleccionada: Categoria = {id_CATEGORIA:'',nom_CATEGORIA:'',fech_REG_USER:'',reg_USER:''};
  unmedidaSeleccionada: Unmedida = {id_UNMEDIDA:'',nom_UNMEDIDA:'',fech_REG_USER:'',reg_USER:''};

  constructor(private productoService: ProductoService, private unmedidaService: UnmedidaService,
    private categoriaService: CategoriaService, private marcaService: MarcaService, public modalservice: ModalService, private productocom: ProductoComponent) { }

  ngOnInit(): void {
    this.cargadeDatos();
  }

  cargadeDatos(){
    this.unmedidaService.obtenerUnmedidas().subscribe(
      (unmedida)=>{
        this.unmedidas = unmedida
      });
    this.categoriaService.obtenerCategorias().subscribe(
        (categoria)=>{
          this.categorias = categoria
      });
    this.marcaService.obtenerMarcas().subscribe(
        (marca)=>{
            this.marcas = marca
          }
    )
  }

  create(): void {
    console.log(this.producto)
    if(this.producto.id_MARCA==null){
      Swal.fire('Error"', 'Tiene que seleccionar una Marca!', 'error')
    } else {
    this.productoService.crearProducto(this.producto)
      .subscribe(json => {
        Swal.fire('Nuevo Producto', `${json.mensaje}: ${json.producto.nombre} `, 'success')
        this.cerrarModal();
      })
    }
  }

  update(): void {
    this.productoService.actualizarProducto(this.producto)
      .subscribe(json => {
        
        this.cerrarModal();
        Swal.fire('Producto Actualizado', `${json.mensaje}: ${json.producto.nombre} `, 'success')
      })
  }
  
  compararMarca(o1: Marca, o2: Marca): boolean {
    return o1 == null || o2 == null ? false : o1.id_MARCA == o2.id_MARCA;
  }

  compararUnmedida(o1: Unmedida, o2: Unmedida): boolean {
    return o1 == null || o2 == null ? false : o1.id_UNMEDIDA == o2.id_UNMEDIDA;
  }

  compararCategoria(o1: Categoria, o2: Categoria): boolean {
    return o1 == null || o2 == null ? false : o1.id_CATEGORIA == o2.id_CATEGORIA;
  }
  
  actualizarCamposMarca():void{
    let nombre = this.producto.id_MARCA.nom_MARCA;
    $(function () {
      $("#marca").val(nombre);
    });
  }

  cerrarModal() {
    if(this.modalservice.modal2=true){
      this.modalservice.cerrarModal2();
    }
    this.modalservice.cerrarModal();
    this.productocom.deleteTable();
    this.productocom.cargarProductos();
  }

  ocultarModal():void{
    var el = document.getElementById("formproducto");
    el.setAttribute("style", "display:none;");
  }

  mostrarModal(){
    var el = document.getElementById("formproducto");
    el.setAttribute("style", "display:table;");
  }

  abrirModalMarca(){
      this.ocultarModal();
      this.marcaSeleccionada = new Marca();
      this.modalservice.abrirModal2();
  }
}
