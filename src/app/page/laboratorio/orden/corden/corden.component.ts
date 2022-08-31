import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap} from 'rxjs/operators';
import { ConfimService } from 'src/app/page/component/confirm/confim.service';
import { NotifierService } from 'src/app/page/component/notifier/notifier.service';
import { SpinnerService } from 'src/app/page/component/spinner/spinner.service';
import { TbMaestra } from 'src/app/_model/combobox';
import { Examen } from 'src/app/_model/configuracion/examen';
import { Orden } from 'src/app/_model/laboratorio/orden';
import { Permiso } from 'src/app/_model/permiso';
import { ConfigPermisoService } from 'src/app/_service/configpermiso.service';
import { ExamenService } from 'src/app/_service/configuracion/examen.service';
import { TbmaestraService } from 'src/app/_service/tbmaestra.service';

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

  tablasMaestras = ['TDOC', 'SEXO', 'ORIPA', 'SERV'];
  tbDocu: TbMaestra[] = [];
  tbSexo: TbMaestra[] = [];
  tbOrig: TbMaestra[] = [];
  tbServ: TbMaestra[] = [];
  tbProcedencia: TbMaestra[] = [];
  nombresUsuario?: string = '';

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
  listaPerfiles: Examen[] = [];

  fechaMax?: Date;
  
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private spinner: SpinnerService,
    private notifierService : NotifierService,
    private confirmService : ConfimService,
    private tbmaestraService: TbmaestraService,
    private configPermisoService : ConfigPermisoService,
    private examenService : ExamenService
  ) {
  }


  ngOnInit(): void {
    this.fechaMax = new Date();
    
    this.obtenerpermiso();
    
    this.inicializar();

    this.route.params.subscribe((data: Params)=>{
      this.id = (data["id"]==undefined)?0:parseInt(data["id"]);
      this.listarComodatos().then(res => {
        this.listarExamenes();
        this.listarPerfiles();
        this.obtener(true);
      });
    });
  }

  ngAfterViewInit() {
    this.stepper._getIndicatorType = () => 'number';
  }

  async listarComodatos(){
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
            var tbCombobox: TbMaestra[] = data.items;
          
            this.tbDocu = this.obtenerSubtabla(tbCombobox,'TDOC');
            this.tbSexo = this.obtenerSubtabla(tbCombobox,'SEXO');
            this.tbOrig = this.obtenerSubtabla(tbCombobox,'ORIPA');
            this.tbServ = this.obtenerSubtabla(tbCombobox,'SERV');
          }          
        }

        resolve('ok')
      });
    })
  }

  listarExamenes(search: string = '') {

    this.examenService = new ExamenService(this.http);

    merge()
      .pipe(
        startWith({}),
        switchMap(() => {
          return this.examenService!.listar(
            search
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
  
    let data = (event.target as HTMLInputElement).value;
    this.listarExamenes(data);
  }

  obtenerSubtabla(tb: TbMaestra[], cod: string){
    return tb.filter(e => e.vEtiqueta?.toString()?.trim() === cod);
  }

  inicializar(){
    this.form = new FormGroup({
      'nIdOrden': new FormControl({ value: 0, disabled: false}),
      'nNumero': new FormControl({ value: 0, disabled: false}),
      'dFecha': new FormControl({ value: new Date(), disabled: false}),
      'vTipDocu': new FormControl({ value: '', disabled: false}),
      'vDocumento': new FormControl({ value: '', disabled: false}),
      'vHC': new FormControl({ value: 0, disabled: false}),
      'dFecNacimiento': new FormControl({ value: '', disabled: false}),
      'nEdad': new FormControl({ value: '', disabled: false}),
      'vApPaterno': new FormControl({ value: '', disabled: false}),
      'vApMaterno': new FormControl({ value: '', disabled: false}),
      'vPrimerNombre': new FormControl({ value: '', disabled: false}),
      'vSegundoNombre': new FormControl({ value: '', disabled: false}),
      'vSexo': new FormControl({ value: '', disabled: false}),
      'vProcedencia': new FormControl({ value: '', disabled: false}),
      'vCama': new FormControl({ value: '', disabled: false}),
      //'vOrigen': new FormControl({ value: '', disabled: false}),
      //'vServicio': new FormControl({ value: '', disabled: false}),
    });
  }

  getControlLabel(type: string){
    return this.form.controls[type].value;
  }

  getCboDescripcion(value: string, lista: TbMaestra[]){
    return lista?.find(e => e.vValor === value)?.vDescripcion?.toUpperCase();
  }

  obtener(primeraObs: boolean = false){
    /*if(this.idPantalla === 2)
      this.pantallaPrev = 'SEGUIMIENTO -';
    if(this.idPantalla === 3)
      this.pantallaPrev = 'REVISIÓN -';
    if(this.idPantalla === 4)
      this.pantallaPrev = 'APROBACIÓN -';

    this.nombreAprobador = '';

    if(this.id > 0){
      this.spinner.showLoading();
      this.rendicionService.obtener(this.id).subscribe(data=>{
        if(data!== undefined && data.ideRendicion !== 0){
          //debugger;
          this.rendicionCargada = data;
          this.existRendicion = true;
          this.form.patchValue({
            ideRendicion: data.ideRendicion,
            codigo: data.codigo,
            lugar: data.lugar,
            motivo: data.motivo,
            ideUsuario: data.ideUsuario,
            ingresos: data.ingresos?.toFixed(2),
            gastos: data.gastos?.toFixed(2),
            ideEstado: data.ideEstado,
            estado: this.listaEstados?.find(e => e.valor === data.ideEstado)?.descripcion,
            fechaCreacion: data.vFechaCreacion,
            tipo: data.tipo,
            //Aprobador
            fechaApruebaRechaza: data.vFechaApruebaRechaza,
            ideUsuApruebaRechaza: data.ideUsuApruebaRechaza,
            obsAprobador: data.obsAprobador,
            //Revisor
            fechaRevisado: data.vFechaRevisado,
            ideUsuRevisa: data.ideUsuRevisa,
            obsRevisor: data.obsRevisor
          });

          if(data.tipo === 'M'){
            this.muestraIngresos = false;
            this.displayedColumns = this.initDisplayedColumns.filter(e => e !== 'adjunto');
          }            
          else{
            this.muestraIngresos = true;
            this.displayedColumns = this.initDisplayedColumns;
          }
            

          if(data.ideEstado === 2 && data.ideUsuApruebaRechaza !== undefined && data.ideUsuApruebaRechaza !== 0)
            this.nombreAprobador = this.buscaUsuario(data.ideUsuApruebaRechaza);

          this.url_m = data.url_M!;
          //Muestra creador de rendición
          this.curUsuario = data.ideUsuario!;
          this.nombresUsuario = this.buscaUsuario(this.curUsuario);
          //Código de rendición actual
          this.curCodigo = data.codigo!;

          this.vIngresos = data.ingresos?.toFixed(2);
          this.vGastos = data.gastos?.toFixed(2);
          this.vBalance = (data.ingresos!-data.gastos!).toFixed(2);
          //debugger;
          this.muestraEstado(data.ideEstado);

          //Muestra observaciones
          this.existenObs = data.ideEstado === 1 && ((data.obsAprobador !== undefined && data.obsAprobador !== '') || (data.obsRevisor !== undefined && data.obsRevisor !== ''));
          if(this.existenObs && primeraObs)
            this.observacion();

          this.documento= data.codigo!;
          this.dataSource = data.listaDetalle!;
          //debugger;
          if(this.dataSource.length > 0){
            this.existDetalle = true;
            this.curMoneda = this.dataSource[0].codMoneda!;
          }
          else{
            //debugger;
            this.existRendicion = true;
            setTimeout(this.changestepper, 250, undefined, 1);
          }
          
        }
        this.spinner.hideLoading();
      });
    }*/
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

  obtenerpermiso(){
    this.spinner.showLoading();
    this.configPermisoService.obtenerpermiso(forms.orden.codigo).subscribe(data=>{
      //debugger;
      this.permiso = data;
      this.spinner.hideLoading();
    });
  }

  changestepper(stepper: any, numTab: number = -1){
    if(numTab === -1)
      this.currentTab = stepper._selectedIndex;
    else
      this.currentTab = numTab;
  }

  reiniciaPaciente(){

  }

  obtenerPacienteEnter(key: number){

  }

  obtenerPaciente(e?: Event){

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

  limpiar(){
    this.inicializar();
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

