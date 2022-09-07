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

  //dataSource: RendicionD[] = [];
  initDisplayedColumns: string[] = ['concepto', 'vFecha', 'documento', 'vMonto', 'proveedor', 'descripcion', 'comodato', 'adjunto', 'accion', 'mo'];
  displayedColumns: string[] = [];

  listaExamenes: Examen[] = [];
  listaPerfiles: PerfilExamen[] = [];

  fechaMax?: Date;
  
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
    this.fechaMax = new Date();

    this.route.params.subscribe((data: Params)=>{
      this.id = (data["id"]==undefined)?0:parseInt(data["id"]);
      this.edit = (data["edit"]==undefined) ? true : ((data["edit"]=='true') ? true : false)      
    });

    this.inicializar();

    this.obtenerpermiso();

    this.listarMaestros().then(res => {
      this.listarExamenes();
      this.listarPerfiles();        
      this.obtener();
    });
  }

  ngAfterViewInit() {
    this.stepper._getIndicatorType = () => 'number';
  }

  inicializar(){
    this.form = new FormGroup({
      'nIdOrden': new FormControl({ value: 0, disabled: !this.edit}),
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

      'vHC': new FormControl({ value: 0, disabled: !this.edit}),
      'dFecha': new FormControl({ value: new Date(), disabled: !this.edit}),
      'vProcedencia': new FormControl({ value: '', disabled: !this.edit}),
      'vCama': new FormControl({ value: '', disabled: !this.edit}),
      'nNumero': new FormControl({ value: 0, disabled: !this.edit}),

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

      this.form.patchValue({
        nIdOrden: data.nIdOrden,
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
        vHC: data.vHC,
        dFecOrden: data.dFecOrden,
        vProcedencia: data.vProcedencia,
        vCama: data.vCama       
      });

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



  camposCambiados(orden: Orden){
    /*var lugar: boolean = rend.lugar !== this.getControlLabel('lugar');
    var motivo: boolean = rend.motivo !== this.getControlLabel('motivo');
    var tipo: boolean = rend.tipo !== this.getControlLabel('tipo');
    var ingresos: boolean = rend.ingresos !== Number(this.getControlLabel('ingresos'));
    //debugger;
    return lugar || motivo || tipo || ingresos;*/
    return false;
  }

 

  changestepper(stepper: any, numTab: number = -1){
    if(numTab === -1)
      this.currentTab = stepper._selectedIndex;
    else
      this.currentTab = numTab;
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
      /*let model = new RendicionM();
     
      model.ideUsuario = this.form.value['ideUsuario'];
      model.ideRendicion = this.form.value['ideRendicion'];
      model.lugar = this.form.value['lugar'];
      model.motivo = this.form.value['motivo'];
      model.montoRecibe = this.form.value['ingresos'];
      model.tipo = this.form.value['tipo'];
      model.fechaCreacion = new Date();

      this.spinner.showLoading();
      //debugger;
      this.rendicionService.guardar(model).subscribe(data=>{
  
        this.notifierService.showNotification(data.typeResponse!,'Mensaje',data.message!);
  
          if(data.typeResponse==environment.EXITO){

            if(this.id === 0){ // Cambia de pestaña y actualiza id en el primer registro
              this.existRendicion = true;
              this.currentTab = 1; //Segunda pestaña
              this.id = data.ide!;
              //debugger;
              this.router.navigate(['/page/administracion/rendicion/'+this.idPantalla+'/edit/',this.id]);
            }
            this.obtener();
            
            this.spinner.hideLoading();
          }else{
            this.spinner.hideLoading();
          }
        });*/
    }

  /*abrirDetalle(rendDet?: RendicionD){
    //debugger;
    var enRevision = this.tienepermiso(this.sgteEstadoR) && this.sgteEstadoR === 6;

    const dialogRef = this.dialog.open(CdetalleComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      width: '850px',
      panelClass: 'full-screen-modal',
      disableClose: true,
      data: {
        idPadre: this.id,
        edit: this.edit,
        tipoPadre: this.getControlLabel('tipo'),
      }
    });

    //dialogRef.beforeClosed().subscribe(res)

    dialogRef.afterClosed().subscribe(res => {
      if(res!=""){
        this.obtener();
      }
    })
  }*/
}

