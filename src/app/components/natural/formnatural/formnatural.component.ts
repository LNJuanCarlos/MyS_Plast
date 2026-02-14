import { Component, Input, OnInit } from '@angular/core';
declare var $: any;
import swal from 'sweetalert2';
import { Departamento } from '../../departamento/departamento';
import { DepartamentoService } from '../../departamento/departamento.service';
import { Distrito } from '../../distrito/distrito';
import { DistritoService } from '../../distrito/distrito.service';
import { ModalService } from '../../modal.service';
import { Provincia } from '../../provincia/provincia';
import { ProvinciaService } from '../../provincia/provincia.service';
import { Tipodoc } from '../../tipodoc/tipodoc';
import { TipodocService } from '../../tipodoc/tipodoc.service';
import { Natural } from '../natural';
import { NaturalComponent } from '../natural.component';
import { NaturalService } from '../natural.service';

@Component({
  selector: 'app-formnatural',
  templateUrl: './formnatural.component.html',
  styleUrls: []
})
export class FormnaturalComponent implements OnInit {

  @Input() natural: Natural;

  distritos: Distrito[];

  departamentos: Departamento[];

  provincias: Provincia[];

  tipodocs: Tipodoc[];

  selectedDepartamento: Departamento = {id_departamento:'', ine_departamento:'',nom_departamento:''};

  selectedProvincia: Provincia = {id_provincia:'',id_departamento:null,ine_provincia:'',nom_provincia:''};

  constructor(private naturalService: NaturalService, public modalservice: ModalService, private naturalcom: NaturalComponent,
    private departamentoService: DepartamentoService,private provinciaService: ProvinciaService,private distritoService: DistritoService,
    private tipodocService: TipodocService) { }

  ngOnInit(): void {
    this.departamentoService.obtenerDepartamentos().subscribe((departamento) => {this.departamentos = departamento, console.log(this.departamentos)});
    this.tipodocService.obtenerTipoDoc(1).subscribe((tipodoc) => {this.tipodocs = tipodoc ,console.log(this.tipodocs)});
    if(this.natural.id_PERSONA==null){
    } else {
      this.selectedDepartamento = this.natural.id_DISTRITO.id_provincia.id_departamento;
      this.selectedProvincia = this.natural.id_DISTRITO.id_provincia;
      this.provinciaService.obtenerProvinciaporDepartamento(this.natural.id_DISTRITO.id_provincia.id_departamento.id_departamento).subscribe(provincia => this.provincias = provincia);
      this.distritoService.obtenerDistritoporProvincia(this.natural.id_DISTRITO.id_provincia.id_provincia).subscribe(distrito => this.distritos = distrito);
    }
  }
  //actualizacion para refrescar la tabla llamando al metodo de personas component y cerrar el modal luego de crear
  create(): void {
      this.naturalService.crearPersonaNatural(this.natural)
      .subscribe(json => {
        this.cerrarModal();
        swal.fire('Nueva Persona Natural', `${json.mensaje}: ${json.natural.nombres} `, 'success')
      })
    this.cerrarModal();
  }

  soloNumerosDocumento(event: any) {
    const input = event.target;
    input.value = input.value.replace(/[^0-9]/g, '');
    this.natural.nrodoc = input.value;
  }

  soloNumerosTelefono(event: any) {
    const input = event.target;
    input.value = input.value.replace(/[^0-9]/g, '');
    this.natural.telefono = input.value;
  }

  update(): void {
    this.naturalService.actualizarPersonaNatural(this.natural)
      .subscribe(json => {
        this.cerrarModal();
        swal.fire('Persona Natural Actualizada', `${json.mensaje}: ${json.natural.nombres}`, 'success')
      })
  }


  compararDistrito(o1: Distrito, o2: Distrito) {
    return o1 == null || o2 == null ? false : o1.id_distrito == o2.id_distrito;
  }

  compararDepartamento(o1: Departamento, o2: Departamento) {
    return o1 == null || o2 == null ? false : o1.id_departamento == o2.id_departamento;
  }

  compararProvincia(o1: Provincia, o2: Provincia) {
    return o1 == null || o2 == null ? false : o1.id_provincia == o2.id_provincia;
  }

  compararTipodoc(o1: Tipodoc, o2: Tipodoc) {
    return o1 == null || o2 == null ? false : o1.id_TIPODOC
      == o2.id_TIPODOC;
  }

  handleDepartamentoChange(dept: string): void {
    this.provinciaService.obtenerProvinciaporDepartamento(dept).subscribe((provincia) => this.provincias = provincia);
  }

  handleProvinciaChange(id: string): void {
    this.distritoService.obtenerDistritoporProvincia(id).subscribe((distrito) => this.distritos = distrito);
  }


  cerrarModal() {
    this.modalservice.cerrarModal();
    this.naturalcom.deleteTable();
    this.naturalcom.cargarPersonasNaturales();

  }


}
