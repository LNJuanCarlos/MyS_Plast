import { Component, Input, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Actividad } from '../../actividad/actividad';
import { ActividadService } from '../../actividad/actividad.service';
import { Departamento } from '../../departamento/departamento';
import { DepartamentoService } from '../../departamento/departamento.service';
import { Distrito } from '../../distrito/distrito';
import { DistritoService } from '../../distrito/distrito.service';
import { ModalService } from '../../modal.service';
import { Provincia } from '../../provincia/provincia';
import { ProvinciaService } from '../../provincia/provincia.service';
import { Tipodoc } from '../../tipodoc/tipodoc';
import { TipodocService } from '../../tipodoc/tipodoc.service';
import { Juridica } from '../juridica';
import { JuridicaComponent } from '../juridica.component';
import { JuridicaService } from '../juridica.service';
declare var $: any;

@Component({
  selector: 'app-formjuridica',
  templateUrl: './formjuridica.component.html',
  styleUrls: []
})
export class FormjuridicaComponent implements OnInit {

 //SE INYECTA LA CLASE PERSONA

 @Input() juridica: Juridica;

 distritos: Distrito[];

 departamentos: Departamento[];

 provincias: Provincia[];

 tipodocs: Tipodoc[];

 actividades: Actividad[];

 selectedDepartamento: Departamento = { id_departamento: '', ine_departamento: '', nom_departamento: '' };

 selectedProvincia: Provincia = { id_provincia: '', id_departamento: null, ine_provincia: '', nom_provincia: '' };

 constructor(private juridicaService: JuridicaService, public modalservice: ModalService, private juridicacom: JuridicaComponent,
  private departamentoService: DepartamentoService,private provinciaService: ProvinciaService,private distritoService: DistritoService,
  private tipodocService: TipodocService, private actividadService: ActividadService) { }

 ngOnInit(): void {
   this.departamentoService.obtenerDepartamentos().subscribe(departamento => this.departamentos = departamento);
   this.tipodocService.obtenerTipoDoc(2).subscribe(tipodoc => this.tipodocs = tipodoc);
   this.actividadService.obtenerActividades().subscribe(actividad => this.actividades = actividad);
   if (this.juridica.id_PERSONA == null) {
   } else {
     this.selectedDepartamento = this.juridica.id_DISTRITO.id_provincia.id_departamento;
     this.selectedProvincia = this.juridica.id_DISTRITO.id_provincia;
     this.provinciaService.obtenerProvinciaporDepartamento(this.juridica.id_DISTRITO.id_provincia.id_departamento.id_departamento).subscribe(provincia => this.provincias = provincia);
     this.distritoService.obtenerDistritoporProvincia(this.juridica.id_DISTRITO.id_provincia.id_provincia).subscribe(distrito => this.distritos = distrito);
   }
 }
 //actualizacion para refrescar la tabla llamando al metodo de personas component y cerrar el modal luego de crear
 create(): void {

   this.juridicaService.crearPersonaJurídica(this.juridica)
     .subscribe(json => {
       this.cerrarModal();
       Swal.fire('Nueva Persona Jurídica', `${json.mensaje}: ${json.juridica.razonsocial} `, 'success')
     })
   
 }

 soloNumerosRuc(event: any) {
  const input = event.target;
  input.value = input.value.replace(/[^0-9]/g, '');
  this.juridica.nrodoc = input.value;
 }

 soloNumerosTelefono(event: any) {
  const input = event.target;
  input.value = input.value.replace(/[^0-9]/g, '');
  this.juridica.telefono = input.value;
 }

 update(): void {
   this.juridicaService.actualizarPersonaJuridica(this.juridica)
     .subscribe(json => {
       this.cerrarModal();
       Swal.fire('Persona Jurídica Actualizada', `${json.mensaje}: ${json.juridica.razonsocial}`, 'success')
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

 compararActividades(o1: Actividad, o2: Actividad) {
  return o1 == null || o2 == null ? false : o1.id_ACTIVIDAD == o2.id_ACTIVIDAD;
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
   this.juridicacom.deleteTable();
   this.juridicacom.cargarPersonasJurídicas();

 }

}
