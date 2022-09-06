import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable, startWith, map, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

import forms from 'src/assets/json/formulario.json';

import { SpinnerService } from 'src/app/page/component/spinner/spinner.service';
import { OrdenService } from 'src/app/_service/laboratorio/orden.service';
import { NotifierService } from 'src/app/page/component/notifier/notifier.service';
import { ConfigPermisoService } from 'src/app/_service/configpermiso.service';
import { TbmaestraService } from 'src/app/_service/tbmaestra.service';

import { Permiso } from 'src/app/_model/permiso';
import { Orden } from 'src/app/_model/laboratorio/orden';
import { TbMaestra } from 'src/app/_model/combobox';

@Component({
  selector: 'app-dorden',
  templateUrl: './dorden.component.html',
  styleUrls: ['./dorden.component.css']
})
export class DordenComponent implements OnInit {

  form: FormGroup = new FormGroup({});
  permiso: Permiso = {};
  listaArea?: TbMaestra[] = [];
  
  idorden: number = 0;
  edit: boolean = true;
  nombres: string = "FRANCISCO PEDRO CONDOR MARTIEZ";
  estado: string = "VALIDACION PARCIAL";
  claseEstado: string = "verde";

  tablasMaestras = ['AREXA'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private spinnerService: SpinnerService,
    private notifierService : NotifierService,
    private ordenService: OrdenService,
    private configPermisoService : ConfigPermisoService,
    private tbmaestraService : TbmaestraService,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((data: Params)=>{
      this.idorden = (data["id"]==undefined)? 0:data["id"];
      this.edit = (data["edit"]==undefined) ? true : ((data["edit"]=='true') ? true : false)      
    });

    this.inicializar();

    this.obtenerpermiso();

    this.listarCombo();
  }

  inicializar(){

    this.form = new FormGroup({
      'nIdOrden': new FormControl({ value: '', disabled: true}),
      'nNumero': new FormControl({ value: '', disabled: true}),
      'vDocumento': new FormControl({ value: '', disabled: true}),
      'vFecOrden': new FormControl({ value: '', disabled: true}),
      'vProcedencia': new FormControl({ value: '', disabled: true}),
      'vServicio': new FormControl({ value: '', disabled: true}),
      'vObservaciones': new FormControl({ value: '', disabled: false}),
      'vDetalle': new FormControl({ value: '', disabled: true}),
      'vCodArea': new FormControl({ value: '', disabled: false})
      
    });
  }

  obtenerpermiso(){
    this.configPermisoService.obtenerpermiso(forms.usuario.codigo).subscribe(data=>{
      this.permiso = data;
    });   
  }

  listarCombo(){
    this.spinnerService.showLoading();
    this.tbmaestraService.cargarDatos(this.tablasMaestras).subscribe(data=>{
      this.listaArea = this.obtenerSubtabla(data.items,'AREXA');

      this.obtener();
      this.spinnerService.hideLoading();
    });
  }

  obtener(){
    this.spinnerService.showLoading();
    this.ordenService.obtenerdetalle(this.idorden).subscribe(data=>{

      this.form.patchValue({
        nIdOrden: data.nIdOrden,
        nNumero: data.nNumero,
        vDocumento: data.vDocumento,
        vFecOrden: data.vFecOrden,
        vProcedencia: data.vProcedencia,
        vServicio: data.vServicio,
        vObservaciones: data.vObservaciones,
        vDetalle: data.vDetalle,
        vCodArea: data.vCodArea =""? "999":  data.vCodArea    
      });

      this.resultadoexamen();

      this.spinnerService.hideLoading();
    });
  }

  guardar(){
  }

  resultadoexamen(){

  }

  obtenerSubtabla(tb: TbMaestra[], cod: string){
    return tb.filter(e => e.vCodTabla?.toString()?.trim() === cod);
  }

}
