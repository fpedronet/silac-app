import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap} from 'rxjs/operators';
import { TbMaestra } from 'src/app/_model/combobox';
import { Examen, PerfilExamen } from 'src/app/_model/configuracion/examen';

import { Orden } from 'src/app/_model/laboratorio/orden';
import { Permiso } from 'src/app/_model/permiso';

import { ConfigPermisoService } from 'src/app/_service/configpermiso.service';
import { ExamenService } from 'src/app/_service/configuracion/examen.service';
import { OrdenService } from 'src/app/_service/laboratorio/orden.service';
import { TbmaestraService } from 'src/app/_service/tbmaestra.service';
import { ConfimService } from 'src/app/page/component/confirm/confim.service';
import { NotifierService } from 'src/app/page/component/notifier/notifier.service';
import { SpinnerService } from 'src/app/page/component/spinner/spinner.service';
import { PoclabService } from 'src/app/_service/apiexterno/poclab.service';

import forms from 'src/assets/json/formulario.json';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-corden',
  templateUrl: './corden.component.html',
  styleUrls: ['./corden.component.css']
})
export class CordenComponent implements OnInit {

  @ViewChild(MatStepper)
  stepper!: MatStepper;

  form: FormGroup = new FormGroup({});
  permiso: Permiso = {};

  tablasMaestras = ['AREXA', 'TDOC', 'SEXO', 'ORIPA', 'SERV', 'ESCIV'];
  tbArea: TbMaestra[] = [];
  tbDocu: TbMaestra[] = [];
  tbSexo: TbMaestra[] = [];
  tbCivil: TbMaestra[] = [];
  tbOrig: TbMaestra[] = [];
  tbServ: TbMaestra[] = [];
  tbProcedencia: TbMaestra[] = [];
  nombresUsuario?: string = '';

  nombres: string = "";
  documento: string = "";
  idTipoDocumento: string = '';
  findText: string = '';
  selectedArea: string = '';
  selectedPerfil: number[] = [];

  codigo?: number;
  id: number = 0;
  objCargado?: Orden;
  edit: boolean = true;
  $disable: boolean =false;
  currentTab: number = 0;
  flaghemograma: string = '0';
  flagorina: string = '0';

  //dataSource: RendicionD[] = [];
  initDisplayedColumns: string[] = ['concepto', 'vFecha', 'documento', 'vMonto', 'proveedor', 'descripcion', 'comodato', 'adjunto', 'accion', 'mo'];
  displayedColumns: string[] = [];

  listaExamenes: Examen[] = [];
  listaPerfiles: PerfilExamen[] = [];

  fechaNac: Date | null = null;
  maxDate: Date = new Date();
  minDate: Date = new Date();
  fechaMax: Date = new Date();

  
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private spinnerService: SpinnerService,
    private notifierService : NotifierService,
    private confirmService : ConfimService,
    private tbmaestraService: TbmaestraService,
    private configPermisoService : ConfigPermisoService,
    private examenService : ExamenService,
    private ordenService : OrdenService,
    private poclabService: PoclabService

  ) {

  }


  ngOnInit(): void {
    this.maxDate = new Date();

    this.route.params.subscribe((data: Params)=>{
      this.id = (data["id"]==undefined)? 0:data["id"];
      this.edit = (data["edit"]==undefined) ? true : ((data["edit"]=='true') ? true : false)      
    });

    this.inicializar();

    this.obtenerpermiso();

    this.listarMaestros().then(res => {
      this.listarExamenes();
      this.listarPerfiles();        
      this.obtener();
    });

    this.minDate.setMonth(this.maxDate.getMonth() - 12*120);  
  }

  ngAfterViewInit() {
    this.stepper._getIndicatorType = () => 'number';
  }

  inicializar(){
    this.form = new FormGroup({
      'nIdOrden': new FormControl({ value: 0, disabled: !this.edit}),
      'nNumero': new FormControl({ value: '', disabled: !this.edit}),
      'vHC': new FormControl({ value: '', disabled: !this.edit}),
      'nCantMuestras': new FormControl({ value: '', disabled: !this.edit}),
      'dFecOrden': new FormControl({ value: new Date(), disabled: !this.edit}),
      'vCodBarras': new FormControl({ value: '', disabled: !this.edit}),
      'vProcedencia': new FormControl({ value: '', disabled: !this.edit}),
      'vCama': new FormControl({ value: '', disabled: !this.edit}),
      'vOrigen': new FormControl({ value: '', disabled: !this.edit}),
      'vServicio': new FormControl({ value: '', disabled: !this.edit}),


      'nIdPersona': new FormControl({ value: 0, disabled: !this.edit}),
      'vTipDocu': new FormControl({ value: '', disabled: !this.edit}),
      'vDocumento': new FormControl({ value: '', disabled: !this.edit}),
      'vApPaterno': new FormControl({ value: '', disabled: !this.edit}),
      'vApMaterno': new FormControl({ value: '', disabled: !this.edit}),
      'vPrimerNombre': new FormControl({ value: '', disabled: !this.edit}),
      'vSegundoNombre': new FormControl({ value: '', disabled: !this.edit}),
      'vSexo': new FormControl({ value: '', disabled: !this.edit}),
      'vEstCivil': new FormControl({ value: '', disabled: !this.edit}),
      'dFechaNac': new FormControl({ value: '', disabled: !this.edit}),
      'nEdad': new FormControl({ value: '', disabled: !this.edit}),   

    });
  }

  obtenerpermiso(){
    this.configPermisoService.obtenerpermiso(forms.orden.codigo).subscribe(data=>{
      this.permiso = data;
    });
  }

  async listarMaestros(){
    return new Promise(async (resolve) => {
    
      this.tbmaestraService.cargarDatos(this.tablasMaestras).subscribe(data=>{
        if(data === undefined){
          this.notifierService.showNotification(0,'Mensaje','Error en el servidor');
        }
        else{
          if(data.items === null){
            this.notifierService.showNotification(0,'Mensaje','No se ha encontrado información');
          }
          else{
         
            this.tbArea = this.obtenerSubtabla(data.items,'AREXA');
            this.tbDocu = this.obtenerSubtabla(data.items,'TDOC');
            this.tbSexo = this.obtenerSubtabla(data.items,'SEXO');
            this.tbOrig = this.obtenerSubtabla(data.items,'ORIPA');
            this.tbServ = this.obtenerSubtabla(data.items,'SERV');
            this.tbCivil = this.obtenerSubtabla(data.items,'ESCIV');

            //DNI por defecto
            this.idTipoDocumento = this.tbDocu.length>0? this.tbDocu[0].vValor! : '';

            //Área por defecto
            if(this.tbArea.length > 0)
              this.selectedArea = this.tbArea[0].vValor!;
          }          
        }

        resolve('ok')
      });
    })
  }

  obtener(){
    this.ordenService.obtener(this.id).subscribe(data=>{

      data.vTipDocu = (data.vTipDocu==null)?  this.idTipoDocumento: data.vTipDocu;
      data.dFecOrden= (data.dFecOrden==null)? this.fechaMax: data.dFecOrden;

      this.form.patchValue({
        nIdOrden: data.nIdOrden,
        nNumero: data.nNumero,
        vHC: data.vHC,
        nCantMuestras: data.nCantMuestras,
        dFecOrden: data.dFecOrden,
        vCodBarras: data.vCodBarras,
        vObservaciones: data.vObservaciones,
        nIdEstado: data.nIdEstado,
        vProcedencia: data.vProcedencia,
        vCama: data.vCama,
        vOrigen: data.vOrigen,
        vServicio: data.vServicio,
        vEstado: data.vEstado,
        nFlagHemograma: data.nFlagHemograma,
        nFlagOrina: data.nFlagOrina,

        nIdPersona: data.nIdPersona,
        vTipDocu : data.vTipDocu,
        vDocumento: data.vDocumento,
        vApPaterno: data.vApPaterno,
        vApMaterno: data.vApMaterno,
        vPrimerNombre: data.vPrimerNombre,
        vSegundoNombre: data.vSegundoNombre,
        vSexo: data.vSexo,
        vEstCivil: data.vEstCivil,
        dFechaNac: data.dFechaNac,
        nEdad: data.nEdad,      
      });

      if(this.id != 0){
        this.flaghemograma = data.nFlagHemograma?.toString()!;
        this.flagorina = data.nFlagOrina?.toString()!;
      }

    });
  }

  listarExamenes() {

    this.examenService = new ExamenService(this.http);

    merge()
      .pipe(
        startWith({}),
        switchMap(() => {
          return this.examenService!.listar(
            this.findText, [], this.selectedArea
          ).pipe(catchError(() => observableOf(null)));
        }),
        map(res => {

          if (res === null) {
            return [];
          }         

          return res.items;
        }),
      ).subscribe(data => (this.listaExamenes = data));
  }

  listarPerfiles(search: string = ''){ 
    this.examenService = new ExamenService(this.http);

    merge()
      .pipe(
        startWith({}),
        switchMap(() => {
          return this.examenService!.listarPerfil(
            search
          ).pipe(catchError(() => observableOf(null)));
        }),
        map(res => {

          if (res === null) {
            return [];
          }

          return res.items;
        }),
      ).subscribe(data => (this.listaPerfiles = data));
      
  }

  buscaTexto(event: Event) {  
    this.findText = (event.target as HTMLInputElement).value;
    this.listarExamenes();
  }

  cambiaArea(area: string) {  
    this.selectedArea = area;
    this.listarExamenes();
  }

  cambiaPerfil(ob: MatCheckboxChange, id: number = 0) {
    //Obteniene exámenes
    if(id > 0){
      //this.spinner.showLoading();
      this.examenService.obtenerPerfil(id).subscribe(data=>{
        if(data!== undefined){
          var examenes = data.listaExamenesA;
          //Marca exámenes
          var filterExamenes = this.listaExamenes.filter(e => examenes.some(f => f.nIdExamen === e.nIdExamen))
          filterExamenes.forEach(e => {
            e.selected = ob.checked;
          });

          //this.spinner.hideLoading();
        }
      });
    }
  }  

  obtenerSubtabla(tb: TbMaestra[], cod: string){
    return tb.filter(e => e.vCodTabla?.toString()?.trim() === cod);
  }

  getControlLabel(type: string){
    return this.form.controls[type].value;
  }

  getCboDescripcion(value: string, lista: TbMaestra[]){
    return lista?.find(e => e.vValor === value)?.vDescripcion?.toUpperCase();
  }

  changestepper(stepper: any, numTab: number = -1){
    if(numTab === -1)
      this.currentTab = stepper._selectedIndex;
    else
      this.currentTab = numTab;
  }

  cambiaFechaNac(dateStr: string){
    var arrDate = this.separarFecha(dateStr);
    if(arrDate.length === 0)
      this.fechaNac = null;
    else{
      var d = new Date(arrDate[2], arrDate[1]-1, arrDate[0]);
      if(d < this.minDate || d > this.maxDate)
        this.fechaNac = null;
      else
        this.updateFechaNac(d);
    }
  }

  separarFecha(cad: string){
    var arrStr: string[] = [];
    var arr: number[] = [];
    arrStr = cad.split('/');
    if(arrStr.length !== 3)
      return arr;
    else{
      for (let str of arrStr){
        let num = parseInt(str);
        if(num === null){
          arr = [];
          break;
        }
        else
          arr.push(num)
      }
      return arr;
    }
  }

  updateFechaNac(d: Date){
    this.fechaNac = d;
    if(this.form.get('nEdad') !== undefined){
      var edad = this.calcularEdad(d);
      this.form.patchValue({
        nEdad: edad.toString()
      });
    }
  }

  calcularEdad(date: Date) {
    var hoy = new Date();
    var cumpleanos = new Date(date);
    var edad = hoy.getFullYear() - cumpleanos.getFullYear();
    var m = hoy.getMonth() - cumpleanos.getMonth();

    if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
        edad--;
    }

    return edad;
  }

  obtenerPersona(e?: any){
    debugger;
    var tipoDocu =this.form.value['vTipDocu']
    var documento =this.form.value['vDocumento']

    if(documento!=this.documento){
      var validacion = this.validaDocumento(tipoDocu, documento);

      if(validacion === ''){
  
        this.spinnerService.showLoading();
        this.poclabService.obtenerPersonaLocal(tipoDocu, documento).subscribe(data=>{
  
          data.vTipDocu = (data.vTipDocu==null)?  this.idTipoDocumento: data.vTipDocu;
  
          if(data.vDocumento!="" && data.vDocumento!=null){
            this.form.patchValue({
              vApPaterno: data.vApPaterno,
              vApMaterno: data.vApMaterno,
              vPrimerNombre: data.vPrimerNombre,
              vSegundoNombre: data.vSegundoNombre,
              vSexo: data.vSexo,
              nEdad: data.nEdad,
              dFechaNac: data.dFechaNac,
              vEstCivil: data.vEstCivil
            });  
             
            this.nombres = data.vNombreCompleto!;
            this.documento = data.vDocumento!;
  
            this.spinnerService.hideLoading();
          }else{
            this.poclabService.obtenerPersonaReniec("1", documento).subscribe(data=>{
  
              let estadocivil = (data.vCodEstadoCivil =="01")? "00001": (data.vCodEstadoCivil =="02"? "00002": null)

              if(data.vDocumento!="" && data.vDocumento!=null){
                this.form.patchValue({
                  vApPaterno: data.vApePaterno,
                  vApMaterno: data.vApeMaterno,
                  vPrimerNombre: data.vPrimerNombre,
                  vSegundoNombre: data.vSegundoNombre,
                  vSexo: data.vSexo,
                  nEdad: data.nEdad,
                  dFechaNac: data.dteNacimiento,
                  vEstCivil: estadocivil
                });
                      
                this.nombres = data.vApePaterno + " "+ data.vApeMaterno + " "+ data.vPrimerNombre + " "+data.vSegundoNombre
                this.documento = data.vDocumento!;
              }  
              
              this.spinnerService.hideLoading();
            });
          }
        });
      }else{
        if(validacion !== 'El tipo de documento y el documento no pueden estar vacíos')
          this.notifierService.showNotification(2,'Mensaje',validacion);
          this.borrarDato();
      } 
   }
  }

  esEntero(cadena: string){
    const regex = /^[0-9]+$/;
    return regex.test(cadena);
  }

  borrarDato(){
    this.form.patchValue({
      vDocumento: null,
      vApPaterno: null,
      vApMaterno: null,
      vPrimerNombre: null,
      vSegundoNombre: null,
      vSexo: null,
      nEdad: null,
      dFechaNac: null,
      vEstCivil: null
   });

    this.nombres = "";
    this.documento = "";
   
  }

  validaDocumento(tipoDocu: string, numDocu: string){
    if(tipoDocu == '' && numDocu == '')
        return 'El tipo de documento y el documento no pueden estar vacíos';

    var noEsNro = !this.esEntero(numDocu);
    
    //DNI
    if(tipoDocu == '00001'){
      if(numDocu==null  || numDocu=="")
        return 'Ingrese el Nro Documento';
      if(numDocu.length !== 8)
        return 'El DNI debe tener 8 dígitos';
      if(noEsNro)
        return 'El DNI debe debe contener solo números';
    }

    //PASS
    if(tipoDocu == '00002'){
      if(numDocu==null || numDocu=="")
        return 'Ingrese el Nro Documento';
      if(numDocu.length > 12)
        return 'El PASS no puede exceder 12 dígitos';
    }

    //CEXT
    if(tipoDocu == '00004'){
      if(numDocu==null || numDocu=="")
        return 'Ingrese el Nro Documento';
      if(numDocu.length > 12)
        return 'El CEXT no puede exceder 12 dígitos';
    }

    //HC, DIN, PARTNAC, NEO, OTROS
    if(numDocu==null || numDocu=="")
        return 'Ingrese el Nro Documento';

    return '';
  }

  guardar(){
    let model = new Orden();

    /*Persona */    
    model.vTipDocu= this.form.value['vTipDocu'];
    model.vDocumento= this.form.value['vDocumento'];
    model.vApPaterno= this.form.value['vApPaterno'];
    model.vApMaterno= this.form.value['vApMaterno'];
    model.vPrimerNombre= this.form.value['vPrimerNombre'];
    model.vSegundoNombre= this.form.value['vSegundoNombre'];
    model.vSexo= this.form.value['vSexo'];
    model.vEstCivil= this.form.value['vEstCivil'];
    model.dFechaNac= this.form.value['dFechaNac'];
    model.nEdad= (this.form.value['nEdad']==null || this.form.value['nEdad']=="")? null : this.form.value['nEdad'].toString();
    model.swt= 1;

    
    /*Orden*/
    model.nIdOrden= this.form.value['nIdOrden'];
    model.nNumero= this.form.value['nNumero'];
    model.vHC= this.form.value['vHC'];
    model.nCantMuestras= 1;
    model.dFecOrden= this.form.value['dFecOrden'];
    model.vProcedencia= this.form.value['vProcedencia'];
    model.vCama= this.form.value['vCama'];
    model.vOrigen= this.form.value['vOrigen'];
    model.vServicio= this.form.value['vServicio'];
    model.nFlagHemograma=  parseInt(this.flaghemograma);
    model.nFlagOrina= parseInt(this.flagorina);
    model.nIdEstado= 1;


    /*Examenes */  

    this.spinnerService.showLoading();
    this.ordenService.guardar(model).subscribe(data=>{

    this.notifierService.showNotification(data.typeResponse!,'Mensaje',data.message!);

      if(data.typeResponse==environment.EXITO){
        this.router.navigate(['/page/laboratorio/ordenes']);
        this.spinnerService.hideLoading();
      }else{
        this.spinnerService.hideLoading();
      }
    });

  }

  changeflag(estado: string, flag: string){
    if(flag=='hemograma'){
      this.flaghemograma = estado
    }
    else if(flag=='orina'){
      this.flagorina = estado
    }
  }
}

