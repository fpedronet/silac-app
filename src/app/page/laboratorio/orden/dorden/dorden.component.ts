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

import { Permiso } from 'src/app/_model/permiso';
import { Orden } from 'src/app/_model/laboratorio/orden';

@Component({
  selector: 'app-dorden',
  templateUrl: './dorden.component.html',
  styleUrls: ['./dorden.component.css']
})
export class DordenComponent implements OnInit {

  form: FormGroup = new FormGroup({});
  permiso: Permiso = {};

  id: number = 0;
  edit: boolean = true;
  nombres: string = "FRANCISCO PEDRO CONDOR MARTIEZ";
  estado: string = "VALIDACION PARCIAL";
  claseEstado: string = "verde";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private spinnerService: SpinnerService,
    private notifierService : NotifierService,
    private ordenService: OrdenService,
    private configPermisoService : ConfigPermisoService,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((data: Params)=>{
      this.id = (data["id"]==undefined)? 0:data["id"];
      this.edit = (data["edit"]==undefined) ? true : ((data["edit"]=='true') ? true : false)      
    });

    this.inicializar();

    this.obtenerpermiso();

    this.obtener();
  }

  inicializar(){

    this.form = new FormGroup({
      'nIdUsuario': new FormControl({ value: 0, disabled: !this.edit}),
      'nIdPersona': new FormControl({ value: 0, disabled: !this.edit}),
      'vDocumento': new FormControl({ value: '', disabled: !this.edit}),
      'vTipDocu': new FormControl({ value: '', disabled: !this.edit}),
      'vApPaterno': new FormControl({ value: '', disabled: !this.edit}),
      'vApMaterno': new FormControl({ value: '', disabled: !this.edit}),
      'vPrimerNombre': new FormControl({ value: '', disabled: !this.edit}),
      'vSegundoNombre': new FormControl({ value: '', disabled: !this.edit}),
      'vSexo': new FormControl({ value: '', disabled: !this.edit}),
      'nEdad': new FormControl({ value: '', disabled: !this.edit}),
      'dFechaNac': new FormControl({ value: '', disabled: !this.edit}),
      'vEstCivil': new FormControl({ value: '', disabled: !this.edit}),
      'vUsuario': new FormControl({ value: '', disabled: !this.edit}),
      'vContrasena': new FormControl({ value: '', disabled: !this.edit}),
      'vColegiatura': new FormControl({ value: '', disabled: !this.edit}),
      'vCelular': new FormControl({ value: '', disabled: !this.edit}),
      'vTelefono': new FormControl({ value: '', disabled: !this.edit}),
      'vCorreo1': new FormControl({ value: '', disabled: !this.edit}),
      'vCorreo2': new FormControl({ value: '', disabled: !this.edit}),
      'nPeso': new FormControl({ value: '', disabled: !this.edit}),
      'nTalla': new FormControl({ value: '', disabled: !this.edit}),
      'vCodPais': new FormControl({ value: '', disabled: !this.edit}),
      'vCodDepa': new FormControl({ value: '', disabled: !this.edit}),
      'vCodProv': new FormControl({ value: '', disabled: !this.edit}),
      'vCodDist': new FormControl({ value: '', disabled: !this.edit}),
      'vDireccion': new FormControl({ value: '', disabled: !this.edit})
    });
  }

  obtenerpermiso(){
    this.configPermisoService.obtenerpermiso(forms.usuario.codigo).subscribe(data=>{
      this.permiso = data;
    });   
  }

  obtener(){
    // this.spinnerService.showLoading();
    // this.ordenService.obtenerdetalle(this.id).subscribe(data=>{

      // this.form.patchValue({
        // nIdUsuario: data.nIdUsuario,
        // nIdPersona: data.nIdPersona,
        // vDocumento: data.vDocumento,
        // vTipDocu: data.vTipDocu,
        // vApPaterno: data.vApPaterno,
        // vApMaterno: data.vApMaterno,
        // vPrimerNombre: data.vPrimerNombre,
        // vSegundoNombre: data.vSegundoNombre,
        // vSexo: data.vSexo,
        // nEdad: data.nEdad,
        // dFechaNac: data.dFechaNac,
        // vEstCivil: data.vEstCivil,
        // vUsuario: data.vUsuario,
        // vContrasena: data.vContrasena,
        // vColegiatura: data.vColegiatura,
        // vCelular: data.vCelular,
        // vTelefono: data.vTelefono,
        // vCorreo1: data.vCorreo1,
        // vCorreo2: data.vCorreo2,
        // nPeso: data.nPeso,
        // nTalla: data.nTalla,
        // vCodPais: data.vCodPais,
        // vCodDepa: data.vCodDepa,
        // vCodProv: data.vCodProv,
        // vCodDist: data.vCodDist,
        // vDireccion: data.vDireccion
       
      // });

      // this.spinnerService.hideLoading();
    // });
  }

  guardar(){
  }

}
