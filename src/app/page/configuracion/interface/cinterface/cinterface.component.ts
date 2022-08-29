import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable, startWith, map, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';

import forms from 'src/assets/json/formulario.json';
import jsonPais from 'src/assets/json/ubigeo/pais.json';
import jsonDepartamento from 'src/assets/json/ubigeo/departamentos.json';
import jsonProvincia from 'src/assets/json/ubigeo/provincias.json';
import jsonDistrito from 'src/assets/json/ubigeo/distritos.json';

import { SpinnerService } from 'src/app/page/component/spinner/spinner.service';
import { UsuarioService } from 'src/app/_service/configuracion/usuario.service';
import { NotifierService } from 'src/app/page/component/notifier/notifier.service';
import { ConfigPermisoService } from 'src/app/_service/configpermiso.service';

import { Permiso } from 'src/app/_model/permiso';
import { TbmaestraService } from 'src/app/_service/tbmaestra.service';
import { TbMaestra } from 'src/app/_model/combobox';
import { Perfil } from 'src/app/_model/configuracion/perfil';
import { Usuario } from 'src/app/_model/configuracion/usuario';
import { Distrito, Ubigeo } from 'src/app/_model/distrito';
import { PoclabService } from 'src/app/_service/apiexterno/poclab.service';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-cinterface',
  templateUrl: './cinterface.component.html',
  styleUrls: ['./cinterface.component.css']
})
export class CinterfaceComponent implements OnInit {

  form: FormGroup = new FormGroup({});
  permiso: Permiso = {};

  id: number = 0;
  edit: boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

  guardar(){

  }

  limpiar(){
    
  }
}
